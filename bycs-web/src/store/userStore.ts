'use client'

import { User } from '@/models/user.model';
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    clearAuth: () => void;
    accessToken: string | null;
    setAccessToken: (accessToken: string) => void;
}

interface TokenState {
    accessToken: string | null;
    setAccessToken: (accessToken: string) => void;
    clearToken: () => void;
}

const useAuthStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            setAccessToken: (accessToken) => set({ accessToken }),
            clearAuth: () => set({ user: null, accessToken: null }),
        }),
        {
            name: 'user-storage',
            storage: {
                getItem: (name) => {
                    const cookieValue = Cookies.get(name);
                    return cookieValue ? JSON.parse(cookieValue) : null;
                },
                setItem: (name, value) => {
                    Cookies.set(name, JSON.stringify(value), { expires: 7 });
                },
                removeItem: (name) => Cookies.remove(name),
            },
        }
    )
);

const useTokenStore = create<TokenState>()(
    persist(
        (set) => ({
            accessToken: null,
            setAccessToken: (accessToken) => set({ accessToken }),
            clearToken: () => set({ accessToken: null }),
        }),
        {
            name: 'token-storage',
            storage: {
                getItem: (name) => {
                    const cookieValue = Cookies.get(name);
                    return cookieValue ? { state: { accessToken: cookieValue } } : null;
                },
                setItem: (name, value) => {
                    Cookies.set(name, value.state.accessToken, { expires: 7 });
                },
                removeItem: (name) => Cookies.remove(name),
            },
        }
    )
);

export { useAuthStore, useTokenStore };

