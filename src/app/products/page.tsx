"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { CartDrawer } from "@/components/store/cart-drawer";
import { ProductCard } from "@/components/store/product-card";
import { CategoryBar } from "@/components/store/category-bar";
import { productsApi } from "@/lib/api/products";
import type { Product, PageResponse } from "@/types/product";
import {
  Search,
  ShoppingBag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  LogIn,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_CATEGORIES = [
  "Eyewear",
  "Frames",
  "Sunglasses",
  "Reading Glasses",
  "Lenses",
  "Optical Accessories",
  "Lens Care",
];

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthRequired, setIsAuthRequired] = useState(false);

  const fetchProducts = useCallback(async (page: number, category: string) => {
    try {
      setIsLoading(true);
      setIsAuthRequired(false);

      let data: PageResponse<Product>;
      if (category) {
        data = await productsApi.getProductsByCategory(category, page, 12);
      } else {
        data = await productsApi.getProducts(page, 12);
      }

      setProducts(data?.content || []);
      setPageInfo(data);
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;

      if (status === 401) {
        setIsAuthRequired(true);
      }
      setProducts([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory);
  }, [currentPage, selectedCategory, fetchProducts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(0);
  };

  // Filter products by local search query if present
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  // Extract all categories found in products or fallback to default
  const discoveredCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...products.map((p) => p.category).filter(Boolean)])
  );

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100">
      <StoreNavbar />
      <CartDrawer />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                EyeShop Store
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                Product Catalog
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore prescription eyeglasses, designer sunglasses, and optical lenses.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Category Bar */}
          <CategoryBar
            categories={discoveredCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {/* Content Area */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : isAuthRequired ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0F1C] p-12 text-center max-w-lg mx-auto shadow-sm my-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 mb-4">
                <LogIn className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Sign in to Browse Products
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                EyeShop backend currently requires authentication to access the product catalog. Please sign in to view items and make purchases.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm"
                >
                  Sign In Now
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pageInfo && pageInfo.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500">
                    Showing page {pageInfo.page + 1} of {pageInfo.totalPages} ({pageInfo.totalElements} total products)
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pageInfo.first || pageInfo.page <= 0}
                      onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                      className="gap-1 rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>

                    <span className="text-xs font-semibold px-2">
                      {pageInfo.page + 1}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pageInfo.last || !pageInfo.hasNext}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="gap-1 rounded-lg"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center bg-white dark:bg-[#0A0F1C]/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mb-3">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                No products found
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No products matched "${searchQuery}". Try a different keyword.`
                  : "There are currently no products in this category."}
              </p>
              {searchQuery && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-4"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
