// ['임시' 식권 타입 (API 명세서에 맞게 필드 추가)]
export interface Ticket {
    id: string; // 't1' (임시 ID)
    menuName: string; // '한상한담'
    restaurantName: string;
    mealType: string;
    ticketNumber: string; // '0256'
    purchaseTime: string;

    // (API 연동을 위해 추가)
    orderId: string; // (UUID)
    menuId: string; // (UUID)
}

export interface LoginRequest {
    studentId: string;
    password: string;
}
export interface User {
    id: string;
    studentId: string;
    name: string;
}
export interface LoginResponse {
    accessToken: string;
    user: User;
}
