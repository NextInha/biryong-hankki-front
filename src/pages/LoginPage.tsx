// src/pages/LoginPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { apiLogin } from '../api/auth';
import { AxiosError } from 'axios';

import SplashScreen from '../components/auth/SplashScreen';
import LoginForm from '../components/auth/LoginForm';

// 임시 ApiError interface
interface ApiError {
    code: string;
    message: string;
}

// 메인 LoginPage 컴포넌트
const LoginPage = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    // 로그인 관련 상태
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSplash, setIsLoadingSplash] = useState(true);
    const [isFading, setIsFading] = useState(false);

    // 폼 제출 핸들러 (API 로직)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const data = await apiLogin({ studentId, password });
            setAuth(data.accessToken, data.user);
            navigate('/');
        } catch (err) {
            const error = err as AxiosError<{ error: ApiError }>;
            if (error.response && error.response.data.error) {
                const errorData = error.response.data.error;
                console.error('로그인 실패:', errorData);

                if (errorData.code === 'INVALID_CREDENTIALS') {
                    setErrorMsg('학번 또는 비밀번호가 일치하지 않습니다.');
                } else {
                    setErrorMsg(errorData.message);
                }
            } else {
                setErrorMsg('로그인 중 오류가 발생했습니다.');
            }
            setIsLoading(false);
        }
    };

    // 스플래시 스크린 타이머 로직
    useEffect(() => {
        const fadeOutTimer = setTimeout(() => {
            setIsFading(true);
        }, 2000);

        const removeTimer = setTimeout(() => {
            setIsLoadingSplash(false);
        }, 2500);
        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (isLoadingSplash) {
        return <SplashScreen isFading={isFading} />;
    }

    return (
        <LoginForm
            studentId={studentId}
            setStudentId={setStudentId}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            errorMsg={errorMsg}
        />
    );
};

export default LoginPage;
