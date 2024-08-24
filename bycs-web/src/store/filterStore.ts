'use client'

import { create } from 'zustand';
import { createSelectors } from './create-selectors';

interface FilterParams {
    priceRange: [number, number];
    filterCategories: string[];
    sortOption: string | null;
    currentPage: number;
    pageLimit: number;
}

interface FilterStore {
    filterParams: FilterParams;
    setPriceRange: (priceRange: [number, number]) => void;
    setFilterCategories: (filterCategories: string[]) => void;
    setSortOption: (sortOption: string) => void;
    setCurrentPage: (currentPage: number) => void;
    setPageLimit: (pageLimit: number) => void;
    clearFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
    filterParams: {
        priceRange: [0, 10000],
        filterCategories: [],
        sortOption: null,
        currentPage: 1,
        pageLimit: 8,
    },
    setPriceRange: (priceRange) => set((state) => ({
        filterParams: {
            ...state.filterParams,
            priceRange,
        },
    })),
    setFilterCategories: (filterCategories) => set((state) => ({
        filterParams: {
            ...state.filterParams,
            filterCategories,
        },
    })),
    setSortOption: (sortOption) => set((state) => ({
        filterParams: {
            ...state.filterParams,
            sortOption,
        },
    })),
    setCurrentPage: (currentPage) => set((state) => ({
        filterParams: {
            ...state.filterParams,
            currentPage,
        },
    })),
    setPageLimit: (pageLimit) => set((state) => ({
        filterParams: {
            ...state.filterParams,
            pageLimit,
        },
    })),
    clearFilters: () => set({
        filterParams: {
            priceRange: [0, 10000],
            filterCategories: [],
            sortOption: null,
            currentPage: 1,
            pageLimit: 8,
        },
    }),
}));

export const useFilterStoreSelector = createSelectors(useFilterStore);
export default useFilterStore;
