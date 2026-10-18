"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/types/category";
import { CategoryFormModal } from "@/components/admin/category-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  Loader2,
  Folder,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const [treeData, flatData] = await Promise.all([
        categoriesApi.getCategoryTree(),
        categoriesApi.getCategories(),
      ]);

      setCategoryTree(treeData || []);
      setFlatCategories(flatData || []);

      // Auto-expand all root nodes by default
      if (treeData && treeData.length > 0) {
        setExpandedIds(new Set(treeData.map((c) => c.id)));
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddRoot = () => {
    setEditingCategory(null);
    setDefaultParentId(null);
    setIsModalOpen(true);
  };

  const handleAddSubcategory = (parentId: number) => {
    setEditingCategory(null);
    setDefaultParentId(parentId);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDefaultParentId(category.parentId ?? null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${name}"?\nNote: Products or subcategories linked to this category should be reassigned or deleted first.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await categoriesApi.deleteCategory(id);
      toast.success(`Category "${name}" deleted successfully`);
      fetchCategories();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to delete category";
      toast.error(msg || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  // Stats
  const rootCount = categoryTree.length;
  const subcategoryCount = Math.max(0, flatCategories.length - rootCount);

  // Filter categories by search if present
  const isSearching = Boolean(searchQuery.trim());
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.toLowerCase();
    return flatCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [searchQuery, flatCategories, isSearching]);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Manage Categories
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              Hierarchical
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Structure your catalog into multi-level categories and subcategories for easy customer browsing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/dashboard/admin/products"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-xs"
          >
            Manage Products
          </Link>
          <Button
            onClick={handleAddRoot}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Root Category
          </Button>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Categories
            </span>
            <FolderTree className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {flatCategories.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all hierarchy levels</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Root Categories
            </span>
            <Folder className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {rootCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Top-level navigation nodes</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Subcategories
            </span>
            <Layers className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {subcategoryCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Specialized child categories</p>
        </div>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter categories by name or slug..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* ─── Main Content ─── */}
      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : isSearching ? (
        /* Search results view */
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-slate-500">
            Search Results ({searchResults.length})
          </h3>
          {searchResults.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              No categories found matching &quot;{searchQuery}&quot;
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {searchResults.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-3 rounded-xl transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {cat.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {cat.slug}
                      </span>
                      {cat.parentId && (
                        <Badge variant="outline" className="text-[10px]">
                          Subcategory
                        </Badge>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleEdit(cat)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={deletingId === cat.id}
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      {deletingId === cat.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : categoryTree.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#0A0F1C]/40">
          <FolderTree className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            No categories created yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Create top-level root categories (like Eyewear, Sunglasses) and attach specialized subcategories to structure your shop.
          </p>
          <Button onClick={handleAddRoot} className="mt-5 gap-2 bg-indigo-600 text-white">
            <Plus className="h-4 w-4" /> Add Root Category
          </Button>
        </div>
      ) : (
        /* Hierarchical Tree View */
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] shadow-sm">
          <div className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Category Hierarchy</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-2">
            {categoryTree.map((root) => {
              const isExpanded = expandedIds.has(root.id);
              const children = root.children || [];
              const hasChildren = children.length > 0;

              return (
                <div key={root.id} className="py-2">
                  {/* Root Row */}
                  <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                    <div className="flex items-center gap-3">
                      {/* Collapse/Expand Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(root.id)}
                        disabled={!hasChildren}
                        className={`h-6 w-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ${
                          !hasChildren ? "opacity-30 cursor-default" : "hover:bg-slate-200 dark:hover:bg-slate-800"
                        }`}
                      >
                        {hasChildren ? (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        )}
                      </button>

                      {/* Icon */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Folder className="h-4 w-4" />
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900 dark:text-white">
                            {root.name}
                          </span>
                          <span className="font-mono text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            #{root.id} · {root.slug}
                          </span>
                          {hasChildren && (
                            <Badge className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold py-0.5">
                              {children.length} {children.length === 1 ? "subcategory" : "subcategories"}
                            </Badge>
                          )}
                        </div>
                        {root.description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {root.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSubcategory(root.id)}
                        className="h-8 gap-1 text-xs rounded-lg text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      >
                        <Plus className="h-3 w-3" /> Subcategory
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleEdit(root)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Edit category"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={deletingId === root.id}
                        onClick={() => handleDelete(root.id, root.name)}
                        className="text-slate-400 hover:text-red-600"
                        title="Delete category"
                      >
                        {deletingId === root.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Subcategories (Indented Tree) */}
                  {hasChildren && isExpanded && (
                    <div className="ml-12 pl-4 border-l-2 border-indigo-100 dark:border-indigo-950/50 mt-1 space-y-1 py-1">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                              <Layers className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                  {child.name}
                                </span>
                                <span className="font-mono text-[11px] text-slate-400">
                                  #{child.id} · {child.slug}
                                </span>
                              </div>
                              {child.description && (
                                <p className="text-xs text-slate-400 line-clamp-1">
                                  {child.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleEdit(child)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Edit subcategory"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              disabled={deletingId === child.id}
                              onClick={() => handleDelete(child.id, child.name)}
                              className="text-slate-400 hover:text-red-600"
                              title="Delete subcategory"
                            >
                              {deletingId === child.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Modal ─── */}
      <CategoryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        category={editingCategory}
        categories={flatCategories}
        defaultParentId={defaultParentId}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
