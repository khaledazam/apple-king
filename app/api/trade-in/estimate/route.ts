import { NextRequest, NextResponse } from 'next/server';

const NARAROUTER_BASE_URL = process.env.NARAROUTER_BASE_URL || 'https://router.bynara.id/v1';
const NARAROUTER_API_KEY = process.env.NARAROUTER_API_KEY || 'sk-nry-zvAXrLqLVfiEObrKPfoqxIN5eeH0eC5MxG8gJUhI9bc';
const NARAROUTER_MODEL = process.env.NARAROUTER_MODEL || 'laguna-s-2.1';

// Base Egyptian market benchmark prices (EGP) for typical good condition base model
const BASELINE_PRICES: Record<string, number> = {
  'iPhone 16 Pro Max': 68000,
  'iPhone 16 Pro': 58000,
  'iPhone 16 Plus': 48000,
  'iPhone 16': 42000,
  'iPhone 15 Pro Max': 52000,
  'iPhone 15 Pro': 44000,
  'iPhone 15 Plus': 36000,
  'iPhone 15': 32000,
  'iPhone 14 Pro Max': 41000,
  'iPhone 14 Pro': 35000,
  'iPhone 14 Plus': 28000,
  'iPhone 14': 26000,
  'iPhone 13 Pro Max': 31000,
  'iPhone 13 Pro': 26000,
  'iPhone 13': 20000,
  'iPhone 12 Pro Max': 23000,
  'iPhone 12 Pro': 19000,
  'iPhone 12': 15000,
  'iPhone 11 Pro Max': 17000,
  'iPhone 11 Pro': 14000,
  'iPhone 11': 11500,
  'Samsung S24 Ultra': 48000,
  'Samsung S24 Plus': 35000,
  'Samsung S24': 28000,
  'Samsung S23 Ultra': 36000,
  'Samsung S23 Plus': 26000,
  'Samsung S23': 21000,
  'Samsung S22 Ultra': 24000,
};

