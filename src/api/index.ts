// src/api/index.ts

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; // 1. 스토어 import

// 2. 기본 axios 인스턴스 (이미 있거나, 없다면 만드세요)
export const api = axios.create({
    baseURL: '<https://api.biryong-hankki.com>', // (예시) 백엔드 주소
});

// 3. Axios 요청 가로채기 (Request Interceptor)
// 'api' 인스턴스로 보내는 *모든 요청*은 보내기 '직전'에 이 함수를 통과합니다.
api.interceptors.request.use(
    (config) => {
        // 4. Zustand '가방'에서 토큰을 꺼냅니다.
        const token = useAuthStore.getState().token;

        // 5. 토큰이 있다면?
        if (token) {
            // 6. API 명세서대로 "Authorization" 헤더에 토큰을 심어줍니다!
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 7. 헤더가 추가된 요청(config)을 서버로 보냅니다.
        return config;
    },
    (error) => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);
