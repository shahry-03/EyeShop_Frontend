"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ordersApi } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import { StatusBadge } from "@/components/orders/status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  XCircle,
  Loader2,
  CheckCircle2,
  Truck,
  Building,
  Phone,
} from "lucide-react";
import { formatDateTime } from "@/lib/format-time";
import { toast } from "sonner";

const STEP_ORDER: OrderStatus[] = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params?.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!orderId || isNaN(orderId)) return;

    setIsLoading(true);
    ordersApi
      .getOrderById(orderId)
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        toast.error("Order not found or permission denied");
        router.push("/dashboard/orders");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderId, router]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm(`Are you sure you want to cancel Order #${order.id}?`)) return;

    try {
      setIsCancelling(true);
      const updated = await ordersApi.cancelOrder(order.id);
      setOrder(updated);
      toast.success("Order has been cancelled successfully");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to cancel order";
      toast.error(errorMsg || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!order) return null;

  const isCancellable =
    order.status === "PLACED" ||
    order.status === "CONFIRMED" ||
    order.status === "PACKED";

  // Calculate current step index for the progress bar
  const currentStepIndex = STEP_ORDER.indexOf(order.status);
  const isTerminalCancelled = order.status === "CANCELLED" || order.status === "RETURNED";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Order #{order.id}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>

          {isCancellable && (
            <Button
              type="button"
              variant="outline"
              disabled={isCancelling}
              onClick={handleCancelOrder}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30 self-start sm:self-auto"
            >
              {isCancelling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Progress Track (if not cancelled) */}
      {!isTerminalCancelled && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Delivery Lifecycle
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {STEP_ORDER.map((step, idx) => {
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    } ${isCurrent ? "ring-4 ring-indigo-100 dark:ring-indigo-900/40" : ""}`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      isCompleted
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Items & Status Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Purchased Items ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xl font-bold">
                      🛍️
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-slate-900 dark:text-white block">
                        {item.productName || `Product #${item.productId}`}
                      </span>
                      <span className="text-xs text-slate-400">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline font-bold">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Price</span>
              <span className="text-xl text-indigo-600 dark:text-indigo-400">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Status Audit Trail
            </h3>

            <OrderTimeline history={order.statusHistory || []} />
          </div>
        </div>

        {/* Right 1 col: Shipping Address & Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              Delivery Information
            </h3>

            {order.shippingAddress ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    {order.shippingAddress.fullName}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Phone className="h-3 w-3" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.postalCode,
                      order.shippingAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No shipping address linked.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 shadow-sm space-y-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>Standard local delivery via registered courier</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Expected transit: 2-3 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
