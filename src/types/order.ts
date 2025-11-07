// src/types/order.ts

export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

// POST /api/orders 요청(Request) 시 Body에 실어 보낼 데이터 타입
export interface CreateOrderRequest {
    items: {
        menuId: string;
        quantity: number;
    }[];
}

// 주문 항목
export interface OrderItem {
    id: string;
    menuId: string;
    menuName: string;
    restaurantName?: string;
    quantity: number;
    price: number;
    subtotal: number;
}

// POST /api/orders 성공(201) 시 Response의 'data' 필드 타입
export interface CreateOrderResponse {
    orderId: string;
    userId: string;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    orderedAt: string; // ISO 8601
}

// 결제 요청 페이로드
export interface OrderPaymentRequest {
    paymentKey: string;
    amount: number;
}

export interface OrderPaymentItem {
    id: string;
    menuName: string;
    quantity: number;
    price: number;
    subtotal: number;
    claimedCount: number;
}

export interface OrderPaymentDetail {
    paymentKey: string;
    method: string;
    approvedAt: string; // ISO 8601
}

export interface OrderPaymentResponse {
    orderId: string;
    status: OrderStatus;
    totalPrice: number;
    paidAt: string | null;
    shareQrCode: string | null;
    items: OrderPaymentItem[];
    payment: OrderPaymentDetail;
}

export interface OrderHistoryItem {
    id: string;
    menuId: string;
    mealLabel: string;
    menuName: string;
    restaurantName: string;
    ingredients: string | null;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface OrderHistoryOrder {
    id: string;
    orderedAt: string;
    totalPrice: number;
    items: OrderHistoryItem[];
}

export interface OrderHistoryResponse {
    orders: OrderHistoryOrder[];
    pagination: {
        page: number;
        totalPages: number;
        totalElements: number;
        limit: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}
