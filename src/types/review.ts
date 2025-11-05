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

/**
 * 리뷰 작성 (POST /api/reviews) 요청 시 Body에 담길 데이터 타입
 */
export interface ReviewRequestBody {
    orderId: string;
    menuId: string;
    rating: number;
    content: string;
    images?: string[]; // (선택)
}

/**
 * 리뷰 작성 성공 (201 Created) 응답 시,
 * data.review 객체의 타입
 */
export interface ReviewItem {
    id: string;
    orderId: string;
    menuId: string;
    menuName: string;
    userId: string;
    userName: string;
    rating: number;
    content: string;
    images: string[];
    createdAt: string; // (ISO 8601)
    updatedAt: string; // (ISO 8601)
}

/**
 * 리뷰 작성 성공 (201 Created) 응답의 전체 타입
 */
export interface ReviewApiResponse {
    success: true;
    data: {
        review: ReviewItem;
    };
    message: string;
}
