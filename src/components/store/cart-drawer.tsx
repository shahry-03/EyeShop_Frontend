"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Loader2,
} from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    totalItems,
    totalPrice,
    isDrawerOpen,
    isLoading,
    setDrawerOpen,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useCartStore();

  useEffect(() => {
    if (isDrawerOpen) {
      fetchCart();
    }
  }, [isDrawerOpen, fetchCart]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={() => setDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0A0F1C] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Your Cart
                </h3>
                <p className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100 dark:divide-slate-800/80">
            {isLoading && !cart?.items?.length ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : !cart?.items?.length ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                  Your cart is empty
                </h4>
                <p className="mt-1 text-sm text-slate-500 max-w-[240px]">
                  Looks like you haven&apos;t added any products to your shopping cart yet.
                </p>
                <Link
                  href="/products"
                  onClick={() => setDrawerOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Explore Catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  {/* Item Avatar / Icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xl font-bold">
                    📦
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ${item.price.toFixed(2)} each
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:text-indigo-600 disabled:opacity-40 disabled:hover:text-inherit"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-indigo-600"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      ${(item.subtotal || item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & Checkout */}
          {cart && cart.items && cart.items.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 p-6 space-y-4 bg-slate-50/50 dark:bg-[#070B14]">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${(totalPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span>Total</span>
                  <span>${(totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
