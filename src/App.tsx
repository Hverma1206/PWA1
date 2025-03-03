import React, { useState, useEffect } from 'react';
import { Bell, BellOff, RefreshCw } from 'lucide-react';

function App() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState(false);
  const [notificationInterval, setNotificationInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if the browser supports notifications
    if ('Notification' in window) {
      // Get current notification permission
      setNotificationPermission(Notification.permission);
      
      // If already granted, set as subscribed
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
    }
  }, []);

  // Handle auto notifications
  useEffect(() => {
    if (autoNotifyEnabled && isSubscribed) {
      const interval = setInterval(() => {
        sendNotification('Automatic Notification', 'This is an automatic notification from the app.');
      }, 3000); // Send notification every 30 seconds
      
      setNotificationInterval(interval);
      
      return () => {
        if (notificationInterval) {
          clearInterval(notificationInterval);
        }
      };
    } else if (!autoNotifyEnabled && notificationInterval) {
      clearInterval(notificationInterval);
      setNotificationInterval(null);
    }
  }, [autoNotifyEnabled, isSubscribed, notificationInterval]);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const unsubscribeFromNotifications = () => {
    setIsSubscribed(false);
    setAutoNotifyEnabled(false);
    if (notificationInterval) {
      clearInterval(notificationInterval);
      setNotificationInterval(null);
    }
  };

  const sendNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      const options = {
        body,
        icon: '/pwa-192x192.png',
        vibrate: [100, 50, 100]
      };
      
      const notification = new Notification(title, options);
      setLastNotification(`${title}: ${body}`);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const toggleAutoNotifications = () => {
    setAutoNotifyEnabled(!autoNotifyEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <Bell className="mr-2" /> Notification PWA
          </h1>
          <p className="mt-2 opacity-90">A progressive web app with notification capabilities</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Notification Status</h2>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <span>Permission:</span>
              <span className={`font-medium ${
                notificationPermission === 'granted' ? 'text-green-600' : 
                notificationPermission === 'denied' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {notificationPermission || 'Not requested'}
              </span>
            </div>
            
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-2">
              <span>Subscription:</span>
              <span className={`font-medium ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                {isSubscribed ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {!isSubscribed ? (
              <button 
                onClick={requestNotificationPermission}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
                disabled={notificationPermission === 'denied'}
              >
                <Bell className="mr-2 h-5 w-5" />
                Enable Notifications
              </button>
            ) : (
              <>
                <button 
                  onClick={() => sendNotification('Manual Notification', 'This notification was triggered manually by clicking the button.')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Send Test Notification
                </button>
                
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <span className="flex items-center">
                    <RefreshCw className={`mr-2 h-5 w-5 ${autoNotifyEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                    Automatic Notifications:
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={autoNotifyEnabled}
                      onChange={toggleAutoNotifications}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <button 
                  onClick={unsubscribeFromNotifications}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center"
                >
                  <BellOff className="mr-2 h-5 w-5" />
                  Disable Notifications
                </button>
              </>
            )}
          </div>
          
          {lastNotification && (
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Last Notification:</h3>
              <p className="text-gray-600 mt-1">{lastNotification}</p>
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-500">
            <p>This is a Progressive Web App that demonstrates web notifications.</p>
            <p className="mt-1">You can install this app on your device for a native-like experience.</p>
            <p className="mt-1 text-amber-600">Note: In StackBlitz environment, some PWA features like Service Workers are limited.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;