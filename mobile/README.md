# Apple King ERP for Android and iPhone

Flutter app for employees of the existing ERP in `D:\erp phones`. The app uses the ERP's Express API and existing employee accounts. The first build includes sign-in, session renewal, branch dashboard, device and accessory inventory, sales and repairs lists, and the ERP notification inbox. Operational screens are read-only. The notification inbox can mark visible notifications as read.

## Connect to the ERP

- The production ERP API runs at `https://mobilix-erp.onrender.com`. Enter that address on the sign-in screen or prefill it at build time with `--dart-define=ERP_URL=https://mobilix-erp.onrender.com`.
- For an Android emulator and a running local ERP server, enter `http://10.0.2.2:5000` in a debug build.
- Sign in with a test employee account. Enable biometric sign-in in settings, close and reopen the app, and verify Touch ID, Face ID, or Android fingerprint where enrolled. The app stores the refresh token in platform secure storage only when biometric sign-in is enabled. Signing out clears the saved session. The current ERP issues one refresh token per user, so signing in on another device can invalidate the previous saved session.

## Build and verify

```sh
flutter pub get
flutter analyze
flutter test
flutter build apk --debug
```

The test APK is at `build/app/outputs/flutter-apk/app-debug.apk`. A production Android release needs the store's release signing configuration. For iOS, build on macOS with Xcode, select the Apple Developer team, configure signing and provisioning, and test through Xcode or TestFlight.

## Notifications

The inbox reads `/api/notifications` using the signed-in user's ERP permissions. General device announcements are optional via Firebase Cloud Messaging.

- Register Android as `com.appleking.apple_king` and put the Firebase Android configuration at `android/app/google-services.json`.
- Register iOS as `com.appleking.appleKing`. Add `GoogleService-Info.plist` to the Runner target in Xcode, enable Push Notifications and Background Modes → Remote notifications, and upload the APNs key to Firebase.
- Enable general alerts in the app settings and test an FCM notification payload on each platform. The topic is `erp_general_announcements` and is suitable for non-confidential messages only. Employee and branch alerts remain in the authenticated ERP inbox. Sending those alerts as private device push requires a server-side device registration and delivery integration.
