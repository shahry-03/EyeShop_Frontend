"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingBag, Eye, Loader2, Sparkles, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsAdding(true);
      await addItem(product.id, 1);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Top Banner / Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/60 transition-colors group-hover:from-indigo-50/50 group-hover:to-purple-50/50 dark:group-hover:from-indigo-950/20 dark:group-hover:to-purple-950/20">
          {primaryImage?.url ? (
            <img
              src={primaryImage.url}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-md text-3xl font-bold transition-transform duration-300 group-hover:scale-110">
              🛍️
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="outline" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[11px] font-medium uppercase tracking-wider shadow-xs">
              {product.category?.name || "General"}
            </Badge>
          </div>

          {/* Stock Tag */}
          <div className="absolute right-3 top-3 z-10">
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-[11px] shadow-xs">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="warning" className="text-[11px] shadow-xs">
                Only {product.stock} left
              </Badge>
            ) : (
              <Badge variant="success" className="text-[11px] shadow-xs">
                In Stock ({product.stock})
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
            {product.description || "High quality product crafted for local customers and businesses."}
          </p>

          {/* Rating Snippet */}
          <div className="flex items-center gap-1.5 pt-1">
            {product.averageRating && product.averageRating > 0 ? (
              <>
                <div className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="ml-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  ({product.totalReviews || 0})
                </span>
              </>
            ) : (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Star className="h-3 w-3 text-slate-300 dark:text-slate-700" />
                No reviews yet
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Footer: Price & Add to Cart */}
      <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Price</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/products/${product.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>

          <Button
            type="button"
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            size="sm"
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
          >
            {isAdding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5" />
            )}
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
