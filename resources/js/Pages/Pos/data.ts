import { Box, Coffee, LayoutGrid, Utensils } from 'lucide-react';

import type { Product, TransactionHistory } from './types';

export const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: "Kopi Susu Aren", price: 18000, category: "Minuman", stock: 45, sku: "BV-001", isFavorite: true, imageColor: "from-amber-200 to-orange-100" },
    { id: 2, name: "Americano Iced", price: 15000, category: "Minuman", stock: 12, sku: "BV-002", imageColor: "from-stone-300 to-stone-100" },
    { id: 3, name: "Croissant Butter", price: 22000, category: "Makanan", stock: 5, sku: "FD-001", isFavorite: true, imageColor: "from-yellow-200 to-amber-100" },
    { id: 4, name: "Spaghetti Carbonara", price: 35000, category: "Makanan", stock: 8, sku: "FD-002", imageColor: "from-orange-200 to-red-100" },
    { id: 5, name: "Mineral Water", price: 5000, category: "Minuman", stock: 100, sku: "BV-003", imageColor: "from-cyan-200 to-blue-100" },
    { id: 6, name: "Red Velvet Cake", price: 28000, category: "Makanan", stock: 0, sku: "FD-003", isFavorite: true, imageColor: "from-rose-300 to-pink-100" },
    { id: 7, name: "Matcha Latte", price: 24000, category: "Minuman", stock: 15, sku: "BV-004", imageColor: "from-emerald-200 to-green-100" },
    { id: 8, name: "Beef Burger", price: 45000, category: "Makanan", stock: 10, sku: "FD-004", isFavorite: true, imageColor: "from-orange-300 to-amber-200" },
    { id: 9, name: "Dimsum Ayam", price: 20000, category: "Makanan", stock: 25, sku: "FD-005", imageColor: "from-yellow-100 to-orange-50" },
    { id: 10, name: "Ice Lychee Tea", price: 18000, category: "Minuman", stock: 20, sku: "BV-005", imageColor: "from-red-100 to-rose-50" },
];

export const MOCK_HISTORY: TransactionHistory[] = [
    {
        id: 'tx-001',
        invoiceNo: '#INV-2048',
        time: '10:45',
        items: 3,
        total: 54000,
        paymentMethod: 'CASH',
        status: 'PAID',
        syncStatus: 'SYNCED',
        itemsDetail: [
            { id: 'tx-001-1', name: 'Kopi Susu Aren', qty: 1, price: 18000 },
            { id: 'tx-001-2', name: 'Americano Iced', qty: 1, price: 18000 },
            { id: 'tx-001-3', name: 'Ice Lychee Tea', qty: 1, price: 18000 },
        ],
    },
    {
        id: 'tx-002',
        invoiceNo: '#INV-2047',
        time: '10:30',
        items: 1,
        total: 18000,
        paymentMethod: 'EWALLET',
        status: 'PAID',
        syncStatus: 'SYNCED',
        itemsDetail: [
            { id: 'tx-002-1', name: 'Kopi Susu Aren', qty: 1, price: 18000 },
        ],
    },
    {
        id: 'tx-003',
        invoiceNo: '#INV-2046',
        time: '09:15',
        items: 5,
        total: 125000,
        paymentMethod: 'CASH',
        status: 'PAID',
        syncStatus: 'PENDING',
        itemsDetail: [
            { id: 'tx-003-1', name: 'Spaghetti Carbonara', qty: 1, price: 25000 },
            { id: 'tx-003-2', name: 'Matcha Latte', qty: 1, price: 25000 },
            { id: 'tx-003-3', name: 'Beef Burger', qty: 1, price: 25000 },
            { id: 'tx-003-4', name: 'Croissant Butter', qty: 1, price: 25000 },
            { id: 'tx-003-5', name: 'Ice Lychee Tea', qty: 1, price: 25000 },
        ],
    },
    {
        id: 'tx-004',
        invoiceNo: '#INV-2045',
        time: '08:50',
        items: 2,
        total: 40000,
        paymentMethod: 'CASH',
        status: 'VOID',
        syncStatus: 'SYNCED',
        itemsDetail: [
            { id: 'tx-004-1', name: 'Dimsum Ayam', qty: 1, price: 20000 },
            { id: 'tx-004-2', name: 'Mineral Water', qty: 1, price: 20000 },
        ],
    },
];

export const CATEGORIES = [
    { id: 'All', label: 'All Items', icon: LayoutGrid },
    { id: 'Minuman', label: 'Drinks', icon: Coffee },
    { id: 'Makanan', label: 'Foods', icon: Utensils },
    { id: 'Dessert', label: 'Desserts', icon: Box },
];

export const QUICK_CASH_AMOUNTS = [20000, 50000, 100000];
