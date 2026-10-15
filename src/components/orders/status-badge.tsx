import React from "react";
import type { OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "PLACED":
      return (
        <Badge variant="warning" className={`gap-1.5 font-medium ${className || ""}`}>
          <Clock className="h-3 w-3" /> Placed
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge variant="info" className={`gap-1.5 font-medium ${className || ""}`}>
          <CheckCircle className="h-3 w-3" /> Confirmed
        </Badge>
      );
    case "PACKED":
      return (
        <Badge variant="purple" className={`gap-1.5 font-medium ${className || ""}`}>
          <Package className="h-3 w-3" /> Packed
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge variant="info" className={`gap-1.5 font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ${className || ""}`}>
          <Truck className="h-3 w-3" /> Shipped
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge variant="success" className={`gap-1.5 font-medium ${className || ""}`}>
          <CheckCircle2 className="h-3 w-3" /> Delivered
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="destructive" className={`gap-1.5 font-medium ${className || ""}`}>
          <XCircle className="h-3 w-3" /> Cancelled
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge variant="outline" className={`gap-1.5 font-medium text-slate-500 ${className || ""}`}>
          <RotateCcw className="h-3 w-3" /> Returned
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
