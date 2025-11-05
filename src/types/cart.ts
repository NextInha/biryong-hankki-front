// src/types/cart.ts

import type { Menu } from './menu';

// Menu 타입에 'quantity'(수량)만 추가
export interface CartItem extends Menu {
    quantity: number;
}
