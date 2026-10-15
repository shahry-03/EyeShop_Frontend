"use client";

import React, { useState } from "react";
import type { Order, OrderStatus } from "@/types/order";
import { ordersApi } from "@/lib/api/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/orders/status-badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OrderStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSuccess: (updatedOrder: Order) => void;
}

const ALL_STATUSES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "PLACED", label: "Placed", desc: "Customer placed the order" },
  { status: "CONFIRMED", label: "Confirmed", desc: "Order confirmed by admin" },
  { status: "PACKED", label: "Packed", desc: "Items gathered and packaged" },
  { status: "SHIPPED", label: "Shipped", desc: "Dispatched with courier" },
  { status: "DELIVERED", label: "Delivered", desc: "Delivered to recipient" },
  { status: "CANCELLED", label: "Cancelled", desc: "Order cancelled before delivery" },
  { status: "RETURNED", label: "Returned", desc: "Customer returned order" },
];

export function OrderStatusModal({
  open,
  onOpenChange,
  order,
  onSuccess,
}: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order?.status || "CONFIRMED"
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setNote("");
    }
  }, [order, open]);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const updated = await ordersApi.updateOrderStatusAdmin(order.id, {
        status: selectedStatus,
        note: note.trim() || undefined,
      });
      toast.success(`Order #${order.id} status updated to ${selectedStatus}`);
      onSuccess(updated);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to update order status";
      toast.error(errorMsg || "Failed to update order status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Update Status for Order #{order.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Current Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs text-slate-500 font-medium">Current Status</span>
            <StatusBadge status={order.status} />
          </div>

          {/* Target Status Selection */}
          <div className="space-y-2">
            <Label>Select New Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_STATUSES.map(({ status, label, desc }) => {
                const isSelected = selectedStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {label}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audit Note */}
          <div className="space-y-1.5">
            <Label htmlFor="status-note">Status Note / Tracking Info (Optional)</Label>
            <Textarea
              id="status-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Dispatched with TCS tracking #77621482"
            />
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
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
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
