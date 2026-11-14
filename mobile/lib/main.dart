import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:local_auth/local_auth.dart';

import 'erp.dart';
import 'workspace.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ErpApp());
}

class ErpApp extends StatelessWidget {
  const ErpApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Apple King ERP',
    debugShowCheckedModeBanner: false,
    locale: const Locale('ar'),
    supportedLocales: const [Locale('ar')],
    localizationsDelegates: GlobalMaterialLocalizations.delegates,
    theme: ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFCBA35F),
        brightness: Brightness.dark,
        surface: const Color(0xFF17191E),
      ),
      scaffoldBackgroundColor: const Color(0xFF101116),
      inputDecorationTheme: const InputDecorationTheme(
        border: OutlineInputBorder(),
      ),
      cardTheme: const CardThemeData(
        margin: EdgeInsets.zero,
        clipBehavior: Clip.antiAlias,
      ),
    ),
    home: const SessionGate(),
  );
}

class SessionGate extends StatefulWidget {
  const SessionGate({super.key});

  @override
  State<SessionGate> createState() => _SessionGateState();
}

class _SessionGateState extends State<SessionGate> {
  final _session = ErpSession();
  final _biometrics = LocalAuthentication();
  final _server = TextEditingController(
    text: const String.fromEnvironment('ERP_URL'),
  );
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _form = GlobalKey<FormState>();
  bool _ready = false;
  bool _working = false;
  bool _hidePassword = true;
  bool _biometricAvailable = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    unawaited(_initialize());
  }

  Future<void> _initialize() async {
    try {
      await _session.initialize();
      if (_session.savedOrigin case final origin?) _server.text = origin;
      _biometricAvailable =
          (await _biometrics.getAvailableBiometrics()).isNotEmpty;
    } catch (_) {
      // Password sign-in stays available on devices without local biometrics.
    }
    if (mounted) setState(() => _ready = true);
  }

  Future<void> _perform(Future<void> Function() action) async {
    if (_working) return;
    setState(() {
      _working = true;
      _error = null;
    });
    try {
      await action();
    } on ErpError catch (error) {
      if (mounted) setState(() => _error = error.message);
    } on LocalAuthException {
      if (mounted) setState(() => _error = 'تعذّر التحقق بالبصمة أو Face ID.');
    } catch (_) {
      if (mounted) setState(() => _error = 'تعذّر إكمال العملية. حاول تاني.');
    } finally {
      if (mounted) setState(() => _working = false);
    }
  }

  Future<bool> _verify() => _biometrics.authenticate(
    localizedReason: 'أكد هويتك لفتح جلسة Apple King ERP',
    biometricOnly: true,
  );

  Future<void> _toggleBiometrics(bool enabled) => _perform(() async {
    if (!enabled) {
      await _session.forget();
    } else if (await _verify()) {
      await _session.remember();
    }
  });

  void _signIn() {
    if (_form.currentState?.validate() != true) return;
    final origin = erpOrigin(_server.text, allowEmulator: kDebugMode)!;
    unawaited(
      _perform(() async {
        await _session.signIn(origin, _email.text.trim(), _password.text);
        _password.clear();
      }),
    );
  }

  @override
  void dispose() {
    _session.dispose();
    _server.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ListenableBuilder(
    listenable: _session,
    builder: (context, _) {
      if (_session.user != null) {
        return Workspace(
          session: _session,
          biometricAvailable: _biometricAvailable,
          onToggleBiometrics: _toggleBiometrics,
          onSignOut: () => _perform(_session.signOut),
          busy: _working,
          error: _error,
        );
      }
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: _ready
                    ? _login(context)
                    : const CircularProgressIndicator(),
              ),
            ),
          ),
        ),
      );
    },
  );

  Widget _login(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return AutofillGroup(
      child: Form(
        key: _form,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Align(
              alignment: AlignmentDirectional.centerStart,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: colors.primaryContainer,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Icon(
                    Icons.storefront_rounded,
                    color: colors.onPrimaryContainer,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Apple King ERP',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Text('سجّل الدخول بحساب الموظف'),
            const SizedBox(height: 28),
            TextFormField(
              controller: _server,
              enabled: !_working,
              textDirection: TextDirection.ltr,
              keyboardType: TextInputType.url,
              decoration: const InputDecoration(
                labelText: 'عنوان سيرفر ERP',
                hintText: 'https://erp.example.com',
              ),
              validator: (value) =>
                  erpOrigin(value ?? '', allowEmulator: kDebugMode) == null
                  ? 'ادخل عنوان HTTPS صحيح لسيرفر ERP.'
                  : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _email,
              enabled: !_working,
              textDirection: TextDirection.ltr,
              keyboardType: TextInputType.emailAddress,
              autofillHints: const [AutofillHints.username],
              decoration: const InputDecoration(labelText: 'البريد الإلكتروني'),
              validator: (value) => (value ?? '').trim().contains('@')
                  ? null
                  : 'ادخل بريد الموظف.',
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _password,
              enabled: !_working,
              textDirection: TextDirection.ltr,
              obscureText: _hidePassword,
              autofillHints: const [AutofillHints.password],
              onFieldSubmitted: (_) {
                if (!_working) _signIn();
              },
              decoration: InputDecoration(
                labelText: 'كلمة المرور',
                suffixIcon: IconButton(
                  tooltip: _hidePassword
                      ? 'إظهار كلمة المرور'
                      : 'إخفاء كلمة المرور',
                  icon: Icon(
                    _hidePassword ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () =>
                      setState(() => _hidePassword = !_hidePassword),
                ),
              ),
              validator: (value) =>
                  (value ?? '').isEmpty ? 'ادخل كلمة المرور.' : null,
            ),
            const SizedBox(height: 18),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(_error!, style: TextStyle(color: colors.error)),
              ),
            FilledButton(
              onPressed: _working ? null : _signIn,
              child: const Text('تسجيل الدخول'),
            ),
            if (_session.remembersSession && _biometricAvailable)
              OutlinedButton.icon(
                onPressed: _working
                    ? null
                    : () => _perform(() async {
                        if (await _verify()) await _session.resume();
                      }),
                icon: const Icon(Icons.fingerprint),
                label: const Text('الدخول بالبصمة أو Face ID'),
              ),
            if (_working) const LinearProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
