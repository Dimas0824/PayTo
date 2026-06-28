# Push Notification Setup

Learn how to configure and send push notifications to POS terminals for important alerts and updates.

## Overview

Push notifications enable real-time communication with POS terminals for order confirmations, alerts, and system updates using the Web Push protocol.

## Problem: Need to generate VAPID keys for push notifications

Setting up VAPID (Voluntary Application Server Identification) keys for secure push notifications.

### Solution

**Generate VAPID keys using Laravel Tinker:**

```bash
php artisan tinker
```

```php
// Generate VAPID keys
$publicKey = 'BDi5f6e5V8xK6Yz...'; // 87 chars base64
$privateKey = 'qN8Z3e5R6t8U9y...'; // 44 chars base64
$subject = 'mailto:admin@payto.local';
```

**Or generate programmatically:**

```bash
# Using minishlink/webpush CLI (if available)
composer require minishlink/web-push
```

**Store VAPID keys in `.env`:**

```
VAPID_PUBLIC_KEY=BDi5f6e5V8xK6Yz...
VAPID_PRIVATE_KEY=qN8Z3e5R6t8U9y...
VAPID_SUBJECT=mailto:admin@payto.local
```

**Verify configuration:**

```php
// In a tinker session
dd(config('services.vapid'));
```

**Expected output:**

```php
[
  "public_key" => "BDi5f6e5V8xK6Yz...",
  "private_key" => "qN8Z3e5R6t8U9y...",
  "subject" => "mailto:admin@payto.local"
]
```

## Problem: Need to subscribe a POS terminal to push notifications

Setting up a POS terminal to receive push notifications.

### Solution

**Subscribe from frontend (React/Inertia):**

```javascript
import { useEffect } from 'react';

function usePushSubscription() {
  useEffect(() => {
    const subscribeToPush = async () => {
      try {
        // Check service worker registration
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          
          // Check if already subscribed
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            console.log('Already subscribed:', existingSubscription);
            return;
          }
          
          // Subscribe with VAPID public key
          const vapidPublicKey = 'BDi5f6e5V8xK6Yz...'; // Your public key
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
          
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
          
          // Send subscription to backend
          await fetch('/api/push/subscriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
              keys: {
                p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
                auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
              }
            })
          });
          
          console.log('Subscribed successfully');
        }
      } catch (error) {
        console.error('Push subscription error:', error);
      }
    };
    
    subscribeToPush();
  }, []);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
```

**Expected response:**

```json
{
  "message": "Push subscription created successfully.",
  "data": {
    "id": 1,
    "endpoint": "https://fcm.googleapis.com/fcm/send/xyz123...",
    "public_key": "BDi5f6e5V8xK6Yz...",
    "last_seen_at": "2026-06-28T20:30:00.000000Z"
  }
}
```

**What happens:**
- Subscription is stored in database
- Subscription can receive notifications for this user
- Last seen timestamp is updated
- Push service will deliver notifications to this endpoint

## Problem: Need to send test push notification

Verifying the push notification system is working correctly.

### Solution

**Send test notification:**

```bash
POST /api/push/test
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "title": "Test Notification",
  "body": "This is a test push notification from PayTo POS.",
  "icon": "/logo.png"
}
```

**Expected response:**

```json
{
  "message": "Pengiriman test push selesai.",
  "data": {
    "sent": 1,
    "failed": 0
  }
}
```

**Send to specific staff member:**

```bash
POST /api/push/test
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "user_id": 56,
  "title": "Shift Change Notification",
  "body": "Your shift is starting in 30 minutes.",
  "data": {
    "type": "shift_reminder",
    "timestamp": "2026-06-28T20:30:00+07:00"
  }
}
```

**Expected response:**

```json
{
  "message": "Pengiriman test push selesai.",
  "data": {
    "sent": 1,
    "failed": 0
  }
}
```

**What happens:**
- Notification is sent to all subscribed devices
- Delivery report is collected
- Failed subscriptions are logged
- Success/failure count is returned

## Problem: Need to handle notification permissions

Managing browser push notification permissions and prompts.

### Solution

**Check permission status:**

```javascript
const permission = await Notification.requestPermission();
console.log('Permission:', permission); // 'granted', 'denied', or 'default'
```

**Request permission with user interaction:**

```javascript
function requestPushPermission() {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications.');
    return;
  }
  
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      subscribeToPush();
    } else {
      console.log('Notification permission denied');
    }
  });
}
```

**Listen for permission changes:**

```javascript
navigator.permissions.query({ name: 'notifications' }).then(result => {
  console.log('Permission state:', result.state);
  
  result.onchange = () => {
    console.log('Permission changed to:', result.state);
    // Re-check subscription status
  };
});
```

**Display subscription status:**

```javascript
async function checkSubscriptionStatus() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  if (subscription) {
    console.log('✓ Subscribed to push notifications');
    console.log('Endpoint:', subscription.endpoint);
  } else {
    console.log('✗ Not subscribed - show subscribe button');
  }
}
```

**Unsubscribe from notifications:**

```javascript
async function unsubscribe() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  if (subscription) {
    await subscription.unsubscribe();
    
    // Remove from backend
    await fetch('/api/push/subscriptions', {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    console.log('Unsubscribed successfully');
  }
}
```

**Notification permission states:**
- `default`: Permission not yet requested (show prompt)
- `granted`: Permission granted (subscribe to push)
- `denied`: Permission denied (don't prompt again)

**Best practices:**
- Only request permission after user action (e.g., "Enable notifications")
- Explain what notifications will be sent before requesting
- Handle denied permission gracefully
- Provide settings to re-enable notifications
- Don't spam notifications - only send important alerts