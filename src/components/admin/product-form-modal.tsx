"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { Product, ProductAddRequest, ProductUpdateRequest } from "@/types/product";
import type { Category } from "@/types/category";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: (savedProduct: Product) => void;
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const isEditing = Boolean(product);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [stock, setStock] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch flat categories list when modal opens
  useEffect(() => {
    if (open) {
      setIsLoadingCategories(true);
      categoriesApi
        .getCategories()
        .then((data) => setCategories(data || []))
        .catch(() => toast.error("Failed to load category list"))
        .finally(() => setIsLoadingCategories(false));
    }
  }, [open]);

  // Compute hierarchical path label for each category (e.g., "Eyewear → Prescription Frames")
  const categoryOptions = useMemo(() => {
    const map = new Map<number, Category>();
    categories.forEach((c) => map.set(c.id, c));

    return categories.map((cat) => {
      const parts = [cat.name];
      let curr = cat;
      const visited = new Set<number>([cat.id]);

      while (curr.parentId && map.has(curr.parentId)) {
        if (visited.has(curr.parentId)) break; // avoid circular loops
        visited.add(curr.parentId);
        curr = map.get(curr.parentId)!;
        parts.unshift(curr.name);
      }

      return {
        id: cat.id,
        label: parts.join(" → "),
        isSubcategory: Boolean(cat.parentId),
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }, [categories]);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price ?? "");
      setStock(product.stock ?? "");
      setCategoryId(product.category?.id ?? "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock(10);
      setCategoryId(categories.length > 0 ? categories[0].id : "");
    }
  }, [product, open, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericPrice = Number(price);
    const numericStock = Number(stock);
    const numericCategoryId = Number(categoryId);

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price greater than zero");
      return;
    }
    if (!categoryId || isNaN(numericCategoryId) || numericCategoryId <= 0) {
      toast.error("Please select a category");
      return;
    }

    try {
      setIsSubmitting(true);
      let res: Product;

      if (isEditing && product) {
        const updatePayload: ProductUpdateRequest = {
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          categoryId: numericCategoryId,
        };
        res = await productsApi.updateProduct(product.id, updatePayload);
        toast.success("Product updated successfully");
      } else {
        const addPayload: ProductAddRequest = {
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          stock: isNaN(numericStock) || numericStock < 0 ? 0 : numericStock,
          categoryId: numericCategoryId,
        };
        res = await productsApi.addProduct(addPayload);
        toast.success("Product created successfully");
      }

      onSuccess(res);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to save product";
      toast.error(errorMsg || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aviator Classic Titanium Frames"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="product-category">Category *</Label>
                {categories.length === 0 && !isLoadingCategories && (
                  <Link
                    href="/dashboard/admin/categories"
                    target="_blank"
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    + Create Category
                  </Link>
                )}
              </div>
              <div className="relative">
                <select
                  id="product-category"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={isLoadingCategories}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isLoadingCategories ? "Loading categories..." : "Select a category..."}
                  </option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-price">Price ($) *</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99.99"
              />
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <Label htmlFor="product-stock">Stock Quantity *</Label>
            <Input
              id="product-stock"
              type="number"
              min="0"
              required
              disabled={isEditing}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
            />
            {isEditing && (
              <p className="text-[11px] text-slate-400">
                Note: Backend ProductUpdateRequest handles name, description, price, and category.
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of materials, lens specifications, warranty, etc."
            />
          </div>

          {/* Action buttons */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || categories.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
