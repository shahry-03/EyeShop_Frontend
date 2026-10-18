"use client";

import React, { useEffect, useState, useCallback } from "react";
import { productsApi } from "@/lib/api/products";
import type { Product, PageResponse } from "@/types/product";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import { ProductImageModal } from "@/components/admin/product-image-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ImageIcon,
  FolderTree,
  Star,
} from "lucide-react";
import { formatDateTime } from "@/lib/format-time";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await productsApi.getProducts(page, 15, "createdAt,desc");
      setProducts(data?.content || []);
      setPageInfo(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleManageImages = (product: Product) => {
    setImageModalProduct(product);
    setIsImageModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete product "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await productsApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, update, and manage your e-commerce product catalog inventory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/dashboard/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
          >
            <FolderTree className="h-4 w-4 text-indigo-500" />
            Manage Categories
          </Link>

          <Button
            onClick={handleAddNew}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#0A0F1C]/40">
          <Package className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            No products found
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No products matched "${searchQuery}".`
              : "Start by creating your first product in the catalog."}
          </p>
          <Button onClick={handleAddNew} className="mt-5 gap-2 bg-indigo-600 text-white">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filtered.map((product) => {
                    const isOut = product.stock <= 0;
                    const isLow = product.stock > 0 && product.stock <= 5;
                    const primaryImg = product.images?.find((i) => i.isPrimary) || product.images?.[0];

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                          #{product.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                              {primaryImg?.url ? (
                                <img
                                  src={primaryImg.url}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xl">🛍️</span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {product.name}
                                </span>
                                {product.images && product.images.length > 0 && (
                                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full font-medium">
                                    {product.images.length} {product.images.length === 1 ? "img" : "imgs"}
                                  </span>
                                )}
                              </div>
                              {product.description && (
                                <div className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-xs font-medium">
                            {product.category?.name || "Uncategorized"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {isOut ? (
                            <Badge variant="destructive" className="gap-1 text-[11px]">
                              Out of Stock
                            </Badge>
                          ) : isLow ? (
                            <Badge variant="warning" className="gap-1 text-[11px]">
                              Low Stock ({product.stock})
                            </Badge>
                          ) : (
                            <Badge variant="success" className="gap-1 text-[11px]">
                              {product.stock} units
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {product.averageRating && product.averageRating > 0 ? (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-slate-900 dark:text-white">
                                {product.averageRating.toFixed(1)}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                ({product.totalReviews || 0})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">No reviews</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleManageImages(product)}
                              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                              title="Manage product images"
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleEdit(product)}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title="Edit product"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              disabled={deletingId === product.id}
                              onClick={() => handleDelete(product.id, product.name)}
                              className="text-slate-400 hover:text-red-600"
                              title="Delete product"
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pageInfo && pageInfo.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Page {pageInfo.page + 1} of {pageInfo.totalPages} ({pageInfo.totalElements} products)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pageInfo.first || pageInfo.page <= 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="gap-1 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pageInfo.last || !pageInfo.hasNext}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="gap-1 rounded-lg"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={editingProduct}
        onSuccess={() => fetchProducts(currentPage)}
      />

      {/* Product Image Modal */}
      <ProductImageModal
        open={isImageModalOpen}
        onOpenChange={setIsImageModalOpen}
        product={imageModalProduct}
        onImagesUpdated={() => fetchProducts(currentPage)}
      />
    </div>
  );
}
