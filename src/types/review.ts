// src/types/review.ts

export interface Review {
    id: string;
    orderId: string;
    orderItemId?: string;
    mealTicketId?: string;
    menuId: string;
    menuName: string;
    menuIngredients?: string | null;
    ingredients?: string | null;
    restaurantId?: number;
    restaurantName?: string;
    userId: string;
    userName: string;
    rating: number; // (1~5)
    content: string;
    images?: string[];
    createdAt: string; // ISO 8601 날짜 문자열
    updatedAt: string;

    // --- (UI 표시를 위해 선택적으로 표시할 정보) ---
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
    orderItemId: string;
    mealTicketId: string;
    menuId: string;
    menuName: string;
    menuIngredients?: string | null;
    restaurantId?: number;
    restaurantName?: string;
    userId: string;
    userName: string;
    rating: number;
    content: string;
    images?: string[];
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

export interface ReviewPagination {
    page: number;
    totalPages: number;
    totalElements: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ReviewStatistics {
    totalReviews: number;
    averageRating: number;
}

export interface MyReviewsResponse {
    reviews: Review[];
    pagination: ReviewPagination;
    statistics: ReviewStatistics;
}

export interface ReviewsResponse {
    reviews: Review[];
    pagination: ReviewPagination;
    statistics: ReviewStatistics;
}

export interface ReviewDetail {
    id: string;
    orderId: string;
    orderItemId: string;
    mealTicketId: string;
    menuId: string;
    menuName: string;
    menuIngredients: string | null;
    userId: string;
    userName: string;
    rating: number;
    content: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface DeleteReviewResponse {
    deletedReviewId: string;
    menuId: string;
    menuName: string;
}
