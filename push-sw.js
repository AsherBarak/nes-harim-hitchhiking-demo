/* Service worker for web push. Served from the app root so the site can subscribe for notifications. */
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) {}
  var body = d.body || (d.dest ? 'נוסע חדש מחפש: ' + d.dest + (d.when ? ' · ' + d.when : '') : 'עדכון חדש באפליקציה');
  e.waitUntil(self.registration.showNotification('טרמפים נס הרים', { body: body, dir: 'rtl', lang: 'he', data: d }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var id = e.notification.data && e.notification.data.notification_id;
  var url = new URL('./', self.registration.scope);
  if (id) url.searchParams.set('notification', id);
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    var app = list.find(function (c) { return c.url.indexOf(self.registration.scope) === 0; });
    if (app && id) { app.postMessage({ type: 'open_notification', id: id }); return app.focus(); }
    return clients.openWindow(url.href);
  }));
});
