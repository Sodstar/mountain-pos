import { create } from 'zustand'
import { CartItem, Product } from '@/types/product'
import { persist } from 'zustand/middleware'

type CartStore = {
    items: CartItem[]
    addToCart: (product: Product) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addToCart: (product) =>
                set((state) => {
                    const existing = state.items.find((item) => item.id === product.id)
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        }
                    }
                    return {
                        items: [...state.items, { ...product, quantity: 1 }],
                    }
                }),
            removeFromCart: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
)