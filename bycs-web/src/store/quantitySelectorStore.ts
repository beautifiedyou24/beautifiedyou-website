import { create } from 'zustand';

interface QuantitySelectroState {
    quantity: number;
    setQuantity: (quantity: number) => void;
    loadQuantity: (initialQuantity: number) => void;
}

const useQuantitySelectroStore = create<QuantitySelectroState>((set) => ({
    quantity: 1,
    setQuantity: (quantity: number) => set({ quantity }),
    loadQuantity: (initialQuantity: number) => set({ quantity: initialQuantity }),
}));

export default useQuantitySelectroStore;
