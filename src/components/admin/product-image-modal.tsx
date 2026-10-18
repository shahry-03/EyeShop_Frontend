"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Product, ProductImage } from "@/types/product";
import { productsApi } from "@/lib/api/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Trash2,
  Star,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface ProductImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onImagesUpdated: () => void;
}

export function ProductImageModal({
  open,
  onOpenChange,
  product,
  onImagesUpdated,
}: ProductImageModalProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    if (!product) return;
    try {
      setIsLoading(true);
      const data = await productsApi.getProductImages(product.id);
      setImages(data || []);
    } catch {
      setImages(product.images || []);
    } finally {
      setIsLoading(false);
    }
  }, [product]);

  useEffect(() => {
    if (open && product) {
      fetchImages();
    } else {
      setImages([]);
    }
  }, [open, product, fetchImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const newImg = await productsApi.uploadProductImage(product.id, file);
      toast.success("Image uploaded to Cloudinary successfully");
      setImages((prev) => [...prev, newImg]);
      onImagesUpdated();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to upload image";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!product) return;
    try {
      setDeletingId(imageId);
      await productsApi.deleteProductImage(product.id, imageId);
      toast.success("Image deleted successfully");
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      onImagesUpdated();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete image";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    if (!product) return;
    try {
      setSettingPrimaryId(imageId);
      await productsApi.setPrimaryProductImage(product.id, imageId);
      toast.success("Primary image updated");
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
      onImagesUpdated();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update primary image";
      toast.error(msg);
    } finally {
      setSettingPrimaryId(null);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ImageIcon className="h-5 w-5 text-indigo-600" />
            Manage Images — {product.name}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Upload product photos to Cloudinary, choose the primary storefront image, or delete unneeded photos.
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-3">
          {/* Upload Area */}
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 text-center cursor-pointer transition-all hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Uploading to Cloudinary...
                </p>
                <p className="text-xs text-slate-400">Optimizing and storing asset</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Click to upload a new product image
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PNG, JPG, WEBP, GIF up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Current Images List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Uploaded Images ({images.length})
              </h3>
              {images.length > 0 && (
                <span className="text-xs text-slate-400">
                  Click &apos;Set Primary&apos; to choose the main storefront thumbnail
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                <ImageIcon className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  No images uploaded yet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload an image above to showcase this product in the store.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img) => {
                  const isDel = deletingId === img.id;
                  const isSettingPrimary = settingPrimaryId === img.id;

                  return (
                    <div
                      key={img.id}
                      className={`group relative overflow-hidden rounded-xl border bg-white dark:bg-[#0A0F1C] p-2 transition-all ${
                        img.isPrimary
                          ? "border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                        <img
                          src={img.url}
                          alt={`${product.name} image`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Primary Badge */}
                        {img.isPrimary && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="bg-indigo-600 text-white gap-1 text-[10px] font-semibold py-0.5 px-2 shadow-sm">
                              <Star className="h-3 w-3 fill-current" /> Primary
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="mt-2 flex items-center justify-between gap-1 pt-1">
                        {!img.isPrimary ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isSettingPrimary}
                            onClick={() => handleSetPrimary(img.id)}
                            className="h-7 text-xs gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
                            title="Set as primary thumbnail"
                          >
                            {isSettingPrimary ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Star className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-500" />
                            )}
                            Set Primary
                          </Button>
                        ) : (
                          <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 px-1">
                            Main Storefront
                          </span>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={isDel}
                          onClick={() => handleDelete(img.id)}
                          className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Delete image"
                        >
                          {isDel ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
