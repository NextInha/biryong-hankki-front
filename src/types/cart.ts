// src/types/cart.ts

import type { Menu } from './menu';

// 우리가 만든 Menu 타입에 'quantity'(수량)만 추가합니다.
export interface CartItem extends Menu {
    quantity: number;
}
