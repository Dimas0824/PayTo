# PayTo POS System - Component Architecture

## Overview

This Laravel + Inertia.js + React application has been restructured into a modular component-based architecture for better maintainability and scalability.

## Directory Structure

```
resources/js/
├── app.tsx                 # Inertia app entry point
├── bootstrap.js            # Laravel Echo, Axios config
├── Components/             # Reusable UI components
│   ├── Cart.tsx           # Shopping cart panel with totals
│   ├── CartItemRow.tsx    # Individual cart item display
│   ├── CategoryFilter.tsx # Category selection pills
│   ├── Header.tsx         # Search bar and greeting
│   ├── PaymentModal.tsx   # Payment processing modal
│   ├── ProductCard.tsx    # Product display card
│   ├── ProductGrid.tsx    # Product grid container
│   └── Sidebar.tsx        # Navigation sidebar
├── Layouts/               # Page layouts
│   └── AppLayout.tsx      # Main app wrapper with background
├── Pages/                 # Inertia pages
│   └── MainLayout.tsx     # Main POS interface page
├── data/                  # Mock data and utilities
│   └── mockData.ts        # Product catalog, categories, helpers
└── types/                 # TypeScript definitions
    └── index.ts           # Shared type definitions
```

## Component Breakdown

### Layout Components

#### `AppLayout.tsx`

- Main wrapper for all pages
- Provides animated gradient background
- Handles global styling

#### `Sidebar.tsx`

**Props:**

- `isOffline: boolean` - Offline mode status
- `onToggleOffline: () => void` - Toggle offline callback

**Features:**

- App logo/branding
- Navigation icons
- Offline/online indicator
- User avatar

### UI Components

#### `Header.tsx`

**Props:**

- `searchQuery: string` - Current search text
- `onSearchChange: (query: string) => void` - Search handler
- `userName?: string` - User's display name

**Features:**

- Personalized greeting
- Real-time search input
- Glassmorphism design

#### `CategoryFilter.tsx`

**Props:**

- `categories: Category[]` - List of categories
- `selectedCategory: string` - Active category ID
- `onCategoryChange: (categoryId: string) => void` - Selection handler

**Features:**

- Segmented control design
- Icon + label display
- Smooth transitions

#### `ProductCard.tsx`

**Props:**

- `product: Product` - Product data
- `onAddToCart: (product: Product) => void` - Add to cart handler
- `formatRupiah: (amount: number) => string` - Currency formatter

**Features:**

- Gradient product image placeholder
- Stock indicator (warns when < 10)
- Out-of-stock overlay
- Hover animations
- SKU display

#### `ProductGrid.tsx`

**Props:**

- `products: Product[]` - Filtered products
- `onAddToCart: (product: Product) => void` - Add handler
- `formatRupiah: (amount: number) => string` - Formatter

**Features:**

- Responsive grid (2-4 columns)
- Scroll container with custom scrollbar
- Maps products to ProductCard components

#### `CartItemRow.tsx`

**Props:**

- `item: CartItem` - Cart item with quantity
- `onUpdateQty: (id: number, delta: number) => void` - Quantity adjuster
- `onRemove: (id: number) => void` - Remove item handler
- `onRequestDiscount: () => void` - Discount request
- `formatRupiah: (amount: number) => string` - Formatter

**Features:**

- Quantity stepper (+/-)
- Item total calculation
- Discount button
- SKU display
- Remove on qty = 0

#### `Cart.tsx`

**Props:**

- `cart: CartItem[]` - All cart items
- `onClearCart: () => void` - Clear all
- `onUpdateQty: (id: number, delta: number) => void` - Qty handler
- `onRemoveItem: (id: number) => void` - Remove handler
- `onRequestDiscount: () => void` - Discount request
- `onCheckout: () => void` - Payment trigger
- `subtotal: number` - Cart subtotal
- `taxAmount: number` - 11% tax
- `totalDiscount: number` - Total discounts
- `grandTotal: number` - Final total
- `formatRupiah: (amount: number) => string` - Formatter

**Features:**

- Empty state display
- Scrollable items list
- Breakdown: Subtotal, Tax, Discount
- Grand total display
- Checkout button (disabled when empty)

#### `PaymentModal.tsx`

**Props:**

- `show: boolean` - Visibility toggle
- `onClose: () => void` - Close handler
- `onConfirm: () => void` - Payment confirmation
- `totalDue: number` - Amount to pay
- `formatRupiah: (amount: number) => string` - Formatter

**Features:**

- Payment method selection (Cash/QRIS)
- Cash input with quick amounts
- Change calculation
- QRIS placeholder
- Print receipt button

### Page Components

#### `Pages/MainLayout.tsx`

**Description:** Main POS interface page that orchestrates all components.

**State:**

- `cart` - Shopping cart items
- `isOffline` - Offline mode flag
- `searchQuery` - Product search text
- `selectedCategory` - Active category filter
- `showPaymentModal` - Payment modal visibility

**Computed:**

- `subtotal` - Sum of item prices × quantities
- `taxAmount` - 11% of subtotal
- `totalDiscount` - Sum of discounts
- `grandTotal` - Subtotal - discounts
- `totalDue` - Grand total + tax

**Business Logic:**

- Stock validation on add to cart
- Quantity capping at stock level
- Search filtering (name + SKU)
- Category filtering

## Type Definitions

### `Product`

```typescript
{
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  imageColor?: string;
}
```

### `CartItem`

```typescript
Product & {
  qty: number;
  discount: number;
}
```

### `PaymentMethod`

```typescript
'CASH' | 'EWALLET'
```

## Utilities

### `formatRupiah(num: number): string`

Formats numbers to Indonesian Rupiah currency:

```typescript
formatRupiah(18000) // "Rp 18.000"
```

## Routing

**Route:** `/dashboard`  
**Controller:** `routes/web.php`  

```php
Route::get('/dashboard', function () {
    return inertia('MainLayout');
});
```

## Building

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
```

## Key Features

1. **Offline-First Design** - Toggle offline mode simulation
2. **Stock Management** - Real-time stock validation
3. **Search & Filter** - Live search by name/SKU + category filter
4. **Tax Calculation** - Automatic 11% tax on checkout
5. **Responsive Grid** - 2-4 column adaptive layout
6. **Glassmorphism UI** - Modern frosted glass effects
7. **Type Safety** - Full TypeScript coverage
8. **Component Reusability** - Modular, single-responsibility components

## Future Enhancements

- [ ] Backend API integration
- [ ] Real offline sync with IndexedDB
- [ ] Discount approval workflow
- [ ] Receipt printing
- [ ] Multi-user support
- [ ] Inventory management
- [ ] Sales analytics
