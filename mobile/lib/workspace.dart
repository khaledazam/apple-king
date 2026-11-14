import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

import 'erp.dart';

String label(Object? value) => value?.toString().trim() ?? '';
String money(Object? value) =>
    value is num ? '${value.toStringAsFixed(value % 1 == 0 ? 0 : 2)} ج.م' : '—';

enum Section {
  dashboard('نظرة عامة', 'dashboard', Icons.dashboard_outlined),
  phones('الأجهزة', 'inventory/phones', Icons.phone_iphone),
  accessories('الإكسسوارات', 'inventory/accessories', Icons.headphones),
  sales('المبيعات', 'sales', Icons.receipt_long_outlined),
  repairs('الصيانة', 'repairs', Icons.build_outlined),
  notifications('الإشعارات', 'notifications', Icons.notifications_none),
  settings('الإعدادات', '', Icons.settings_outlined);

  const Section(this.title, this.path, this.icon);
  final String title;
  final String path;
  final IconData icon;
  bool get paged => [phones, accessories, sales, repairs].contains(this);
}

class Workspace extends StatefulWidget {
  const Workspace({
    super.key,
    required this.session,
    required this.biometricAvailable,
    required this.onToggleBiometrics,
    required this.onSignOut,
    required this.busy,
    this.error,
  });
  final ErpSession session;
  final bool biometricAvailable;
  final Future<void> Function(bool) onToggleBiometrics;
  final Future<void> Function() onSignOut;
  final bool busy;
  final String? error;

  @override
  State<Workspace> createState() => _WorkspaceState();
}

class _WorkspaceState extends State<Workspace> {
  Section _section = Section.dashboard;
  Future<Json>? _result;
  StreamSubscription<RemoteMessage>? _foreground;
  StreamSubscription<RemoteMessage>? _opened;
  int _page = 1;
  bool _changing = false;
  bool _pushBusy = false;
  static const _topic = 'erp_general_announcements';

  @override
  void initState() {
    super.initState();
    _result = _load();
    unawaited(_listenForPush());
  }

  Future<Json> _load() {
    final path = _section.path;
    return widget.session.get(
      _section.paged ? '$path?page=$_page&limit=20' : path,
    );
  }

  void _select(Section section) {
    setState(() {
      _section = section;
      _page = 1;
      _result = section == Section.settings ? null : _load();
    });
  }

  Future<void> _reload() async {
    final pending = _load();
    setState(() => _result = pending);
    try {
      await pending;
    } catch (_) {
      /* Rendered by FutureBuilder. */
    }
  }

  Future<FirebaseMessaging> _messaging() async {
    if (Firebase.apps.isEmpty) await Firebase.initializeApp();
    return FirebaseMessaging.instance;
  }

