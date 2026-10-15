# 🛍️ EyeShop Frontend

### A Complete Modern E-Commerce Web Client for EyeShop

**EyeShop Frontend** is built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**. It connects directly to the **EyeShop Spring Boot Backend** REST APIs, delivering an intuitive e-commerce shopping experience for local communities alongside enterprise-grade authentication and administrative controls.

---

## 🌟 Key Features

### 🛍️ Storefront & E-Commerce
* **EyeShop Landing Showcase**: Modern hero showcase, featured optical products, value guarantees, and category highlights.
* **Product Catalog (`/products`)**: Dynamic product listing with instant category filtering, search, and Spring Data pagination.
* **Product Detail (`/products/[id]`)**: High-resolution showcase, stock status indicators, quantity picker, instant "Add to Cart", and direct "Buy Now".
* **Global Shopping Cart**: Persistent Zustand cart store with slide-over drawer accessible from anywhere in the application, and dedicated `/cart` page with quantity spinners and subtotal recalculation.
* **Checkout Flow (`/checkout`)**: Multi-step checkout with delivery address selection, inline address creation modal, payment method simulation, and instant order placement.
* **Order Tracking (`/dashboard/orders/[id]`)**: Visual 5-step delivery pipeline (`PLACED` ➔ `CONFIRMED` ➔ `PACKED` ➔ `SHIPPED` ➔ `DELIVERED`), status audit trail, and customer order cancellation.
* **Address Management (`/dashboard/addresses`)**: Full CRUD for shipping addresses with default address designation and label tags (`HOME`, `WORK`, `OTHER`).

### 🔐 Security & Identity
* **JWT & Refresh Token Rotation**: Automatic token attachment and silent refresh interceptor via HttpOnly cookies.
* **Two-Factor Authentication (2FA)**: TOTP configuration with QR code generation and backup recovery codes.
* **Session Management**: Device and active browser inspection with selective or global session revocation.
* **Profile Management**: Account details editing and password change with permission checking.

### 🛡️ Administrative Portal (`/dashboard/admin`)
* **Admin Products Management (`/dashboard/admin/products`)**: Full catalog inventory control (add, edit, and delete products).
* **Admin Orders Management (`/dashboard/admin/orders`)**: System-wide order tracking with status filtering, lifecycle transitions, and courier tracking notes.
* **Admin Users & Roles (`/dashboard/admin/users`, `/dashboard/admin/roles`)**: Granular user status management and role permission binding.

---

## 🏗️ Project Structure

```text
Eyeshop_frontend/
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── components.json
├── public/
├── scripts/
│   └── legacy_patches/          # Preserved one-off scripts
└── src/
    ├── app/                     # Next.js App Router
    │   ├── page.tsx             # EyeShop Storefront Landing
    │   ├── products/            # Catalog and Product Details
    │   ├── cart/                # Dedicated Shopping Cart Page
    │   ├── checkout/            # Checkout with Address Selection
    │   ├── dashboard/           # Customer & Admin Dashboard
    │   │   ├── addresses/       # Saved Shipping Addresses
    │   │   ├── orders/          # Customer Order History & Tracking
    │   │   └── admin/           # Admin Products & Orders
    │   └── (auth)/              # Login, Register, Forgot Password
    ├── components/
    │   ├── store/               # StoreNavbar, ProductCard, CartDrawer, CategoryBar
    │   ├── orders/              # StatusBadge, OrderTimeline
    │   ├── addresses/           # AddressCard, AddressModal
    │   ├── admin/               # ProductFormModal, OrderStatusModal
    │   ├── dashboard/           # Sidebar, TopBar, UserNav
    │   └── ui/                  # Button, Badge, Dialog, Input, Textarea
    ├── hooks/
    │   └── useAuth.ts           # Authentication state hook
    ├── lib/
    │   ├── api-client.ts        # Axios client with auto-refresh interceptor
    │   ├── cart-store.ts        # Global Zustand cart store
    │   ├── format-time.ts       # Time and date formatting utilities
    │   └── api/                 # Typed API services (products, cart, orders, addresses)
    └── types/                   # TypeScript interfaces (Product, Cart, Order, Address)
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js 20+**
* **npm 10+**
* Running **EyeShop Backend** at `http://localhost:8080`

### 2. Environment Variables
Create `.env.local` in the `Eyeshop_frontend` root:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
