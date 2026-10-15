"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreNavbar } from "@/components/store/store-navbar";
import { CartDrawer } from "@/components/store/cart-drawer";
import { AddressCard } from "@/components/addresses/address-card";
import { AddressModal } from "@/components/addresses/address-modal";
import { StatusBadge } from "@/components/orders/status-badge";
import { addressesApi } from "@/lib/api/addresses";
import { ordersApi } from "@/lib/api/orders";
import { cartApi } from "@/lib/api/cart";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/lib/cart-store";
import type { Address } from "@/types/address";
import type { Cart } from "@/types/cart";
import type { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Plus,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const resetCart = useCartStore((state) => state.reset);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    Promise.all([
      addressesApi.getAddresses().catch(() => []),
      cartApi.getCart().catch(() => null),
    ])
      .then(([addressList, cartData]) => {
        setAddresses(addressList);
        // Default to default address or first address
        const defaultAddr = addressList.find((a) => a.isDefault) || addressList[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
        setCart(cartData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, isAuthLoading, router]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address to proceed");
      return;
    }

    try {
      setIsPlacingOrder(true);
      const order = await ordersApi.checkout(selectedAddressId);
      setPlacedOrder(order);
      resetCart();
      toast.success("Order placed successfully!");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to place order";
      toast.error(errorMsg || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleAddressCreated = (newAddr: Address) => {
    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddressId(newAddr.id);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913]">
        <StoreNavbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  // Success Confirmation Screen
  if (placedOrder) {
    return (
      <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100">
        <StoreNavbar />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-2xl px-6 text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Order Confirmed
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                Thank you for your order!
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Order #{placedOrder.id} has been placed and received by our fulfillment center.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0F1C] p-6 text-left shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Order Status</span>
                <StatusBadge status={placedOrder.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Total Amount</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                    ${placedOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Shipping To</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block line-clamp-1">
                    {placedOrder.shippingAddress?.fullName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href={`/dashboard/orders/${placedOrder.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
              >
                Track Order Details
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If cart is empty
  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100">
        <StoreNavbar />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-md px-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
            <p className="text-sm text-slate-500">
              You must have items in your shopping cart before you can check out.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Browse Catalog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100">
      <StoreNavbar />
      <CartDrawer />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Checkout & Shipping
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left 2 cols: Delivery Address & Payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Select Address */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                      1
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Delivery Address
                    </h3>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="gap-1.5 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New Address
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white dark:bg-[#0A0F1C]/40 space-y-3">
                    <p className="text-sm text-slate-500">
                      You haven&apos;t added any shipping address yet.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="gap-2 bg-indigo-600 text-white"
                    >
                      <Plus className="h-4 w-4" /> Add Delivery Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        selected={selectedAddressId === address.id}
                        onSelect={() => setSelectedAddressId(address.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Payment Method */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Payment Method
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border-2 border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Cash on Delivery</h4>
                        <p className="text-xs text-slate-500">
                          Pay upon package arrival
                        </p>
                      </div>
                    </div>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Credit / Debit Card</h4>
                        <p className="text-xs text-slate-500">
                          Available in upcoming release
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 col: Order Review & Submit */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Review ({cart.totalItems} items)
              </h3>

              {/* Items mini list */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100 dark:divide-slate-800/80">
                {cart.items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                    <div className="min-w-0 pr-3">
                      <span className="font-semibold block truncate text-slate-800 dark:text-slate-200">
                        {item.productName}
                      </span>
                      <span className="text-slate-400">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">
                      ${(item.subtotal || item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline font-bold">
                  <span className="text-base text-slate-900 dark:text-white">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                size="lg"
                disabled={isPlacingOrder || !selectedAddressId}
                onClick={handlePlaceOrder}
                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 py-6 text-base font-semibold"
              >
                {isPlacingOrder ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                Place Order (${cart.totalPrice.toFixed(2)})
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Buyer Protection & Verified Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Address Creation Modal */}
      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        onSuccess={handleAddressCreated}
      />
    </div>
  );
}
