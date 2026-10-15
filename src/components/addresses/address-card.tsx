import React from "react";
import type { Address } from "@/types/address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Check, Trash2, Edit2, Home, Briefcase, Tag } from "lucide-react";

interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: (address: Address) => void;
  onDelete?: (id: number) => void;
  onSetDefault?: (id: number) => void;
  isActionLoading?: boolean;
}

export function AddressCard({
  address,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isActionLoading = false,
}: AddressCardProps) {
  const getLabelIcon = () => {
    switch (address.label) {
      case "HOME":
        return <Home className="h-3.5 w-3.5" />;
      case "WORK":
        return <Briefcase className="h-3.5 w-3.5" />;
      default:
        return <Tag className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-xl border p-5 transition-all ${
        onSelect ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-indigo-600 bg-indigo-50/30 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0F1C] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
      }`}
    >
      {/* Header with Label & Default badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs uppercase font-semibold">
            {getLabelIcon()}
            {address.label}
          </Badge>
          {address.isDefault && (
            <Badge variant="success" className="gap-1 text-xs font-medium">
              <Check className="h-3 w-3" /> Default
            </Badge>
          )}
        </div>

        {selected && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Recipient Details */}
      <div className="space-y-1 mb-4">
        <h4 className="font-semibold text-base text-slate-900 dark:text-white">
          {address.fullName}
        </h4>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span>{address.phone}</span>
        </div>
      </div>

      {/* Address Text */}
      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-0.5 mb-4">
        <p className="flex items-start gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
          <span>
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
          </span>
        </p>
        <p className="pl-5.5 text-xs text-slate-500">
          {[address.city, address.state, address.postalCode, address.country]
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>

      {/* Action buttons (if not in select-only mode) */}
      {(onEdit || onDelete || onSetDefault) && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {!address.isDefault && onSetDefault ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isActionLoading}
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address.id);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 p-0 h-auto"
            >
              Set as default
            </Button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={isActionLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={isActionLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this address?")) {
                    onDelete(address.id);
                  }
                }}
                className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
