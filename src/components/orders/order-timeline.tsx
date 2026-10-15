import React from "react";
import type { OrderStatusHistory } from "@/types/order";
import { StatusBadge } from "./status-badge";
import { formatTimeAgo, formatDateTime } from "@/lib/format-time";

interface OrderTimelineProps {
  history: OrderStatusHistory[];
}

export function OrderTimeline({ history }: OrderTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-3 italic">
        No status transitions recorded yet.
      </p>
    );
  }

  // Sort history chronologically descending or ascending
  const sorted = [...history].sort(
    (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
  );

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-[11px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {sorted.map((item, index) => {
        const isLatest = index === sorted.length - 1;

        return (
          <div key={item.id || index} className="relative group">
            {/* Dot marker */}
            <div
              className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 transition-all ${
                isLatest
                  ? "border-indigo-600 bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-900/40"
                  : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={item.toStatus} />
                {item.fromStatus && (
                  <span className="text-xs text-slate-400">
                    from {item.fromStatus}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono" title={formatDateTime(item.changedAt)}>
                {formatTimeAgo(item.changedAt)}
              </span>
            </div>

            {item.note && (
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 rounded bg-slate-100 dark:bg-slate-800/60 p-2 border border-slate-200/50 dark:border-slate-700/50">
                💬 {item.note}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
