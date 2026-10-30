/* Real HTTP smoke test against an isolated, disposable Atlas database. No live inventory is edited. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const root = process.env.E2E_CATALOG_ROOT || path.resolve(__dirname, '..');
const erp = process.env.E2E_ERP_ROOT || 'D:/erp phones/server';
const erpRequire = createRequire(path.join(erp, 'package.json'));

if (process.argv.includes('--erp-child')) {
  erpRequire('ts-node').register({ transpileOnly: true, project: path.join(erp, 'tsconfig.json') });
  require(path.join(erp, 'src/server.ts'));
  process.on('message', async message => {
    if (message === 'stop') {
      require(path.join(erp, 'src/modules/storefront/storefront-sync.worker.ts')).StorefrontSyncWorker.stop();
      await erpRequire('mongoose').disconnect();
      process.exit(0);
    }
  });
} else if (process.argv.includes('--catalog-child')) {
  (async () => {
    const config = (await import(pathToFileURL(path.join(root, 'next.config.mjs')).href)).default;
    const app = require('next')({ dev: true, webpack: true, dir: root, hostname: '127.0.0.1', port: Number(process.env.E2E_PORT), conf: { ...config, distDir: process.env.E2E_DIST } });
    await app.prepare();
    const server = require('node:http').createServer(app.getRequestHandler());
    server.listen(Number(process.env.E2E_PORT), '127.0.0.1');
    process.on('message', async message => {
      if (message === 'stop') {
        server.closeAllConnections(); server.close(); await app.close(); process.exit(0);
      }
    });
  })().catch(error => { console.error(error.stack || error.message); process.exit(1); });
} else {
  main().catch(() => { process.exitCode = 1; });
}

async function freePort() {
  const server = require('node:net').createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function main() {
  const { MongoClient, ObjectId } = require('mongodb');
  const dotenv = erpRequire('dotenv');
  const config = dotenv.parse(fs.readFileSync(path.join(erp, '.env')));
  const runId = crypto.randomBytes(8).toString('hex');
  const databaseName = 'moblix_e2e_' + runId;
  const dbClient = new MongoClient(config.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const steps = [];
  const children = [];
  const dist = '.next/e2e/' + runId;
  const tsConfigPath = path.join(root, 'tsconfig.json');
  const originalTsConfig = fs.readFileSync(tsConfigPath, 'utf8');
  let db, imagePath, stage = 'connect';
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const passed = name => { steps.push({ name, passed: true }); console.log('PASS: ' + name); };
  const start = (mode, env, cwd) => {
    const child = spawn(process.execPath, [__filename, mode], { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe', 'ipc'], windowsHide: true });
    // Keep application logs private; they may contain environment-specific diagnostics.
    child.errorText = ''; child.stdout.on('data', () => {}); child.stderr.on('data', data => { if (mode === '--catalog-child') child.errorText = (child.errorText + String(data).replace(/mongodb(?:\+srv)?:\/\/[^\s]+/g, '[redacted-uri]')).slice(-2000); });
    children.push(child); return child;
  };
  const waitFor = async (url, child) => {
    const until = Date.now() + 120000;
    while (Date.now() < until) {
      if (child.exitCode !== null) throw new Error('Test service exited before becoming ready: ' + child.errorText);
      try { const response = await fetch(url, { signal: AbortSignal.timeout(25000) }); if (response.ok) return; } catch {}
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error('Test service startup timed out');
  };
  let report;
  try {
    await dbClient.connect();
    db = dbClient.db(databaseName);
    await db.collection('e2e_runs').insertOne({ runId, disposable: true, createdAt: new Date() });
    const apiPort = await freePort(), catalogPort = await freePort();
    const api = 'http://127.0.0.1:' + apiPort, catalog = 'http://127.0.0.1:' + catalogPort;
    const testUri = new URL(config.MONGODB_URI);
    testUri.pathname = '/' + databaseName;
    if (dbClient.options.credentials?.source) testUri.searchParams.set('authSource', dbClient.options.credentials.source);
    const branchId = new ObjectId(), roleId = new ObjectId();
    const email = 'catalog-e2e-' + runId + '@example.invalid', password = crypto.randomBytes(24).toString('hex');
    await db.collection('branches').insertOne({ _id: branchId, name: 'E2E temporary branch', nameAr: 'فرع اختبار مؤقت', address: 'TEST ONLY', phone: '00000000000', isActive: true });
    await db.collection('roles').insertOne({ _id: roleId, name: 'owner', nameAr: 'مالك اختبار', permissions: ['inventory:read', 'inventory:write', 'storefront:read', 'storefront:publish', 'storefront:unpublish', 'storefront:manage_content'] });
    await db.collection('users').insertOne({ name: 'Disposable E2E user', email, phone: runId, password: await erpRequire('bcryptjs').hash(password, 12), role: roleId, branch: branchId, isActive: true });
    stage = 'start ERP';
    const apiChild = start('--erp-child', { ...config, NODE_ENV: 'development', MONGODB_URI: testUri.toString(), PORT: String(apiPort), CLIENT_URL: catalog, PUBLIC_API_URL: api, JWT_SECRET: crypto.randomBytes(32).toString('hex'), JWT_REFRESH_SECRET: crypto.randomBytes(32).toString('hex'), CLOUDINARY_CLOUD_NAME: '', CLOUDINARY_API_KEY: '', CLOUDINARY_API_SECRET: '' }, erp);
    await waitFor(api + '/health', apiChild);
    let token;
    async function request(route, options = {}) {
      const headers = { ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
      const response = await fetch(api + '/api' + route, { ...options, headers, signal: AbortSignal.timeout(30000) });
      const body = await response.json();
      check(response.ok, 'ERP request failed with status ' + response.status + ' (' + (body.code || 'unknown') + ')');
      return body;
    }
    stage = 'login';
    token = (await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })).data.accessToken;
    passed('Login using normal ERP authentication');
    stage = 'register phone and photo';
    const image = fs.readFileSync(path.join(root, 'public/branding/iphone-18-pro-reference.jpg'));
    const form = new FormData();
    const model = 'iPhone E2E ' + runId;
    for (const [key, value] of Object.entries({ brand: 'Apple', phoneModel: model, color: 'Burgundy', storage: '256GB', imei1: String(Date.now()) + '00', condition: 'new', purchasePrice: '8000', salePrice: '10000', notes: 'DISPOSABLE AUTOMATED TEST' })) form.append(key, value);
    form.append('image', new Blob([image], { type: 'image/jpeg' }), 'e2e-phone.jpg');
    const phone = (await request('/inventory/phones', { method: 'POST', body: form })).data.phone;
    check(phone.images?.length === 1, 'Photo was not saved with the phone');
    const imageUrl = new URL(phone.images[0], api);
    check(imageUrl.origin === api && /^\/api\/catalog\/media\/[a-f0-9]{24}$/.test(imageUrl.pathname), 'Unexpected GridFS image reference');
    const fileId = new ObjectId(imageUrl.pathname.split('/').pop());
    check(await db.collection('catalogimages.files').findOne({ _id: fileId, 'metadata.kind': 'catalog-image' }), 'Image metadata missing from MongoDB');
    check(await db.collection('catalogimages.chunks').countDocuments({ files_id: fileId }) > 0, 'Image bytes are not stored in GridFS chunks');
    const imageResponse = await fetch(imageUrl);
    check(imageResponse.ok && Buffer.from(await imageResponse.arrayBuffer()).equals(image), 'Uploaded image bytes differ');
    passed('Register a phone with a real image and retrieve the image');
    stage = 'prepare draft';
    const candidates = await request('/storefront/admin/candidates?productType=phone');
    const candidate = candidates.data.find(product => product.modelName === model);
    check(candidate?.coverImage === phone.images[0], 'Candidate photo is missing');
    const product = (await request('/storefront/admin/candidates/' + encodeURIComponent(candidate.catalogKey) + '/materialize', { method: 'POST' })).data.product;
    check(product.isPublished === false, 'Preparing a draft published it without approval');
    const draftRows = await request('/inventory/phones');
    check(draftRows.data.find(row => row._id === phone._id)?.storefront?.status === 'draft', 'Inventory draft badge is incorrect');
    check(!product.publicationReadiness.warnings.some(warning => warning.code === 'images'), 'GridFS image was not recognized by publication readiness');
    passed('Prepare a draft with the image and confirm inventory status');
    const extraForm = new FormData(); extraForm.append('image', new Blob([image], { type: 'image/jpeg' }), 'extra-image.jpg');
    const extra = (await request('/storefront/admin/products/' + product._id + '/media', { method: 'POST', body: extraForm })).data.media;
    check(/^gridfs:[a-f0-9]{24}$/.test(extra.publicId), 'Catalog editor did not upload to GridFS');
    await request('/storefront/admin/products/' + product._id + '/media/' + encodeURIComponent(extra.publicId), { method: 'DELETE' });
    check(await db.collection('catalogimages.chunks').countDocuments({ files_id: new ObjectId(extra.publicId.slice(7)) }) === 0, 'Deleting catalog media left its chunks behind');
    passed('Catalog editor uploads and deletes GridFS media');
    stage = 'start isolated catalog';
    const projectDir = path.join(root, dist, 'project');
    fs.mkdirSync(projectDir, { recursive: true });
    for (const directory of ['app', 'components', 'lib', 'types', 'public']) fs.cpSync(path.join(root, directory), path.join(projectDir, directory), { recursive: true });
    for (const file of ['package.json', 'tsconfig.json', 'next-env.d.ts', 'next.config.mjs', 'postcss.config.mjs']) { if (fs.existsSync(path.join(root, file))) fs.copyFileSync(path.join(root, file), path.join(projectDir, file)); }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(projectDir, 'node_modules'), 'junction');
    const catalogChild = start('--catalog-child', { E2E_CATALOG_ROOT: projectDir, NODE_ENV: 'development', E2E_PORT: String(catalogPort), E2E_DIST: '.next', STOREFRONT_DB_NAME: databaseName, STOREFRONT_MONGODB_URI: config.MONGODB_URI, NEXT_PUBLIC_ERP_MEDIA_URL: api }, root);
    await waitFor(catalog + '/api/catalog/products', catalogChild);
    async function publicProducts() { const response = await fetch(catalog + '/api/catalog/products', { signal: AbortSignal.timeout(45000) }); check(response.ok, 'Public listing failed'); return (await response.json()).data.products; }
    check((await publicProducts()).length === 0, 'Unapproved draft is visible publicly');
    check((await fetch(catalog + imageUrl.pathname)).status === 404, 'Draft-only photo is publicly exposed');
    passed('Public catalog excludes the unapproved draft and its photo');
    stage = 'publish';
    await request('/storefront/admin/products/' + product._id + '/publish', { method: 'POST' });
    let visible = (await publicProducts()).find(item => item.slug === product.slug);
    check(visible?.basePrice === 10000 && visible?.coverImage === phone.images[0], 'Published image or price is incorrect');
    const page = await fetch(catalog + '/products/' + product.slug, { signal: AbortSignal.timeout(60000) });
    const html = await page.text();
    check(page.ok && html.includes(fileId.toHexString()) && html.includes('256GB'), 'Product page does not render the image and storage');
    passed('Approved product appears in the real catalog page with its image, price and storage');
    const reconcile = () => request('/storefront/admin/sync/reconcile/' + encodeURIComponent(candidate.catalogKey), { method: 'POST' });
    stage = 'change price';
    await request('/inventory/phones/' + phone._id, { method: 'PUT', body: JSON.stringify({ salePrice: 12500 }) });
    await reconcile(); visible = (await publicProducts()).find(item => item.slug === product.slug);
    check(visible?.basePrice === 12500, 'New ERP price did not reach the catalog');
    passed('ERP price change reaches the catalog');
    stage = 'stock change';
    await request('/inventory/phones/' + phone._id, { method: 'PUT', body: JSON.stringify({ status: 'sold' }) });
    await reconcile(); visible = (await publicProducts()).find(item => item.slug === product.slug);
    check(visible?.totalAvailableQuantity === 0 && visible?.availabilityStatus === 'out_of_stock', 'Sold item still shows stock');
    passed('Stock change updates availability without changing publication approval');
    stage = 'unpublish';
    await request('/storefront/admin/products/' + product._id + '/unpublish', { method: 'POST' });
    check((await publicProducts()).length === 0, 'Unpublished item remains in the public listing');
    const hidden = await fetch(catalog + '/api/catalog/products/' + product.slug);
    check(hidden.status === 404, 'Unpublished detail remains accessible');
    check((await fetch(catalog + imageUrl.pathname)).status === 404, 'Unpublished-only photo is still public');
    passed('Unpublishing removes listing, public details and photo access');
    await request('/storefront/admin/products/' + product._id + '/publish', { method: 'POST' });
    stage = 'verify catalog images with ERP stopped';
    const apiStopped = new Promise(resolve => apiChild.once('exit', resolve)); apiChild.send('stop');
    await Promise.race([apiStopped, new Promise((_, reject) => setTimeout(() => reject(new Error('Temporary ERP did not stop')), 10000))]);
    const offlineImage = await fetch(catalog + imageUrl.pathname + '?offline-check=1');
    check(offlineImage.ok && Buffer.from(await offlineImage.arrayBuffer()).equals(image), 'Catalog cannot read MongoDB image independently of ERP');
    passed('Catalog serves original GridFS photo with the ERP server stopped');
    report = { passed: true, isolatedDatabase: true, steps };
  } catch (error) {
    report = { passed: false, isolatedDatabase: true, failedStage: stage, reason: error.message, steps };
    console.log('FAIL: ' + stage + ': ' + error.message);
  } finally {
    for (const child of children.reverse()) {
      if (child.exitCode !== null) continue;
      const stopped = new Promise(resolve => child.once('exit', resolve));
      if (child.connected) child.send('stop');
      await Promise.race([stopped, new Promise(resolve => setTimeout(resolve, 5000))]);
      if (child.exitCode === null) { child.kill(); await Promise.race([stopped, new Promise(resolve => setTimeout(resolve, 2000))]); }
    }
    let cleaned = true;
    if (db) {
      try {
        check(/^moblix_e2e_[a-f0-9]{16}$/.test(db.databaseName) && db.databaseName === databaseName, 'Unsafe cleanup database');
        const owned = await db.collection('e2e_runs').findOne({ runId, disposable: true });
        if (owned) await db.dropDatabase();
      } catch { cleaned = false; }
    }
    if (imagePath) { try { await fs.promises.unlink(imagePath); } catch (error) { if (error.code !== 'ENOENT') cleaned = false; } }
    const distPath = path.resolve(root, dist);
    if (distPath.startsWith(path.resolve(root, '.next/e2e') + path.sep) && path.basename(distPath) === runId) {
      try { await fs.promises.rm(distPath, { recursive: true, force: true }); } catch { cleaned = false; }
    }
    const currentConfig = fs.readFileSync(tsConfigPath, 'utf8');
    if (currentConfig !== originalTsConfig) {
      try {
        const parsed = JSON.parse(currentConfig), original = JSON.parse(originalTsConfig);
        parsed.include = parsed.include?.filter(item => !item.includes('.next/e2e/' + runId));
        if (JSON.stringify(parsed) === JSON.stringify(original)) fs.writeFileSync(tsConfigPath, originalTsConfig);
      } catch {}
    }
    await dbClient.close();
    report ||= { passed: false, steps };
    report.cleanupSucceeded = cleaned;
    fs.mkdirSync(path.join(root, 'test-results'), { recursive: true });
    fs.writeFileSync(path.join(root, 'test-results/erp-catalog-e2e.json'), JSON.stringify(report, null, 2));
    console.log(cleaned ? 'CLEANUP: test data and temporary image removed' : 'CLEANUP: requires inspection');
    if (!report.passed || !cleaned) throw new Error('Integration test incomplete');
  }
}
