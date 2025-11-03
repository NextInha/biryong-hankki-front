// src/types/review.ts

export interface Review {
    id: string;
    orderId: string;
    menuId: string;
    menuName: string;
    userId: string;
    userName: string;
    rating: number; // (1~5)
    content: string;
    images: string[];
    createdAt: string; // ISO 8601 날짜 문자열
    updatedAt: string;

    // --- (UI 표시를 위해 가짜 데이터에 추가할 정보) ---
    restaurantName?: string; // 예: "한상한담"
    mealType?: '조식' | '중식' | '석식'; // 예: "중식"
}
