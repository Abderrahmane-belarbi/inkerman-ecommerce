import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Cart, OrderItem, ShippingAddress } from "@/types";
import { calcDeliveryDateAndPrice } from "@/lib/actions/order.actions";
// 1. Understanding Zustand & Persist
// What is Zustand?
// Zustand is a lightweight, unopinionated state management library for React.

// It provides a simple API to create and update global state in React applications.

// What is Persist?
// persist is a middleware that automatically saves the cart state in local storage.
// This ensures that the cart remains stored even when the user refreshes the page.

const initialState: Cart = {
  items: [],              // List of cart items
  itemsPrice: 0,          // Total price of items
  taxPrice: undefined,    // Tax (if applicable)
  shippingPrice: undefined, // Shipping cost
  totalPrice: 0,          // Total cost including tax and shipping
  paymentMethod: undefined,  // Selected payment method
  shippingAddress: undefined, // User's shipping address
  deliveryDateIndex: undefined, // Selected delivery date option
};

interface CartState {
  cart: Cart;
  addItem: (item: OrderItem, quantity: number) => Promise<string>;

  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => void;

  clearCart: () => void
  setShippingAddress: (shippingAddress: ShippingAddress) => Promise<void>
  setPaymentMethod: (paymentMethod: string) => void
  setDeliveryDateIndex: (index: number) => Promise<void>
}
// 3. Creating the Zustand Store
// The create() function initializes the Zustand store.
// The persist() middleware ensures the cart data is saved in local storage.
// set is used to update the state.
// get is used to retrieve the current state.

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,
      addItem: async (item: OrderItem, quantity: number) => {
        const { items, shippingAddress } = get().cart;
        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        );

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error("Not enough items in stock");
          }
        } else {
          if (item.countInStock < item.quantity) {
            throw new Error("Not enough items in stock");
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }];

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              shippingAddress
            })),
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        return updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )?.clientId!;
      },
      updateItem: async (item: OrderItem, quantity: number) => {
        const { items, shippingAddress } = get().cart
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!exist) return
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity: quantity }
            : x
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
              shippingAddress
            })),
          },
        })
      },
      removeItem: async (item: OrderItem) => {
        const { items } = get().cart
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
            })),
          },
        })
      },
      init: () => set({ cart: initialState }),
      setShippingAddress: async (shippingAddress: ShippingAddress) => {
        const { items } = get().cart
        set({
          cart: {
            ...get().cart,
            shippingAddress,
            ...(await calcDeliveryDateAndPrice({
              items,
              shippingAddress,
            })),
          },
        })
      },
      setPaymentMethod: (paymentMethod: string) => {
        set({
          cart: {
            ...get().cart,
            paymentMethod,
          },
        })
      },
      setDeliveryDateIndex: async (index: number) => {
        const { items, shippingAddress } = get().cart
  
        set({
          cart: {
            ...get().cart,
            ...(await calcDeliveryDateAndPrice({
              items,
              shippingAddress,
              deliveryDateIndex: index,
            })),
          },
        })
      },
      clearCart: () => {
        set({
          cart: {
            ...get().cart,
            items: [],
          },
        })
      },
    }),
    {
      name: "cart-store",
    }
  )
);
export default useCartStore;
