export type Product = {
    id: number;
    name: string;
    price: number;
    discount?: number;
    category: string;
    stock: number;
    sku: string;
    isFavorite?: boolean;
    imageColor?: string;
};

export type CartItem = Product & {
    qty: number;
    discount: number;
    discountPerUnit: number;
};

export type PaymentMethod = 'CASH' | 'EWALLET';

export type SyncStatus = 'synced' | 'pending' | 'syncing';

export type Category = {
    id: string;
    label: string;
    icon: any;
};

export type TransactionItem = {
    id: string;
    name: string;
    qty: number;
    price: number;
};

export type TransactionHistory = {
    id: string;
    invoiceNo: string;
    time: string;
    status: 'PAID' | 'VOID';
    paymentMethod: 'CASH' | 'EWALLET';
    total: number;
    syncStatus: 'SYNCED' | 'PENDING';
    items: number;

    itemsDetail: TransactionItem[];
};
