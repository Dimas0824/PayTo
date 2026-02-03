/**
 * Mock data for the admin dashboard UI.
 */

import type {
    InventoryRecommendation,
    StaffMember,
    Product,
    Notification,
    AdminProfile,
} from './types';

export const INVENTORY_DATA: InventoryRecommendation[] = [
    { id: 1, productName: "Kopi Susu Aren", sku: "BV-001", stock: 45, avgSales7d: 12.5, leadTime: 3, reorderPoint: 40, suggestedQty: 0, status: 'SAFE' },
    { id: 2, productName: "Croissant Butter", sku: "FD-001", stock: 5, avgSales7d: 8.0, leadTime: 2, reorderPoint: 16, suggestedQty: 11, status: 'CRITICAL' },
    { id: 3, productName: "Mineral Water", sku: "BV-003", stock: 18, avgSales7d: 15.0, leadTime: 1, reorderPoint: 20, suggestedQty: 2, status: 'WARNING' },
    { id: 4, productName: "Red Velvet Cake", sku: "FD-003", stock: 2, avgSales7d: 4.2, leadTime: 2, reorderPoint: 10, suggestedQty: 8, status: 'CRITICAL' },
    { id: 5, productName: "Beef Burger", sku: "FD-004", stock: 10, avgSales7d: 5.5, leadTime: 3, reorderPoint: 18, suggestedQty: 8, status: 'WARNING' },
];

export const STAFF_DATA: StaffMember[] = [
    { id: 1, name: "Budi Santoso", role: 'CASHIER', username: 'budi.s', status: 'ACTIVE', lastLogin: 'Sedang Online' },
    { id: 2, name: "Siti Aminah", role: 'SUPERVISOR', username: 'siti.admin', status: 'ACTIVE', lastLogin: '2 jam yang lalu' },
    { id: 3, name: "Joko Anwar", role: 'CASHIER', username: 'joko.a', status: 'INACTIVE', lastLogin: '3 hari yang lalu' },
];

export const PRODUCTS_DATA: Product[] = [
    { id: 1, name: "Kopi Susu Aren", sku: "BV-001", category: "Minuman", price: 18000, stock: 45, discount: 0, status: 'ACTIVE' },
    { id: 2, name: "Croissant Butter", sku: "FD-001", category: "Makanan", price: 22000, stock: 5, discount: 10, status: 'ACTIVE' },
    { id: 3, name: "Mineral Water", sku: "BV-003", category: "Minuman", price: 5000, stock: 18, discount: 0, status: 'ACTIVE' },
    { id: 4, name: "Red Velvet Cake", sku: "FD-003", category: "Dessert", price: 28000, stock: 2, discount: 0, status: 'INACTIVE' },
];

export const NOTIFICATIONS_DATA: Notification[] = [
    { id: 1, title: "Stok Kritis", message: "Croissant Butter & Red Velvet sisa sedikit.", type: 'ALERT', time: "Baru saja", read: false },
    { id: 2, title: "Permintaan Approval", message: "Budi S. meminta void transaksi #INV-2050.", type: 'INFO', time: "10 menit lalu", read: false },
    { id: 3, title: "Sync Berhasil", message: "24 Transaksi offline berhasil diunggah ke server.", type: 'SUCCESS', time: "1 jam lalu", read: true },
];

export const ADMIN_PROFILE: AdminProfile = {
    name: "Siti Aminah",
    role: "SUPERVISOR",
    id: "SPV-001",
    email: "siti.aminah@tokokopi.com",
    phone: "+62 812 3456 7890",
    joinDate: "12 Januari 2024",
    lastLogin: "Hari ini, 08:00 WIB",
};
