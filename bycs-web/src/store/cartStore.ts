'use client'

import { Cart } from "@/models/cart.model";
import { create } from "zustand";

interface CartStore {
    cart: Cart[];
    addToCart: (item: Cart) => void;
    loadCart: () => void;
    updateCart: (id: string, color: string, key: keyof Cart, value: any) => void;
    removeFromCart: (id: string, color: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
    cart: [],
    addToCart: (item: Cart) => set((state) => {
        const existingItemIndex = state.cart.findIndex(cartItem =>
            cartItem.id === item.id && cartItem.color === item.color
        );

        let updatedCart;
        if (existingItemIndex !== -1) {
            updatedCart = state.cart.map((cartItem, index) => {
                if (index === existingItemIndex) {
                    return {
                        ...cartItem,
                        quantity: cartItem.quantity + 1,
                    };
                }
                return cartItem;
            });
        } else {
            updatedCart = [...state.cart, { ...item, quantity: 1 }];
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return { cart: updatedCart };
    }),
    loadCart: () => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            set({ cart: JSON.parse(storedCart) });
        }
    },
    updateCart: (id: string, color: string, key: keyof Cart, value: any) => set((state) => {
        const updatedCart = state.cart.map((item) =>
            item.id === id && item.color === color ? { ...item, [key]: value } : item
        );

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return { cart: updatedCart };
    }),
    removeFromCart: (id: string, color: string) => set((state) => {
        const updatedCart = state.cart.filter((item) => item.id !== id || item.color !== color);

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return { cart: updatedCart };
    }),
    clearCart: () => {
        localStorage.removeItem('cart');
        set({ cart: [] });
    },

}));

export default useCartStore;
