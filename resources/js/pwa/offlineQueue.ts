import axios from 'axios';

type CheckoutLineItem = {
    product_id: number;
    qty: number;
    discount_amount?: number;
};

export type CheckoutPayload = {
    payment_method: 'CASH' | 'EWALLET';
    cash_received?: number;
    reference?: string;
    items: CheckoutLineItem[];
};

type QueuedCheckoutRecord = CheckoutPayload & {
    local_txn_uuid: string;
    occurred_at: string;
};

const DB_NAME = 'payto-offline-db';
const STORE_NAME = 'checkout_queue';
const DB_VERSION = 1;
const DEVICE_ID_KEY = 'payto.device_id';

function createUuid(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'local_txn_uuid' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function withStore<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    const db = await openDb();

    return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);

        operation(store)
            .then((result) => {
                transaction.oncomplete = () => {
                    db.close();
                    resolve(result);
                };
            })
            .catch((error) => {
                db.close();
                reject(error);
            });

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };
    });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function getDeviceId(): string {
    if (typeof window === 'undefined') {
        return 'server';
    }

    const existing = window.localStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
        return existing;
    }

    const generated = createUuid();
    window.localStorage.setItem(DEVICE_ID_KEY, generated);

    return generated;
}

export async function enqueueCheckoutTransaction(payload: CheckoutPayload): Promise<QueuedCheckoutRecord> {
    const record: QueuedCheckoutRecord = {
        ...payload,
        local_txn_uuid: createUuid(),
        occurred_at: new Date().toISOString(),
    };

    await withStore('readwrite', async (store) => {
        await requestToPromise(store.put(record));

        return true;
    });

    return record;
}

async function getAllQueuedTransactions(): Promise<QueuedCheckoutRecord[]> {
    return withStore('readonly', async (store) => requestToPromise(store.getAll() as IDBRequest<QueuedCheckoutRecord[]>));
}

async function deleteQueuedTransaction(localTransactionUuid: string): Promise<void> {
    await withStore('readwrite', async (store) => {
        await requestToPromise(store.delete(localTransactionUuid));

        return true;
    });
}

export async function countQueuedTransactions(): Promise<number> {
    return withStore('readonly', async (store) => requestToPromise(store.count()));
}

export async function flushCheckoutQueue(): Promise<{ processed: number; pending: number }> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return {
            processed: 0,
            pending: await countQueuedTransactions(),
        };
    }

    const queued = await getAllQueuedTransactions();
    if (queued.length === 0) {
        return { processed: 0, pending: 0 };
    }

    try {
        const response = await axios.post('/api/pos/sync/batches', {
            device_id: getDeviceId(),
            batch_uuid: createUuid(),
            transactions: queued.map((transaction) => ({
                local_txn_uuid: transaction.local_txn_uuid,
                occurred_at: transaction.occurred_at,
                checkout: {
                    payment_method: transaction.payment_method,
                    cash_received: transaction.cash_received,
                    reference: transaction.reference,
                    items: transaction.items,
                },
            })),
        });

        const results: Array<{ local_txn_uuid: string; status: string }> = response?.data?.data?.results ?? [];
        const removableStatuses = new Set(['PROCESSED', 'DUPLICATE']);

        for (const result of results) {
            if (removableStatuses.has(result.status)) {
                await deleteQueuedTransaction(result.local_txn_uuid);
            }
        }

        const pending = await countQueuedTransactions();

        return {
            processed: queued.length - pending,
            pending,
        };
    } catch {
        return {
            processed: 0,
            pending: await countQueuedTransactions(),
        };
    }
}
