// src/api/index.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// 기본 axios 인스턴스
export const api = axios.create({
    baseURL: '<https://api.biryong-hankki.com>', //  백엔드 주소
});

// Axios 요청 가로채기
api.interceptors.request.use(
    (config) => {
        //  Zustand에서 토큰을 꺼냅니다.
        const token = useAuthStore.getState().token;

        //  토큰이 있다면?
        if (token) {
            // API 명세서대로 Authorization 헤더에 토큰을 심기
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 헤더가 추가된 요청(config)을 서버로 보냅니다.
        return config;
    },
    (error) => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);
