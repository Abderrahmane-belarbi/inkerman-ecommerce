import { create } from "zustand"; // zustand is a state management library
import { persist } from "zustand/middleware";
type BrowsingHistory = {
  products: { id: string; category: string }[];
};
const initialState: BrowsingHistory = {
  products: [],
};

export const browsingHistoryStore = create<BrowsingHistory>()(
  persist(() => initialState, { // persist is a middleware
    name: "browsingHistoryStore", //the name in local storage
  })
);

export default function useBrowsingHistory() {
  const { products } = browsingHistoryStore();
  return {
    products,
    addItem: (product: { id: string; category: string }) => {
      const index = products.findIndex((p) => p.id === product.id);
      if (index !== -1) products.splice(index, 1); // Remove duplicate if it exists
      products.unshift(product); // Add id to the start

      if (products.length > 10) products.pop(); // Remove excess items if length exceeds 10

      browsingHistoryStore.setState({
        products,
      });
    },

    clear: () => {
      browsingHistoryStore.setState({
        products: [],
      });
    },
  };
}
