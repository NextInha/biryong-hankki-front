// src/api/auth.ts

import { api } from './index'; // 1. 우리가 만든 "만능 스마트폰" import
import type { LoginRequest, LoginResponse } from '../types/user';

// [로그인 API 함수]
// (id, pw를 받아서, 성공 시 LoginResponse를 반환)
export const apiLogin = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', data);

    // response.data.data
    return response.data.data;
};

// [로그아웃 API 함수]
export const apiLogout = async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
};

// [회원가입 API 함수]
// export const apiSignup = async (data: SignupRequest) => { ... };
