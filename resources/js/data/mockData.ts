import { Coffee, Utensils, Box, LayoutGrid } from 'lucide-react';
import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: "Kopi Susu Aren", price: 18000, category: "Minuman", stock: 45, sku: "BV-001", imageColor: "from-amber-200 to-orange-100" },
    { id: 2, name: "Americano Iced", price: 15000, category: "Minuman", stock: 12, sku: "BV-002", imageColor: "from-stone-300 to-stone-100" },
    { id: 3, name: "Croissant Butter", price: 22000, category: "Makanan", stock: 5, sku: "FD-001", imageColor: "from-yellow-200 to-amber-100" },
    { id: 4, name: "Spaghetti Carbonara", price: 35000, category: "Makanan", stock: 8, sku: "FD-002", imageColor: "from-orange-200 to-red-100" },
    { id: 5, name: "Mineral Water", price: 5000, category: "Minuman", stock: 100, sku: "BV-003", imageColor: "from-cyan-200 to-blue-100" },
    { id: 6, name: "Red Velvet Cake", price: 28000, category: "Makanan", stock: 0, sku: "FD-003", imageColor: "from-rose-300 to-pink-100" },
    { id: 7, name: "Matcha Latte", price: 24000, category: "Minuman", stock: 15, sku: "BV-004", imageColor: "from-emerald-200 to-green-100" },
    { id: 8, name: "Beef Burger", price: 45000, category: "Makanan", stock: 10, sku: "FD-004", imageColor: "from-orange-300 to-amber-200" },
    { id: 9, name: "Dimsum Ayam", price: 20000, category: "Makanan", stock: 25, sku: "FD-005", imageColor: "from-yellow-100 to-orange-50" },
    { id: 10, name: "Ice Lychee Tea", price: 18000, category: "Minuman", stock: 20, sku: "BV-005", imageColor: "from-red-100 to-rose-50" },
];

export const CATEGORIES = [
    { id: 'All', label: 'All Items', icon: LayoutGrid },
    { id: 'Minuman', label: 'Drinks', icon: Coffee },
    { id: 'Makanan', label: 'Foods', icon: Utensils },
    { id: 'Dessert', label: 'Desserts', icon: Box },
];

export const formatRupiah = (num: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);
};
