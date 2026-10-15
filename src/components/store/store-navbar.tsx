"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/lib/cart-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/dashboard/user-nav";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Store,
  LayoutDashboard,
  ShieldAlert,
  LogIn,
  Search,
} from "lucide-react";

export function StoreNavbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { totalItems, setDrawerOpen, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const isAdmin = user?.roles?.some((r) => r.roleName === "ADMIN");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#060913]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8 gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-white text-lg">
            👁️
          </div>
          <span className="text-xl text-slate-900 dark:text-white">
            Eye<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/products"
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/products")
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            Products
          </Link>

          {user && (
            <>
              <Link
                href="/dashboard/orders"
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard/orders")
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                My Orders
              </Link>
              <Link
                href="/dashboard/addresses"
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard/addresses")
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                Addresses
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right side: Search, Theme, Cart, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Cart Icon with Live Badge */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 transition-all shadow-sm"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white shadow-md shadow-indigo-600/30 animate-in zoom-in-50 duration-200">
                {totalItems}
              </span>
            )}
          </button>

          {/* User state */}
          {!isLoading && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <UserNav user={user} />
            </div>
          ) : !isLoading && !user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
