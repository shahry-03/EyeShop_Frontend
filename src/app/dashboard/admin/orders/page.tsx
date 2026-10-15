"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ordersApi } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import type { PageResponse } from "@/types/product";
import { StatusBadge } from "@/components/orders/status-badge";
import { OrderStatusModal } from "@/components/admin/order-status-modal";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Eye,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { formatDateTime } from "@/lib/format-time";
import { toast } from "sonner";

const STATUS_FILTERS: (OrderStatus | "ALL")[] = [
  "ALL",
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse<Order> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getAllOrdersAdmin(page, 15, "createdAt,desc");
      setOrders(data?.content || []);
      setPageInfo(data);
    } catch {
      toast.error("Failed to load customer orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  const handleStatusUpdated = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === "ALL") return true;
    return o.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Manage Orders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor all store purchases and advance orders through the fulfillment lifecycle.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrders(currentPage)}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Orders
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((status) => {
          const isSelected = selectedFilter === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedFilter(status)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-purple-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-purple-600"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#0A0F1C]/40">
          <ClipboardList className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            No orders match this status
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {selectedFilter === "ALL"
              ? "No customer orders have been placed yet."
              : `There are currently no orders with status ${selectedFilter}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 truncate max-w-[140px]">
                        {order.userId}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusModalOrder(order)}
                            className="text-xs h-7 px-2.5 rounded-lg border-purple-200 text-purple-700 dark:border-purple-900/50 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold"
                          >
                            Update Status
                          </Button>

                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View customer order receipt"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pageInfo && pageInfo.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Page {pageInfo.page + 1} of {pageInfo.totalPages} ({pageInfo.totalElements} orders)
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

      {/* Status Modal */}
      <OrderStatusModal
        open={Boolean(statusModalOrder)}
        onOpenChange={(open) => {
          if (!open) setStatusModalOrder(null);
        }}
        order={statusModalOrder}
        onSuccess={handleStatusUpdated}
      />
    </div>
  );
}
