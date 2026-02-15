import axios from 'axios';

function toUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));

    for (let index = 0; index < rawData.length; ++index) {
        outputArray[index] = rawData.charCodeAt(index);
    }

    return outputArray;
}

export async function subscribePushNotifications(registration: ServiceWorkerRegistration): Promise<void> {
    if (typeof window === 'undefined' || !('PushManager' in window) || !('pushManager' in registration)) {
        return;
    }

    const pushRegistration = registration as ServiceWorkerRegistration & {
        pushManager: PushManager;
    };

    const publicKey = document.querySelector('meta[name="webpush-public-key"]')?.getAttribute('content') ?? '';
    if (!publicKey) {
        return;
    }

    let permission = Notification.permission;
    if (permission === 'default') {
        permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
        return;
    }

    const existingSubscription = await pushRegistration.pushManager.getSubscription();
    let subscription = existingSubscription;

    if (!subscription) {
        subscription = await pushRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: toUint8Array(publicKey),
        });
    }

    const payload = subscription.toJSON();
    await axios.post('/api/push/subscriptions', payload);
}
