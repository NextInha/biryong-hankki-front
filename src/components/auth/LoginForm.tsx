// src/components/auth/LoginForm.tsx

import logoBlue from '../../assets/icons/icon-logo-blue.svg';
import inhaLogoBg from '../../assets/icons/icon-inhauniv-logo-square.svg';

// 1. [★핵심★] 부모(LoginPage)로부터 받아야 할 모든 'props' 정의
interface LoginFormProps {
    studentId: string;
    setStudentId: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    errorMsg: string;
}

const LoginForm = ({
    studentId,
    setStudentId,
    password,
    setPassword,
    handleSubmit,
    isLoading,
    errorMsg,
}: LoginFormProps) => (
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

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="아이디"
                        value={studentId} //  상태 연결
                        onChange={(e) => setStudentId(e.target.value)} // 상태 변경 함수 연결
                        disabled={isLoading} // 로딩 중 비활성화
                        className="w-full p-3 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password} // 상태 연결
                        onChange={(e) => setPassword(e.target.value)} // 상태 변경 함수 연결
                        disabled={isLoading} // 로딩 중 비활성화
                        className="w-full p-3 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {errorMsg && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {errorMsg}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading} // 로딩 중 비활성화
                    className="w-full bg-[#0066B3] text-white p-3 rounded-md font-bold hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {/* 로딩 상태에 따라 텍스트 변경 */}
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    </div>
);

export default LoginForm;
