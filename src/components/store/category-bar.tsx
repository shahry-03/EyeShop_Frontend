"use client";

import React from "react";
import type { Category } from "@/types/category";
import { ChevronRight, Sparkles } from "lucide-react";

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryBar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryBarProps) {
  // Find which root category is active, or if a child is active, find its parent
  const activeRootCategory = categories.find((cat) => {
    if (cat.id === selectedCategoryId) return true;
    return cat.children?.some((child) => child.id === selectedCategoryId);
  });

  const hasSubcategories =
    activeRootCategory &&
    activeRootCategory.children &&
    activeRootCategory.children.length > 0;

  return (
    <div className="space-y-3">
      {/* ─── Level 1: Root Categories ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* All Products Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            selectedCategoryId === null
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
        >
          All Products
        </button>

        {/* Root Category Pills */}
        {categories.map((cat) => {
          const isDirectlySelected = selectedCategoryId === cat.id;
          const isParentOfSelected =
            cat.children?.some((c) => c.id === selectedCategoryId) ?? false;
          const isHighlighted = isDirectlySelected || isParentOfSelected;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isHighlighted
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <span>{cat.name}</span>
              {cat.children && cat.children.length > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isHighlighted
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {cat.children.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Level 2: Subcategories Ribbon (Hierarchical Drilldown) ─── */}
      {hasSubcategories && activeRootCategory && (
        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">
            {activeRootCategory.name}
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          </span>

          {/* All in Parent */}
          <button
            type="button"
            onClick={() => onSelectCategory(activeRootCategory.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1 font-medium transition-colors ${
              selectedCategoryId === activeRootCategory.id
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300"
            }`}
          >
            All {activeRootCategory.name}
          </button>

          {/* Child subcategories */}
          {activeRootCategory.children?.map((child) => {
            const isChildSelected = selectedCategoryId === child.id;

            return (
              <button
                key={child.id}
                type="button"
                onClick={() => onSelectCategory(child.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1 font-medium transition-all ${
                  isChildSelected
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs ring-1 ring-indigo-200 dark:ring-indigo-800"
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
              >
                {child.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
