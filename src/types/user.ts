// '임시' 식권 타입
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

    // (추가: 식권 사용 여부) -> MyTicketCard에서 사용 -> true면 식권 회색됨.
    isUsed?: boolean;
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
