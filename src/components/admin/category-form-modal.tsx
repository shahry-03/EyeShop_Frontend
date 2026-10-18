"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { Category, CategoryRequest } from "@/types/category";
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
import { Loader2, FolderTree } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
  defaultParentId?: number | null;
  onSuccess: (saved: Category) => void;
}

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  categories,
  defaultParentId,
  onSuccess,
}: CategoryFormModalProps) {
  const isEditing = Boolean(category);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<number | string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setParentId(category.parentId ?? "");
    } else {
      setName("");
      setDescription("");
      setParentId(defaultParentId ?? "");
    }
  }, [category, defaultParentId, open]);

  // Exclude current category and its children when editing to prevent circular hierarchy
  const availableParents = useMemo(() => {
    if (!category) return categories;

    // Collect all descendants of category to prevent circular hierarchy
    const excludedIds = new Set<number>([category.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const c of categories) {
        if (c.parentId && excludedIds.has(c.parentId) && !excludedIds.has(c.id)) {
          excludedIds.add(c.id);
          changed = true;
        }
      }
    }

    return categories.filter((c) => !excludedIds.has(c.id));
  }, [categories, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const numericParentId = parentId !== "" ? Number(parentId) : null;

    const payload: CategoryRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      parentId: numericParentId,
    };

    try {
      setIsSubmitting(true);
      let res: Category;

      if (isEditing && category) {
        res = await categoriesApi.updateCategory(category.id, payload);
        toast.success(`Category "${res.name}" updated successfully`);
      } else {
        res = await categoriesApi.createCategory(payload);
        toast.success(`Category "${res.name}" created successfully`);
      }

      onSuccess(res);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to save category";
      toast.error(errorMsg || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-indigo-600" />
            {isEditing ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Designer Sunglasses, Polarized Lenses"
              maxLength={100}
            />
          </div>

          {/* Parent Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category-parent">Parent Category (Optional)</Label>
            <select
              id="category-parent"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">None (Top-Level Root Category)</option>
              {availableParents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name} {parent.parentId ? "(Subcategory)" : "(Root)"}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Leave blank to create a main category, or choose a parent to create a nested subcategory.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the products in this category..."
              maxLength={500}
            />
          </div>

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
              disabled={isSubmitting}
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
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
