"use client";

import React, { useEffect, useState } from "react";
import { addressesApi } from "@/lib/api/addresses";
import type { Address } from "@/types/address";
import { AddressCard } from "@/components/addresses/address-card";
import { AddressModal } from "@/components/addresses/address-modal";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const list = await addressesApi.getAddresses();
      setAddresses(list || []);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setIsActionLoading(true);
      await addressesApi.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted successfully");
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      setIsActionLoading(true);
      await addressesApi.setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      toast.success("Address set as default shipping address");
    } catch {
      toast.error("Failed to set address as default");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shipping Addresses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your saved delivery addresses for faster and smoother checkout.
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#0A0F1C]/40">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 mb-3">
            <MapPin className="h-7 w-7" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            No shipping addresses saved
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Add your home or office address to have your frames and lenses delivered directly to you.
          </p>
          <Button onClick={handleAddNew} className="mt-5 gap-2 bg-indigo-600 text-white">
            <Plus className="h-4 w-4" /> Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              isActionLoading={isActionLoading}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialData={editingAddress}
        onSuccess={() => fetchAddresses()}
      />
    </div>
  );
}
