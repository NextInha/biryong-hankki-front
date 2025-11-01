// src/store/useCartStore.ts

import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import type { Menu } from '../types/menu';

// 1. 스토어(카트)가 가질 '상태(state)'와 '행동(actions)'의 타입을 정의합니다.
interface CartState {
    items: CartItem[]; // 카트에 담긴 아이템 배열
    addItem: (menu: Menu) => void; // 아이템 추가
    removeItem: (menuId: string) => void; // 아이템 제거
    updateQuantity: (menuId: string, amount: number) => void; // 수량 변경 (+1 또는 -1)
    clearCart: () => void; // 장바구니 비우기 (결제 완료 후)
}

// 2. 'create' 함수를 사용해 스토어를 만듭니다.
export const useCartStore = create<CartState>((set) => ({
    // --- 3. '상태' (초기 데이터) ---
    items: [],

    // --- 4. '행동' (상태를 변경하는 함수들) ---

    // 1) 아이템 추가
    addItem: (menu) =>
        set((state) => {
            const existingItem = state.items.find(
                (item) => item.id === menu.id
            );

            if (existingItem) {
                // 4-1. 이미 카트에 있으면?
                // 'map'을 돌려서, 해당 아이템의 'quantity'만 +1 해줍니다.
                return {
                    items: state.items.map((item) =>
                        item.id === menu.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                // 4-2. 카트에 없으면?
                return { items: [...state.items, { ...menu, quantity: 1 }] };
            }
        }),

    // 2) 아이템 제거
    removeItem: (menuId) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== menuId),
        })),

    // 3) 수량 변경
    updateQuantity: (menuId, amount) =>
        set((state) => ({
            items: state.items
                .map((item) =>
                    item.id === menuId
                        ? { ...item, quantity: item.quantity + amount } // +1 또는 -1
                        : item
                )
                // 5. 만약 수량이 0개가 되면, 'filter'로 아예 배열에서 제거합니다.
                .filter((item) => item.quantity > 0),
        })),

    // 4) 장바구니 비우기
    clearCart: () => set({ items: [] }),
}));
