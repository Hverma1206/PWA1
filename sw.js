// ...existing code...

self.addEventListener('push', function(event) {
  if (event.data) {
    const notificationData = event.data.json();
    const options = {
      body: notificationData.body || 'New notification',
      icon: '../images/icon-192x192.png',
      badge: '../images/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Open App'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(
        notificationData.title || 'New Message',
        options
      )
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
