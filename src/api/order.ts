// src/api/order.ts

import { api } from './index'; // 공통 axios 인스턴스 (JWT 자동 포함)
import type { CartItem } from '../types/cart'; //  Zustand 장바구니 타입
import type { CreateOrderRequest, CreateOrderResponse } from '../types/order'; // 주문 생성 관련 타입
import type { ApiResponse } from '../types/api'; // 공통 응답 타입

/**
 * 1. 주문 생성 (장바구니) API 호출 함수
 * (POST /api/orders)
 * @param cartItems - Zustand 스토어의 'items' 배열
 */

export const apiCreateOrder = async (
    cartItems: CartItem[]
): Promise<CreateOrderResponse> => {
    // '장바구니' 데이터(CartItem[])를
    // API가 요구하는 '주문서' 데이터(CreateOrderRequest) 형식으로 변환
    const requestData: CreateOrderRequest = {
        items: cartItems.map((item) => ({
            menuId: item.id, // 우리 'id' -> 'menuId'
            quantity: item.quantity,
        })),
    };

    const response = await api.post<ApiResponse<CreateOrderResponse>>(
        '/api/orders',
        requestData
    );

    // 성공 시, 서버가 돌려준 '주문 정보'(response.data.data)를 반환
    return response.data.data;
};

/**
 * 2. 주문 결제 API 호출 함수
 * (POST /api/orders/:orderId/payment)
 *
 */
