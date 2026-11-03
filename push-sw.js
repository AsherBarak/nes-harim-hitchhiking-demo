/* Service worker for web push. Served from the app root so the site can subscribe for notifications. */
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) {}
  var body = d.dest ? 'נוסע חדש מחפש: ' + d.dest + (d.when ? ' · ' + d.when : '') : 'עדכון חדש באפליקציה';
  e.waitUntil(self.registration.showNotification('טרמפים נס הרים', { body: body, dir: 'rtl', lang: 'he' }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(function (list) {
    if (list.length) return list[0].focus();
    return clients.openWindow('./');
  }));
});
