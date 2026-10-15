import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/lib/api/cart";
import type { Cart } from "@/types/cart";
import { toast } from "sonner";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  totalItems: number;
  totalPrice: number;

  setDrawerOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isDrawerOpen: false,
      totalItems: 0,
      totalPrice: 0,

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const cart = await cartApi.getCart();
          set({
            cart,
            totalItems: cart?.totalItems ?? 0,
            totalPrice: cart?.totalPrice ?? 0,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      addItem: async (productId: number, quantity = 1) => {
        try {
          set({ isLoading: true });
          const updated = await cartApi.addItem({ productId, quantity });
          set({
            cart: updated,
            totalItems: updated?.totalItems ?? 0,
            totalPrice: updated?.totalPrice ?? 0,
            isLoading: false,
            isDrawerOpen: true,
          });
          toast.success("Item added to cart");
        } catch (err: unknown) {
          set({ isLoading: false });
          const errorMsg =
            err && typeof err === "object" && "response" in err
              ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
              : "Failed to add item to cart";
          toast.error(errorMsg || "Failed to add item to cart");
          throw err;
        }
      },

      updateQuantity: async (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        try {
          set({ isLoading: true });
          const updated = await cartApi.updateItem(itemId, { quantity });
          set({
            cart: updated,
            totalItems: updated?.totalItems ?? 0,
            totalPrice: updated?.totalPrice ?? 0,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          toast.error("Failed to update cart item");
        }
      },

      removeItem: async (itemId: number) => {
        try {
          set({ isLoading: true });
          const updated = await cartApi.removeItem(itemId);
          set({
            cart: updated,
            totalItems: updated?.totalItems ?? 0,
            totalPrice: updated?.totalPrice ?? 0,
            isLoading: false,
          });
          toast.success("Item removed from cart");
        } catch {
          set({ isLoading: false });
          toast.error("Failed to remove item");
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true });
          const updated = await cartApi.clearCart();
          set({
            cart: updated,
            totalItems: 0,
            totalPrice: 0,
            isLoading: false,
          });
          toast.success("Cart cleared");
        } catch {
          set({ isLoading: false });
          toast.error("Failed to clear cart");
        }
      },

      reset: () =>
        set({
          cart: null,
          totalItems: 0,
          totalPrice: 0,
          isDrawerOpen: false,
          isLoading: false,
        }),
    }),
    {
      name: "eyeshop-cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
