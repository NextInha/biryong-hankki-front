// src/types/api.ts

/**
 * 1. 공통 에러 응답의 'error' 객체 타입
 * (success: false일 때)
 */
export interface ApiError {
    code: string;
    message: string;
    details?: any; // (선택) details가 있을 수도 있으니 추가
}

export interface ApiErrorResponse {
    success: false;
    error: ApiError;
}

export interface ApiResponse<T> {
    success: true;
    data: T;
    message: string | null;
}
