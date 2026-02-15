import { flushCheckoutQueue } from './offlineQueue';
import { subscribePushNotifications } from './pushNotifications';

export function initializePwa(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }

    const register = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            await subscribePushNotifications(registration);
            await flushCheckoutQueue();

            window.addEventListener('online', () => {
                void flushCheckoutQueue();
            });
        } catch {
            // silent
        }
    };

    if (document.readyState === 'complete') {
        void register();
        return;
    }

    window.addEventListener('load', () => {
        void register();
    });
}
