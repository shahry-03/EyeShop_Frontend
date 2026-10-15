"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ordersApi } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import type { PageResponse } from "@/types/product";
import { StatusBadge } from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Eye,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { formatDateTime } from "@/lib/format-time";
import { toast } from "sonner";

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse<Order> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getMyOrders(page, 10);
      setOrders(data?.content || []);
      setPageInfo(data);
    } catch {
      toast.error("Failed to load your orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

    try {
      setCancellingId(orderId);
      const updated = await ordersApi.cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
      );
      toast.success(`Order #${orderId} has been cancelled`);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to cancel order";
      toast.error(errorMsg || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const isCancellable = (status: OrderStatus) => {
    return status === "PLACED" || status === "CONFIRMED" || status === "PACKED";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your purchases, review receipts, and monitor delivery status.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors self-start sm:self-auto"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse More Products
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center bg-white dark:bg-[#0A0F1C]/40">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            No orders placed yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            You haven&apos;t placed any orders with EyeShop yet. Browse our optical catalog to get started.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {orders.map((order) => {
                    const cancellable = isCancellable(order.status);

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/orders/${order.id}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Details
                            </Link>

                            {cancellable && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={cancellingId === order.id}
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1 h-7 px-2"
                              >
                                {cancellingId === order.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5" />
                                )}
                                Cancel
                              </Button>
                            )}
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
    </div>
  );
}