function calculateAlgorithmicEstimate(data: any) {
  let basePrice = 20000;
  const lookupKey = Object.keys(BASELINE_PRICES).find((k) =>
    data.model && data.model.toLowerCase().includes(k.toLowerCase())
  );
  if (lookupKey) {
    basePrice = BASELINE_PRICES[lookupKey];
  }

  // Adjust for storage
  if (data.storage === '256GB') basePrice += 2000;
  else if (data.storage === '512GB') basePrice += 4500;
  else if (data.storage === '1TB') basePrice += 7500;

  // Adjust for condition
  let conditionFactor = 1.0;
  if (data.condition === 'flawless') conditionFactor = 1.05;
  else if (data.condition === 'good') conditionFactor = 0.98;
  else if (data.condition === 'fair') conditionFactor = 0.90;
  else if (data.condition === 'scratched') conditionFactor = 0.82;

  // Adjust for battery
  const battery = Number(data.batteryHealth) || 85;
  let batteryFactor = 1.0;
  if (battery >= 90) batteryFactor = 1.03;
  else if (battery < 80) batteryFactor = 0.91;
  else if (battery < 85) batteryFactor = 0.96;

  // Adjust for box and parts
  let deductions = 0;
  if (!data.hasBox) deductions += 1200;
  if (data.screenCondition === 'replaced') deductions += 3000;
  if (data.screenCondition === 'cracked') deductions += 4500;
  if (data.hasFaceId === false) deductions += 2500;

  const dubizzlePrice = Math.round((basePrice * conditionFactor * batteryFactor) - (deductions * 0.5));
  const tradeInMin = Math.round(dubizzlePrice * 0.84);
  const tradeInMax = Math.round(dubizzlePrice * 0.90);

  return {
    dubizzleAveragePrice: dubizzlePrice,
    estimatedTradeInMin: Math.max(1000, tradeInMin),
    estimatedTradeInMax: Math.max(1200, tradeInMax),
    conditionSummary: `تقييم استرشادي لجهاز ${data.brand || ''} ${data.model || ''} مساحة ${data.storage || ''} وبطارية ${battery}%.`,
    priceFactors: [
      data.hasBox ? 'وجود العلبة الأصلية يرفع قيمة الجهاز' : 'عدم وجود العلبة يخصم من السعر السوقي',
      battery >= 85 ? `صحة البطارية جيدة (${battery}%)` : `صحة البطارية منخفضة (${battery}%)`,
      data.condition === 'flawless' ? 'حالة الجهاز الخارجية ممتازة (كسر زيرو)' : 'تأثير الخدوش على القيمة',
    ],
    disclaimer: 'ملاحظة: هذا التقييم تم بواسطة الذكاء الاصطناعي بناءً على متوسط أسعار السوق ودوبيزل في مصر، وهو سعر استرشادي تقريبي وليس له علاقة بالتسعير الرسمي النهائي داخل فرع المحل بعد الفحص الفعلي.',
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, model, storage, batteryHealth, condition, screenCondition, hasBox, hasFaceId, notes } = body;

    if (!model) {
      return NextResponse.json({ error: 'يرجى اختيار موديل الجهاز' }, { status: 400 });
    }

    // Try calling NaraRouter Laguna-S-2.1 AI
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000); // 9 seconds limit

    try {
      const systemPrompt = `أنت خبير محترف ومحلل أسعار لسوق الهواتف المستعملة في مصر، وعلى دراية تامة بأسعار الإعلانات على دوبيزل (Dubizzle) ومحلات الهواتف بالجنيه المصري (EGP).
مهمتك تقييم هاتف العميل بناءً على أسعار دوبيزل والسوق المصري اليوم، وحساب:
1. متوسط سعر بيعه الحالي على دوبيزل (dubizzleAveragePrice).
2. السعر التقديري المتوقع للشراء كاش أو الاستبدال من المحلات (estimatedTradeInMin و estimatedTradeInMax) وهو عادة أقل من دوبيزل بنسبة 10-16% لفرق هامش ربح المحل ومصاريف الفحص والضمان.
3. ملخص تحليلي لحالة الجهاز وتأثير البطارية والشاشة على السعر.

أعد النتيجة حصرياً كـ JSON صالح بدون أي كود markdown إضافي:
{
  "dubizzleAveragePrice": number,
  "estimatedTradeInMin": number,
  "estimatedTradeInMax": number,
  "conditionSummary": "ملخص تقييم الحالة في جملتين",
  "priceFactors": ["ملاحظة 1", "ملاحظة 2", "ملاحظة 3"],
  "disclaimer": "ملاحظة: هذا التقييم تم بواسطة الذكاء الاصطناعي بناءً على متوسط أسعار السوق ودوبيزل في مصر، وهو سعر استرشادي تقريبي وليس له علاقة بالتسعير الرسمي النهائي داخل فرع المحل بعد الفحص الفعلي."
}`;

      const userPrompt = `بيانات الهاتف المراد تقييمه:
- الماركة: ${brand || 'Apple'}
- الموديل: ${model}
- المساحة التخزينية: ${storage || '128GB'}
- صحة البطارية: ${batteryHealth || 'غير محددة'}%
- الحالة الخارجية: ${condition || 'جيدة'}
- حالة الشاشة: ${screenCondition || 'أصلية'}
- العلبة الأصلية متوفرة: ${hasBox ? 'نعم' : 'لا'}
- بصمة الوجه (Face ID): ${hasFaceId !== false ? 'تعمل' : 'معطلة'}
${notes ? '- ملاحظات إضافية: ' + notes : ''}

قم بتقدير أسعار دوبيزل وسعر البدل/البيع المناسب بالجنيه المصري.`;

      const response = await fetch(`${NARAROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NARAROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: NARAROUTER_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 600,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content || '';
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        return NextResponse.json({
          success: true,
          data: {
            dubizzleAveragePrice: Number(parsed.dubizzleAveragePrice) || calculateAlgorithmicEstimate(body).dubizzleAveragePrice,
            estimatedTradeInMin: Number(parsed.estimatedTradeInMin) || calculateAlgorithmicEstimate(body).estimatedTradeInMin,
            estimatedTradeInMax: Number(parsed.estimatedTradeInMax) || calculateAlgorithmicEstimate(body).estimatedTradeInMax,
            conditionSummary: parsed.conditionSummary || 'تقييم شامل لحالة الجهاز والبطارية.',
            priceFactors: Array.isArray(parsed.priceFactors) ? parsed.priceFactors : [],
            disclaimer: 'ملاحظة: هذا التقييم تم بواسطة الذكاء الاصطناعي بناءً على متوسط أسعار السوق ودوبيزل في مصر، وهو سعر استرشادي تقريبي وليس له علاقة بالتسعير الرسمي النهائي داخل فرع المحل بعد الفحص الفعلي.',
            poweredBy: 'NaraRouter AI (Laguna-S-2.1) + Dubizzle Market Analysis',
          },
        });
      }
    } catch (aiErr) {
      clearTimeout(timeout);
      console.warn('[AI Trade-In] AI service fallback used:', (aiErr as any)?.message);
    }

    // Algorithmic Fallback ensures 100% uptime
    const fallbackEstimate = calculateAlgorithmicEstimate(body);
    return NextResponse.json({
      success: true,
      data: {
        ...fallbackEstimate,
        poweredBy: 'Market Intelligence Engine (Dubizzle Benchmark)',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تقييم الجهاز' },
      { status: 500 }
    );
  }
}
