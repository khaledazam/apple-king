import 'package:apple_king/main.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() {
  testWidgets('ERP sign-in validates the connection and required fields', (
    tester,
  ) async {
    FlutterSecureStorage.setMockInitialValues({});
    await tester.runAsync(() async {
      await tester.pumpWidget(const ErpApp());
      await Future<void>.delayed(const Duration(milliseconds: 50));
    });
    await tester.pumpAndSettle();

    expect(find.text('Apple King ERP'), findsOneWidget);
    await tester.ensureVisible(find.text('تسجيل الدخول'));
    await tester.tap(find.text('تسجيل الدخول'));
    await tester.pumpAndSettle();
    expect(find.text('ادخل عنوان HTTPS صحيح لسيرفر ERP.'), findsOneWidget);
  });
}
