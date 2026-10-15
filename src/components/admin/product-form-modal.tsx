"use client";

import React, { useState, useEffect } from "react";
import type { Product, ProductAddRequest, ProductUpdateRequest } from "@/types/product";
import { productsApi } from "@/lib/api/products";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price ?? "");
      setStock(product.stock ?? "");
      setCategory(product.category || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock(10);
      setCategory("");
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price greater than zero");
      return;
    }
    if (!category.trim()) {
      toast.error("Category is required");
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
          category: category.trim(),
        };
        res = await productsApi.updateProduct(product.id, updatePayload);
        toast.success("Product updated successfully");
      } else {
        const addPayload: ProductAddRequest = {
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          stock: isNaN(numericStock) || numericStock < 0 ? 0 : numericStock,
          category: category.trim(),
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
              <Label htmlFor="product-category">Category *</Label>
              <Input
                id="product-category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Eyewear, Lenses, Sunglasses"
              />
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
              disabled={isEditing}
              required={!isEditing}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
            />
            {isEditing && (
              <p className="text-[11px] text-slate-400">
                Note: Backend ProductUpdateRequest handles name, category, and price. Stock is set at creation.
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
              placeholder="Detailed description of the product, materials, lens types, etc."
            />
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
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
              disabled={isSubmitting}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
