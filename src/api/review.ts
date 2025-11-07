import { api } from './index';
import type { ApiResponse } from '../types/api';
import type {
    DeleteReviewResponse,
    MyReviewsResponse,
    Review,
    ReviewDetail,
    ReviewItem,
    ReviewsResponse,
} from '../types/review';
import { RESTAURANT_META } from '../constants/restaurants';

interface FetchMyReviewsParams {
    page?: number;
    limit?: number;
}

interface FetchReviewsParams {
    page?: number;
    limit?: number;
}

const normalizeReview = (review: Review): Review => {
    const restaurantId = review.restaurantId ?? undefined;
    const meta =
        restaurantId !== undefined ? RESTAURANT_META[restaurantId] : undefined;
    const restaurantName = review.restaurantName ?? meta?.label;
    const mealTypeValue = review.mealType ?? meta?.label;
    const menuIngredients = review.menuIngredients ?? null;
    const ingredients = review.ingredients ?? menuIngredients ?? null;

    return {
        ...review,
        restaurantName,
        mealType: mealTypeValue as Review['mealType'],
        menuIngredients,
        ingredients,
        images: review.images ?? [],
    };
};

const withNormalizedReviews = <T extends { reviews: Review[] }>(
    data: T
): T => ({
    ...data,
    reviews: data.reviews.map(normalizeReview),
});

export interface CreateReviewPayload {
    orderId: string;
    orderItemId: string;
    mealTicketId: string;
    menuId: string;
    rating: number;
    content: string;
}

export const fetchMyReviews = async (
    params?: FetchMyReviewsParams
): Promise<MyReviewsResponse> => {
    const response = await api.get<ApiResponse<MyReviewsResponse>>(
        '/reviews/my',
        {
            params,
        }
    );

    return withNormalizedReviews(response.data.data);
};

export const fetchReviews = async (
    params?: FetchReviewsParams
): Promise<ReviewsResponse> => {
    const response = await api.get<ApiResponse<ReviewsResponse>>('/reviews', {
        params,
    });

    return withNormalizedReviews(response.data.data);
};

export const createReview = async (
    payload: CreateReviewPayload
): Promise<ReviewItem> => {
    const response = await api.post<ApiResponse<{ review: ReviewItem }>>(
        '/reviews',
        payload
    );

    return response.data.data.review;
};

export interface UpdateReviewPayload {
    rating: number;
    content: string;
}

export const updateReview = async (
    reviewId: string,
    payload: UpdateReviewPayload
): Promise<ReviewDetail> => {
    const response = await api.put<ApiResponse<{ review: ReviewDetail }>>(
        `/reviews/${reviewId}`,
        payload
    );

    const detail = response.data.data.review;
    return {
        ...detail,
        images: detail.images ?? [],
        content: detail.content ?? '',
        menuIngredients: detail.menuIngredients ?? null,
    };
};

export const deleteReview = async (
    reviewId: string
): Promise<DeleteReviewResponse> => {
    const response = await api.delete<ApiResponse<DeleteReviewResponse>>(
        `/reviews/${reviewId}`
    );

    return response.data.data;
};
