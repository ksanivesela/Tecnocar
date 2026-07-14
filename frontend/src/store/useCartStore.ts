import { create } from "zustand";

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface CartStore {
  cart: CartItem[];

  add: (item: Omit<CartItem, "cantidad">) => void;

  remove: (id: number) => void;

  increase: (id: number) => void;

  decrease: (id: number) => void;

  clear: () => void;

  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  add: (item) =>
    set((state) => {
      const exist = state.cart.find((p) => p.id === item.id);

      if (exist) {
        return {
          cart: state.cart.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  cantidad: p.cantidad + 1,
                }
              : p
          ),
        };
      }

      return {
        cart: [...state.cart, { ...item, cantidad: 1 }],
      };
    }),

  remove: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  increase: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
            }
          : item
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item
        )
        .filter((item) => item.cantidad > 0),
    })),

  clear: () =>
    set({
      cart: [],
    }),

  total: () =>
    get().cart.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    ),
}));