  Future<void> _listenForPush() async {
    try {
      final messaging = await _messaging();
      if (!mounted) return;
      _foreground = FirebaseMessaging.onMessage.listen((_) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('وصل تنبيه جديد من Apple King ERP.')),
        );
        if (_section == Section.notifications) unawaited(_reload());
      });
      _opened = FirebaseMessaging.onMessageOpenedApp.listen(
        (_) => _select(Section.notifications),
      );
      final initial = await messaging.getInitialMessage();
      if (initial != null && mounted) _select(Section.notifications);
    } catch (_) {
      // ERP inbox remains available independently of push configuration.
    }
  }

  Future<void> _setPush(bool enabled) async {
    setState(() => _pushBusy = true);
    String message;
    try {
      final messaging = await _messaging();
      if (enabled) {
        final settings = await messaging.requestPermission();
        if (settings.authorizationStatus == AuthorizationStatus.denied) {
          throw const ErpError('اسمح بالإشعارات من إعدادات الجهاز.');
        }
        await messaging.subscribeToTopic(_topic);
        message = 'تم تفعيل التنبيهات العامة على الجهاز.';
      } else {
        await messaging.unsubscribeFromTopic(_topic);
        message = 'تم إيقاف التنبيهات العامة على الجهاز.';
      }
    } on ErpError catch (error) {
      message = error.message;
    } catch (_) {
      message = 'تعذّر ضبط التنبيهات. راجع إعداد Firebase وأذونات الجهاز.';
    }
    if (!mounted) return;
    setState(() => _pushBusy = false);
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _markRead() async {
    setState(() => _changing = true);
    try {
      await widget.session.markAllRead();
      if (mounted && _section == Section.notifications) await _reload();
    } on ErpError catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error.message)));
      }
    } finally {
      if (mounted) setState(() => _changing = false);
    }
  }

  @override
  void dispose() {
    unawaited(_foreground?.cancel());
    unawaited(_opened?.cancel());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.session.user!;
    final branch = object(user['branch']);
    return Scaffold(
      appBar: AppBar(
        title: Text(_section.title),
        actions: [
          if (_section != Section.settings)
            IconButton(
              tooltip: 'تحديث',
              icon: const Icon(Icons.refresh),
              onPressed: _reload,
            ),
        ],
      ),
      drawer: NavigationDrawer(
        selectedIndex: _section.index,
        onDestinationSelected: (index) {
          Navigator.pop(context);
          _select(Section.values[index]);
        },
        children: [
          Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Apple King ERP',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Text(
                  [
                    label(user['name']),
                    label(branch['nameAr'] ?? branch['name']),
                  ].where((text) => text.isNotEmpty).join(' · '),
                ),
              ],
            ),
          ),
          for (final section in Section.values)
            NavigationDrawerDestination(
              icon: Icon(section.icon),
              label: Text(section.title),
            ),
        ],
      ),
      body: SafeArea(
        child: _section == Section.settings ? _settings() : _content(),
      ),
    );
  }

  Widget _settings() => ListView(
    padding: const EdgeInsets.all(16),
    children: [
      SwitchListTile(
        title: const Text('الدخول بالبصمة أو Face ID'),
        subtitle: Text(
          widget.biometricAvailable
              ? 'افتح جلستك المحفوظة بتحقق الجهاز.'
              : 'فعّل البصمة أو Face ID من إعدادات جهازك.',
        ),
        value: widget.session.remembersSession,
        onChanged: widget.busy || !widget.biometricAvailable
            ? null
            : widget.onToggleBiometrics,
      ),
      const Divider(),
      ListTile(
        leading: const Icon(Icons.notifications_outlined),
        title: const Text('تنبيهات الجهاز العامة'),
        subtitle: const Text('إشعارات حسابك متاحة في صندوق الإشعارات.'),
        onTap: _pushBusy ? null : () => _setPush(true),
        trailing: TextButton(
          onPressed: _pushBusy ? null : () => _setPush(false),
          child: const Text('إيقاف'),
        ),
      ),
      if (_pushBusy) const LinearProgressIndicator(),
      const Divider(),
      if (widget.error case final error?) Text(error),
      ListTile(
        leading: const Icon(Icons.logout),
        title: const Text('تسجيل الخروج'),
        enabled: !widget.busy,
        onTap: widget.onSignOut,
      ),
    ],
  );

  Widget _content() => FutureBuilder<Json>(
    key: ValueKey(_section),
    future: _result,
    builder: (context, snapshot) {
      if (snapshot.connectionState != ConnectionState.done) {
        return const Center(child: CircularProgressIndicator());
      }
      if (snapshot.hasError) {
        return Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  snapshot.error is ErpError
                      ? snapshot.error.toString()
                      : 'تعذّر تحميل البيانات.',
                ),
                TextButton(onPressed: _reload, child: const Text('حاول تاني')),
              ],
            ),
          ),
        );
      }
      final response = snapshot.data ?? const <String, dynamic>{};
      final data = response['data'];
      final list = _section == Section.notifications
          ? rows(object(data)['notifications'])
          : rows(data);
      final totalPages = object(response['meta'])['totalPages'];
      return RefreshIndicator(
        onRefresh: _reload,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            if (_section == Section.dashboard) ..._dashboard(object(data)),
            if (_section == Section.notifications &&
                list.any((item) => item['isRead'] == false))
              Align(
                alignment: AlignmentDirectional.centerStart,
                child: TextButton(
                  onPressed: _changing ? null : _markRead,
                  child: const Text('تحديد الكل كمقروء'),
                ),
              ),
            if (_section != Section.dashboard && list.isEmpty)
              const Padding(
                padding: EdgeInsets.all(24),
                child: Center(child: Text('مفيش بيانات للعرض.')),
              ),
            for (final item in list) _row(item),
            if (_section.paged && totalPages is num && totalPages > 1)
              OverflowBar(
                alignment: MainAxisAlignment.center,
                children: [
                  TextButton(
                    onPressed: _page > 1
                        ? () {
                            _page--;
                            unawaited(_reload());
                          }
                        : null,
                    child: const Text('السابق'),
                  ),
                  Text('$_page / $totalPages'),
                  TextButton(
                    onPressed: _page < totalPages
                        ? () {
                            _page++;
                            unawaited(_reload());
                          }
                        : null,
                    child: const Text('التالي'),
                  ),
                ],
              ),
          ],
        ),
      );
    },
  );

  List<Widget> _dashboard(Json data) {
    final kpis = object(data['kpis']);
    final installments = object(data['installments']);
    return [
      Text('ملخص الفرع', style: Theme.of(context).textTheme.headlineSmall),
      const SizedBox(height: 12),
      for (final (title, value, icon) in [
        (
          'مبيعات النهارده',
          money(object(kpis['todaySales'])['amount']),
          Icons.point_of_sale,
        ),
        ('إيرادات الشهر', money(kpis['monthlyRevenue']), Icons.trending_up),
        (
          'أقساط مستحقة النهارده',
          label(installments['dueToday']),
          Icons.calendar_today,
        ),
        ('أقساط متأخرة', label(installments['overdue']), Icons.event_busy),
        (
          'تذاكر الصيانة',
          label(object(data['repairs'])['total']),
          Icons.build_outlined,
        ),
      ])
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Card(
            child: ListTile(
              leading: Icon(icon),
              title: Text(title),
              subtitle: Text(value),
            ),
          ),
        ),
    ];
  }

  Widget _row(Json row) {
    final (title, subtitle, trailing) = switch (_section) {
      Section.phones => (
        '${label(row['brand'])} ${label(row['phoneModel'])}'.trim(),
        [
          label(row['storage']),
          label(row['color']),
        ].where((text) => text.isNotEmpty).join(' · '),
        money(row['salePrice']),
      ),
      Section.accessories => (
        label(row['nameAr'] ?? row['name']),
        'المخزون: ${label(row['quantity'])}',
        money(row['salePrice']),
      ),
      Section.sales => (
        label(row['invoiceNumber']),
        label(object(row['customer'])['fullName']),
        money(row['total']),
      ),
      Section.repairs => (
        label(row['deviceModel']),
        label(row['ticketNumber']),
        '',
      ),
      _ => (
        label(row['titleAr'] ?? row['title']),
        label(row['bodyAr'] ?? row['body']),
        row['isRead'] == false ? 'جديد' : '',
      ),
    };
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Card(
        child: ListTile(
          leading: Icon(_section.icon),
          title: Text(title),
          subtitle: subtitle.isEmpty ? null : Text(subtitle),
          trailing: trailing.isEmpty ? null : Text(trailing),
        ),
      ),
    );
  }
}
