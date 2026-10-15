"use client";

import React from "react";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const allCategories = ["All", ...categories.filter((c) => c && c.toLowerCase() !== "all")];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {allCategories.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat === "All" ? "" : cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              isSelected
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
