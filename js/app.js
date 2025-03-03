// Request notification permission on app load
if ('Notification' in window) {
  Notification.requestPermission().then(function(permission) {
    if (permission === 'granted') {
      console.log('Notification permission granted');
    }
  });
}

// Update service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('../sw.js')
    .then(function(registration) {
      console.log('ServiceWorker registration successful');
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
      }).then(function(subscription) {
        console.log('Push notification subscription successful:', subscription);
      }).catch(function(error) {
        console.log('Push notification subscription failed:', error);
      });
    })
    .catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
