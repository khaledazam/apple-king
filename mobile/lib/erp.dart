import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

typedef Json = Map<String, dynamic>;
Json object(Object? value) => value is Json ? value : const {};
List<Json> rows(Object? value) =>
    value is List ? value.whereType<Json>().toList() : const [];

class ErpError implements Exception {
  const ErpError(this.message, [this.status]);
  final String message;
  final int? status;
  @override
  String toString() => message;
}

Uri? erpOrigin(String input, {bool allowEmulator = false}) {
  final uri = Uri.tryParse(input.trim());
  if (uri == null ||
      !uri.hasAuthority ||
      uri.host.isEmpty ||
      uri.userInfo.isNotEmpty ||
      uri.hasQuery ||
      uri.hasFragment ||
      !['', '/', '/api', '/api/'].contains(uri.path)) {
    return null;
  }
  if (uri.scheme != 'https' &&
      !(allowEmulator &&
          uri.scheme == 'http' &&
          ['10.0.2.2', '127.0.0.1', 'localhost'].contains(uri.host))) {
    return null;
  }
  return uri.replace(path: '/api/');
}

class ErpSession extends ChangeNotifier {
  ErpSession({http.Client? client, FlutterSecureStorage? storage})
    : _client = client ?? http.Client(),
      _storage = storage ?? const FlutterSecureStorage();

  final http.Client _client;
  final FlutterSecureStorage _storage;
  static const _key = 'apple_king_erp_biometric_session';
  String? _access;
  String? _refresh;
  String? _savedOrigin;
  Future<void>? _renewing;
  Uri? _origin;
  Json? user;
  bool get remembersSession => _savedOrigin != null;
  String? get savedOrigin => _savedOrigin;

  Future<void> initialize() async {
    final data = await _saved();
    _savedOrigin = data['origin'] as String?;
  }

  Future<Json> _saved() async {
    final value = await _storage.read(key: _key);
    return value == null ? const {} : object(jsonDecode(value));
  }

  Future<void> signIn(Uri origin, String email, String password) async {
    await forget();
    final response = await _send(
      origin,
      'auth/login',
      method: 'POST',
      body: {'email': email, 'password': password},
    );
    _origin = origin;
    _setTokens(object(response['data']));
    user = object(object(response['data'])['user']);
    notifyListeners();
  }

  Future<void> resume() async {
    final data = await _saved();
    final origin = erpOrigin(
      data['origin'] as String? ?? '',
      allowEmulator: kDebugMode,
    );
    if (origin == null || data['refreshToken'] is! String) {
      await forget();
      throw const ErpError('سجّل الدخول بالبريد الإلكتروني وكلمة المرور.');
    }
    _origin = origin;
    _refresh = data['refreshToken'] as String;
    await _renew();
    final profile = object(object((await get('auth/me'))['data'])['user']);
    if (profile.isEmpty) throw const ErpError('تعذّر تحميل حساب الموظف.');
    user = profile;
    notifyListeners();
  }

  Future<void> remember() async {
    if (_origin == null || _refresh == null) return;
    await _store();
    _savedOrigin = _origin.toString();
    notifyListeners();
  }

  Future<void> _store() => _storage.write(
    key: _key,
    value: jsonEncode({'origin': _origin.toString(), 'refreshToken': _refresh}),
  );

  Future<void> forget() async {
    await _storage.delete(key: _key);
    _savedOrigin = null;
    notifyListeners();
  }

  void _setTokens(Json data) {
    if (data['accessToken'] is! String || data['refreshToken'] is! String) {
      throw const ErpError('رد تسجيل الدخول من السيرفر غير مكتمل.');
    }
    _access = data['accessToken'] as String;
    _refresh = data['refreshToken'] as String;
  }

  Future<void> _renew() async {
    final pending = _renewing;
    if (pending != null) return pending;
    final refresh = _renewTokens();
    _renewing = refresh;
    try {
      await refresh;
    } finally {
      _renewing = null;
    }
  }

  Future<void> _renewTokens() async {
    final origin = _origin;
    if (origin == null || _refresh == null) {
      throw const ErpError('سجّل الدخول مرة تانية.', 401);
    }
    try {
      final response = await _send(
        origin,
        'auth/refresh',
        method: 'POST',
        body: {'refreshToken': _refresh},
      );
      _setTokens(object(response['data']));
      if (remembersSession) await _store();
    } on ErpError catch (error) {
      if (error.status == 401) {
        _clear();
        await forget();
      }
      rethrow;
    }
  }

  Future<Json> get(String path) => _authorized(path);

  Future<Json> _authorized(String path, {String method = 'GET'}) async {
    final origin = _origin;
    if (origin == null || _access == null) {
      throw const ErpError('سجّل الدخول مرة تانية.', 401);
    }
    final token = _access;
    try {
      return await _send(origin, path, token: token, method: method);
    } on ErpError catch (error) {
      if (error.status != 401) rethrow;
      if (_access == token) await _renew();
      if (_access == null) rethrow;
      return _send(origin, path, token: _access, method: method);
    }
  }

  Future<void> markAllRead() async {
    await _authorized('notifications/mark-all-read', method: 'POST');
  }

  Future<void> signOut() async {
    try {
      await _authorized('auth/logout', method: 'POST');
    } finally {
      _clear();
      await forget();
    }
  }

  void _clear() {
    user = null;
    _access = null;
    _refresh = null;
    _origin = null;
    notifyListeners();
  }

  Future<Json> _send(
    Uri origin,
    String path, {
    String method = 'GET',
    String? token,
    Json? body,
  }) async {
    final request = http.Request(method, origin.resolve(path))
      ..followRedirects = false
      ..headers['Accept'] = 'application/json';
    if (token != null) request.headers['Authorization'] = 'Bearer $token';
    if (body != null) {
      request.headers['Content-Type'] = 'application/json';
      request.body = jsonEncode(body);
    }
    try {
      final response = await _client
          .send(request)
          .then(http.Response.fromStream)
          .timeout(
            Duration(
              seconds: path == 'auth/login' || path == 'auth/refresh' ? 60 : 15,
            ),
          );
      if (response.statusCode >= 300 && response.statusCode < 400) {
        throw const ErpError('استخدم عنوان سيرفر ERP النهائي.');
      }
      final data = object(jsonDecode(utf8.decode(response.bodyBytes)));
      if (response.statusCode != 200 || data['success'] != true) {
        final message = data['messageAr'] ?? data['message'];
        throw ErpError(
          message is String && response.statusCode < 500
              ? message
              : 'حصل خطأ في سيرفر ERP. جرّب تاني.',
          response.statusCode,
        );
      }
      return data;
    } on TimeoutException {
      throw const ErpError(
        'السيرفر اتأخر في الرد. اتأكد من الاتصال وحاول تاني.',
      );
    } on http.ClientException {
      throw const ErpError(
        'مش قادر أتصل بسيرفر ERP. اتأكد من العنوان والشبكة.',
      );
    } on FormatException {
      throw const ErpError('السيرفر رجّع رد غير متوقع. راجع عنوان ERP.');
    }
  }

  @override
  void dispose() {
    _client.close();
    super.dispose();
  }
}
