"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { CartDrawer } from "@/components/store/cart-drawer";
import { ProductCard } from "@/components/store/product-card";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/types/product";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  Store,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productsApi
      .getProducts(0, 8)
      .then((res) => {
        setFeaturedProducts(res?.content || []);
      })
      .catch(() => {
        // If unauthenticated or no products, keep empty array
        setFeaturedProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* ─── Navigation & Cart Drawer ─── */}
      <StoreNavbar />
      <CartDrawer />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-950/30 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 backdrop-blur-xs shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Premium Eyewear & E-Commerce for Local Communities</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white">
              See the world clearly with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                EyeShop
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Discover designer frames, precision prescription lenses, polarized sunglasses, and optical accessories crafted with care for local businesses and individuals.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-all"
              >
                <ShoppingBag className="h-5 w-5" />
                Browse Catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all shadow-sm"
              >
                Customer Dashboard
              </Link>
            </div>

            {/* Micro value props */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Truck className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>Fast Local Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Authentic Optics</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <RotateCcw className="h-4 w-4 text-purple-500 shrink-0" />
                <span>Hassle-Free Returns</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Headphones className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Local Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Products Section ─── */}
      <section className="py-16 bg-white dark:bg-[#070B14] border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <Store className="h-3.5 w-3.5" />
                Handpicked Collection
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-slate-50/50 dark:bg-slate-900/30">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 mb-3">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                Catalog Ready to Explore
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Sign in to your account or browse our full collection of glasses, frames, and optical care products.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/products"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Go to Catalog
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Why Choose EyeShop ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Why Customers Love EyeShop
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
              We bridge the gap between quality optical manufacturers and local neighborhood communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 mb-5">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                Curated High-Grade Materials
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                From lightweight titanium frames to anti-reflective and blue-light blocking lenses, every item in our store is quality tested.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 mb-5">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                Fast Delivery & Tracking
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time tracking of every order from placement to packing, dispatch, and final delivery directly at your doorstep.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                Bank-Grade Security
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Enjoy complete peace of mind with TOTP Two-Factor Authentication, token rotation, and multi-session control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0F1C] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              👁️
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              Eye<span className="text-indigo-600">Shop</span>
            </span>
            <span className="text-xs text-slate-400 pl-2">
              © {new Date().getFullYear()} EyeShop Platform. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/products" className="hover:text-indigo-600">
              Catalog
            </Link>
            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
            <Link href="/playground" className="hover:text-indigo-600">
              API Playground
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
