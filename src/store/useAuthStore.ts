// src/store/useAuthStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. 보관할 데이터(상태)의 '타입' 정의
interface User {
    id: string;
    studentId: string;
    name: string;
}
interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User) => void; // 로그인
    clearAuth: () => void; // 로그아웃
}

// 2. 'persist'로 감싸서 localStorage에 자동 저장 (앱을 껐다 켜도 유지!)
export const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            // --- 초기 상태 ---
            token: null,
            user: null,

            // --- 상태 변경 함수 (액션) ---

            // 3. 로그인 시: '지갑'에 토큰과 유저 정보 저장
            setAuth: (token, user) => set({ token, user }),

            // 4. 로그아웃 시: '지갑' 비우기
            clearAuth: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage', // localStorage에 저장될 때의 키 이름
            storage: createJSONStorage(() => localStorage), // 저장소로 localStorage 사용
        }
    )
);
