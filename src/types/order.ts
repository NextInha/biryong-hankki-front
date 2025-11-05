// src/types/order.ts

// POST /api/orders 요청(Request) 시 Body에 실어 보낼 데이터 타입
export interface CreateOrderRequest {
    items: {
        menuId: string;
        quantity: number;
    }[];
}

// POST /api/orders 성공(201) 시 Response의 'data' 필드 타입
export interface OrderItem {
    id: number;
    menuId: string;
    menuName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface CreateOrderResponse {
    orderId: string;
    userId: string;
    items: OrderItem[];
    totalPrice: number;
    status: 'PENDING';
    orderedAt: string;

    // (UI 시뮬레이션을 위해 추가했던 가짜 데이터)
    restaurantName?: string;
    ticketNumber?: string;
    ingredients?: string;
}
