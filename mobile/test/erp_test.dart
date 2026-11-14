import 'dart:convert';

import 'package:apple_king/erp.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  test(
    'normalizes ERP origin and restricts plaintext to debug emulator addresses',
    () {
      expect(
        erpOrigin('https://example.com/api').toString(),
        'https://example.com/api/',
      );
      expect(erpOrigin('https://name@example.com'), isNull);
      expect(erpOrigin('http://example.com', allowEmulator: true), isNull);
      expect(erpOrigin('http://10.0.2.2:5000'), isNull);
      expect(erpOrigin('http://10.0.2.2:5000', allowEmulator: true), isNotNull);
    },
  );

  test(
    'signs in, renews an expired session, and retries the ERP request',
    () async {
      final session = ErpSession(
        client: MockClient((request) async {
          final data = switch (request.url.path) {
            '/api/auth/login' => {
              'accessToken': 'first',
              'refreshToken': 'refresh',
              'user': {'name': 'Employee'},
            },
            '/api/auth/refresh' => {
              'accessToken': 'second',
              'refreshToken': 'rotated',
            },
            '/api/notifications' => {'notifications': []},
            _ => throw StateError('Unexpected endpoint: ${request.url.path}'),
          };
          if (request.url.path == '/api/auth/login') {
            expect(jsonDecode(request.body), {
              'email': 'user@example.com',
              'password': 'password',
            });
          }
          if (request.url.path == '/api/auth/refresh') {
            expect(jsonDecode(request.body), {'refreshToken': 'refresh'});
          }
          if (request.url.path == '/api/notifications') {
            if (request.headers['Authorization'] == 'Bearer first') {
              return http.Response('{"success":false}', 401);
            }
            expect(request.headers['Authorization'], 'Bearer second');
          }
          return http.Response(
            jsonEncode({'success': true, 'data': data}),
            200,
          );
        }),
      );
      addTearDown(session.dispose);
      await session.signIn(
        erpOrigin('https://erp.example.com')!,
        'user@example.com',
        'password',
      );
      expect(session.user?['name'], 'Employee');
      expect((await session.get('notifications'))['data'], {
        'notifications': [],
      });
    },
  );
}
