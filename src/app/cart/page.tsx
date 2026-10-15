"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { CartDrawer } from "@/components/store/cart-drawer";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Loader2,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    totalItems,
    totalPrice,
    isLoading,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100">
      <StoreNavbar />
      <CartDrawer />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 mb-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Continue Shopping
              </Link>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Shopping Cart
              </h1>
            </div>

            {cart && cart.items && cart.items.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to empty your cart?")) {
                    clearCart();
                  }
                }}
                className="text-xs text-slate-400 hover:text-red-500 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Cart
              </Button>
            )}
          </div>

          {isLoading && !cart?.items ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center bg-white dark:bg-[#0A0F1C]/40 max-w-xl mx-auto my-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Your cart is currently empty
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                Before you proceed to checkout, you must add some products to your shopping cart.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left 2 cols: Items list */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl font-bold">
                          🛍️
                        </div>
                        <div>
                          <Link
                            href={`/products/${item.productId}`}
                            className="font-semibold text-base text-slate-900 dark:text-white hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-xs text-slate-400 mt-1">
                            Unit Price: ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Controls and subtotal */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Quantity Spinner */}
                        <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="text-base font-bold text-slate-900 dark:text-white min-w-[70px] text-right">
                          ${(item.subtotal || item.price * item.quantity).toFixed(2)}
                        </span>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 1 col: Order Summary Card */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 shadow-sm space-y-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Total Items</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${(totalPrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500">
                    <span>Standard Shipping</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      FREE
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      Estimated Total
                    </span>
                    <span className="font-black text-2xl text-indigo-600 dark:text-indigo-400">
                      ${(totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Secure checkout with active order tracking</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
