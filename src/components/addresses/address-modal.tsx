"use client";

import React, { useState, useEffect } from "react";
import type { Address, AddressLabel, AddressRequest } from "@/types/address";
import { addressesApi } from "@/lib/api/addresses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Address | null;
  onSuccess: (savedAddress: Address) => void;
}

export function AddressModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: AddressModalProps) {
  const isEditing = Boolean(initialData);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [label, setLabel] = useState<AddressLabel>("HOME");
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || "");
      setPhone(initialData.phone || "");
      setAddressLine1(initialData.addressLine1 || "");
      setAddressLine2(initialData.addressLine2 || "");
      setCity(initialData.city || "");
      setState(initialData.state || "");
      setPostalCode(initialData.postalCode || "");
      setCountry(initialData.country || "Pakistan");
      setLabel(initialData.label || "HOME");
      setIsDefault(initialData.isDefault || false);
    } else {
      setFullName("");
      setPhone("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("Pakistan");
      setLabel("HOME");
      setIsDefault(false);
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !addressLine1.trim() || !city.trim()) {
      toast.error("Please fill in all required fields (Name, Phone, Address Line 1, City)");
      return;
    }

    const payload: AddressRequest = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      state: state.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
      country: country.trim() || undefined,
      label,
      isDefault,
    };

    try {
      setIsSubmitting(true);
      let res: Address;
      if (isEditing && initialData) {
        res = await addressesApi.updateAddress(initialData.id, payload);
        toast.success("Address updated successfully");
      } else {
        res = await addressesApi.createAddress(payload);
        toast.success("Address created successfully");
      }
      onSuccess(res);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to save address";
      toast.error(errorMsg || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Delivery Address" : "Add New Delivery Address"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Label selector */}
          <div className="space-y-1.5">
            <Label>Address Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["HOME", "WORK", "OTHER"] as AddressLabel[]).map((lbl) => (
                <button
                  type="button"
                  key={lbl}
                  onClick={() => setLabel(lbl)}
                  className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                    label === lbl
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
              />
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="space-y-1.5">
            <Label htmlFor="line1">Street Address / House # *</Label>
            <Input
              id="line1"
              required
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="House 12, Street 4, Sector G-10"
            />
          </div>

          {/* Address Line 2 */}
          <div className="space-y-1.5">
            <Label htmlFor="line2">Apartment / Suite / Landmark (Optional)</Label>
            <Input
              id="line2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Near City Hospital"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Islamabad"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">Province / State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Federal Capital"
              />
            </div>
          </div>

          {/* Postal code & Country */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="44000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Pakistan"
              />
            </div>
          </div>

          {/* Set default checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="isDefault" className="text-xs font-normal cursor-pointer">
              Set as my default shipping address
            </Label>
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
            <Button type="submit" disabled={isSubmitting} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
