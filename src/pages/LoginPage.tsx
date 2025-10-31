import { useState, useEffect } from 'react';
import logoWhite from '../assets/icons/icon-logo-white.svg';
import logoBlue from '../assets/icons/icon-logo-blue.svg';
import inhaLogoBg from '../assets/icons/icon-inhauniv-logo-square.svg';

// 1. 스플래시 스크린 컴포넌트 (파란 화면)
const SplashScreen = ({ isFading }: { isFading: boolean }) => (
    <div
        className={`
      flex min-h-screen w-full bg-blue-600 
      items-center justify-center p-12
      transition-opacity duration-500
      ${isFading ? 'opacity-0' : 'opacity-100'} 
    `}
    >
        <img src={logoWhite} alt="비룡한끼 로고" className="w-1/2 max-w-xs" />
    </div>
);

// 2. 로그인 폼 컴포넌트 (흰색 화면)
const LoginForm = () => (
    <div
        className="
      flex min-h-screen w-full flex-col items-center
      justify-start bg-[#E6EDF3] p-6 relative
      transition-opacity duration-500 opacity-100 
    "
    >
        {/* 배경 인하대 로고 */}
        <div className="absolute bottom-0 right-25 w-full z-0 opacity-10 flex items-center justify-center">
            <img src={inhaLogoBg} alt="" className="w-2/3" />
        </div>

        <img src={logoBlue} alt="비룡한끼" className="h-24 mx-auto my-12" />

        {/* 로그인 폼 */}
        <div className="w-full max-w-md z-10">
            <h1 className="text-xl font-bold text-center mb-6 text-gray-800">
                로그인
            </h1>

            <form>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="아이디"
                        className="w-full p-3 bg-white  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        className="w-full p-3 bg-white  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <p className="text-xs text-gray-500 mb-4">
                    *로그인 아이디는 학교 포털에서 사용하는 학번 또는
                    사번입니다.
                </p>

                <div className="flex items-center mb-12 text-sm text-gray-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        로그인 상태 유지
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#0066B3] text-white p-3 rounded-md font-bold hover:bg-blue-700 transition-colors"
                >
                    로그인
                </button>
            </form>
        </div>
    </div>
);

// --- 3. 메인 LoginPage 컴포넌트 ---
const LoginPage = () => {
    // splash 로딩
    const [isLoading, setIsLoading] = useState(true);
    // animation 로딩
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const fadeOutTimer = setTimeout(() => {
            setIsFading(true);
        }, 2000);

        const removeTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (isLoading) {
        return <SplashScreen isFading={isFading} />;
    }

    return <LoginForm />;
};

export default LoginPage;
