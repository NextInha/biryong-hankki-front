import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import { useAuthStore } from '../store/useAuthStore';
import iconProfile from '../assets/icons/icon-induck.svg';
import iconEditName from '../assets/icons/icon-edit-name.svg';
import iconArrow from '../assets/icons/noun-right.svg';

const MyPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const userName = user?.name ?? '인덕이';
    const userDept = useMemo(() => {
        if (user?.studentId) {
            return user.studentId;
        }
        return '학과 정보를 등록해주세요.';
    }, [user?.studentId]);

    const handleEditProfile = () => {
        const nextName = window.prompt(
            '새로운 이름을 입력해 주세요.',
            userName
        );

        if (!nextName || nextName.trim().length === 0) {
            return;
        }

        window.alert(`"${nextName}"(으)로 이름 변경 기능이 준비 중입니다.`);
    };

    const handleNavigateReview = () => {
        navigate('/my/reviews');
    };

    const handleNavigateOrders = () => {
        navigate('/orders');
    };

    return (
        <div className="flex h-screen flex-col bg-[#E6EDF3]">
            <TopHeaderSecond title="마이페이지" />

            <main className="flex-1 overflow-y-auto px-6 py-6 space-y-10">
                <section className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                        <img
                            src={iconProfile}
                            alt="프로필"
                            className="h-12 w-12"
                        />
                    </div>

                    <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                {userName}
                            </h2>
                            <button
                                type="button"
                                onClick={handleEditProfile}
                                className="flex items-center justify-center"
                            >
                                <img
                                    src={iconEditName}
                                    alt="이름 수정"
                                    className="h-5 w-5"
                                />
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            {userDept}
                        </p>
                    </div>
                </section>

                <section className="space-y-4 pr-2.5">
                    <button
                        type="button"
                        onClick={handleNavigateReview}
                        className="flex w-full items-center justify-between px-1"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={iconEditName}
                                alt="리뷰 아이콘"
                                className="h-5 w-5"
                            />
                            <span className="text-base font-semibold text-gray-900">
                                나의 리뷰
                            </span>
                        </div>
                        <img
                            src={iconArrow}
                            alt="바로가기"
                            className="h-4 w-4"
                        />
                    </button>

                    <button
                        type="button"
                        onClick={handleNavigateOrders}
                        className="flex w-full items-center justify-between px-1"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={iconEditName}
                                alt="주문내역 아이콘"
                                className="h-5 w-5"
                            />
                            <span className="text-base font-semibold text-gray-900">
                                나의 주문 내역
                            </span>
                        </div>
                        <img
                            src={iconArrow}
                            alt="바로가기"
                            className="h-4 w-4"
                        />
                    </button>
                </section>
            </main>
        </div>
    );
};

export default MyPage;
