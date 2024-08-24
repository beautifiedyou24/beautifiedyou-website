'use client'

import axiosInstance from '@/utils/axiosConfig';
import { message } from 'antd';
import { create } from 'zustand';
import { createSelectors } from './create-selectors';

interface Category {
    id: string;
    name: string;
    details?: string;
    slug: string;
    image?: string;
}

interface CategoryStore {
    categories: Category[];
    category: Category;
    selectedCategory: Category | null;
    fetchCategories: (pageNumber?: number) => Promise<void>;
    fetchSingleCategory: (slug: string) => Promise<void>;
    addCategory: (category: any) => void;
    updateCategory: (category: Category) => void;
    removeCategory: (categoryId: string) => void;
    setSelectedCategory: (category: Category) => void;
    clearSelectedCategory: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],
    category: {
        id: '',
        name: '',
        slug: '',
        details: '',
        image: '',
    },
    selectedCategory: null,
    fetchCategories: async (pageNumber = 1) => {
        try {
            const pageParam = pageNumber ? `page=${pageNumber}&` : '';
            const response = await axiosInstance.get(`/v1/categories?${pageParam}&sortBy=id&sortOrder=asc`);
            set({ categories: response.data.data.items });
        } catch (error) {
            message.error('Failed to load categories');
        }
    },
    fetchSingleCategory: async (slug: string) => {
        try {
            const response = await axiosInstance.get(`/v1/categories/${slug}`);
            set({ category: response.data.data, selectedCategory: response.data.data });
        } catch (error) {
            message.error('Failed to load category');
        }
    },
    addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
    updateCategory: (updatedCategory: Category) => {
        set((state) => ({
            categories: state.categories.map((category) =>
                category.id === updatedCategory.id ? updatedCategory : category
            ),
        }));
    },
    removeCategory: (categoryId: string) => {
        set((state) => ({
            categories: state.categories.filter((category) => category.id !== categoryId),
        }));
    },
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    clearSelectedCategory: () => set({ selectedCategory: null }),
}));

export const useCategoryStoreSelector = createSelectors(useCategoryStore);
export default useCategoryStore;
