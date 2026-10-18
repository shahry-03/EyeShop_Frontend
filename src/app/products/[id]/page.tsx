"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { CartDrawer } from "@/components/store/cart-drawer";
import { productsApi } from "@/lib/api/products";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductReviews } from "@/components/reviews/product-reviews";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params?.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!productId || isNaN(productId)) return;

    setIsLoading(true);
    productsApi
      .getProductById(productId)
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          const primaryIdx = data.images.findIndex((img) => img.isPrimary);
          setSelectedImageIndex(primaryIdx >= 0 ? primaryIdx : 0);
        }
      })
      .catch((err) => {
        toast.error("Product not found or unavailable");
        router.push("/products");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId, router]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAdding(true);
      await addItem(product.id, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      setIsBuyingNow(true);
      await addItem(product.id, quantity);
      router.push("/checkout");
    } finally {
      setIsBuyingNow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913]">
        <StoreNavbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100">
      <StoreNavbar />
      <CartDrawer />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          {/* Back link */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Product Showcase & Image Gallery */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] flex items-center justify-center min-h-[420px] max-h-[500px] shadow-sm p-6">
                {product.images && product.images.length > 0 && product.images[selectedImageIndex]?.url ? (
                  <img
                    src={product.images[selectedImageIndex].url}
                    alt={product.name}
                    className="w-full h-full max-h-[450px] object-contain transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-7xl shadow-xl shadow-indigo-500/10 transition-transform duration-300 hover:scale-105">
                    🛍️
                  </div>
                )}

                <div className="absolute top-6 left-6 z-10">
                  <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs shadow-xs">
                    {product.category?.name || "General"}
                  </Badge>
                </div>

                <div className="absolute top-6 right-6 z-10">
                  {isOutOfStock ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : isLowStock ? (
                    <Badge variant="warning">Only {product.stock} left in stock</Badge>
                  ) : (
                    <Badge variant="success">In Stock ({product.stock} units)</Badge>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                  {product.images.map((img, idx) => {
                    const isSelected = idx === selectedImageIndex;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                          "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all p-1 bg-white dark:bg-[#0A0F1C]",
                          isSelected
                            ? "border-indigo-600 ring-2 ring-indigo-500/20 scale-105 shadow-md"
                            : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 opacity-70 hover:opacity-100"
                        )}
                      >
                        <img
                          src={img.url}
                          alt={`${product.name} ${idx + 1}`}
                          className="h-full w-full object-cover rounded-lg"
                        />
                        {img.isPrimary && (
                          <span className="absolute bottom-1 right-1 rounded-full bg-indigo-600 text-[9px] font-bold text-white px-1.5 py-0.5 leading-none shadow-xs">
                            ★
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Details & Purchase Actions */}
            <div className="space-y-6">
              <div>
                {product.category?.name && (
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                  {product.name}
                </h1>

                {/* Rating Snippet */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {product.averageRating && product.averageRating > 0
                        ? product.averageRating.toFixed(1)
                        : "New"}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <a
                    href="#reviews"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    {product.totalReviews || 0} {product.totalReviews === 1 ? "review" : "reviews"}
                  </a>
                  {Boolean(product.totalReviews && product.totalReviews > 0) && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified Purchases
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Taxes calculated at checkout
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Product Overview
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {product.description ||
                    "Expertly designed optical product featuring high-durability craftsmanship, comfort-fit design, and pristine finish."}
                </p>
              </div>

              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">
                      Subtotal: ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  size="lg"
                  disabled={isOutOfStock || isAdding || isBuyingNow}
                  onClick={handleAddToCart}
                  className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 py-6 text-base font-semibold"
                >
                  {isAdding ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingBag className="h-5 w-5" />
                  )}
                  Add to Cart
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  disabled={isOutOfStock || isAdding || isBuyingNow}
                  onClick={handleBuyNow}
                  className="flex-1 rounded-xl border-slate-200 dark:border-slate-800 py-6 text-base font-semibold hover:border-indigo-400 dark:hover:border-indigo-500/40"
                >
                  {isBuyingNow && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                  Buy Now
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <Truck className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>Free Standard Delivery</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100% Genuine Optics</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <RotateCcw className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>14 Days Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Ratings */}
          <ProductReviews
            productId={product.id}
            productName={product.name}
            averageRating={product.averageRating}
            totalReviews={product.totalReviews}
            onReviewChanged={() => {
              if (productId && !isNaN(productId)) {
                productsApi.getProductById(productId).then(setProduct).catch(() => {});
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
