// src/pages/HomePage.tsx

import { useState } from 'react'; // 1. useEffect 대신 useState만 사용
import TopHeader from '../components/layout/TopHeader';
import UserInfo from '../components/home/UserInfo';
import MealStatus from '../components/home/MealStatus';
import MyTicketCard from '../components/home/MyTicketCard';
import PurchaseButton from '../components/home/PurchaseButton';
import iconInduck from '../assets/icons/icon-induck.svg';
import EventBanner from '../components/home/EventBanner';
import type { Ticket } from '../types/user';
import ReviewModal from '../components/home/ReviewModal';

//  UI용 더미 데이터
const DUMMY_TICKET: Ticket = {
    id: 't1',
    menuName: '한상한담',
    restaurantName: '학생식당(학생회관)',
    mealType: '중식',
    ticketNumber: '0256',
    purchaseTime: '2025.10.13.월요일 12:37',
    // (API 명세서 예시에서 가져온 UUID)
    orderId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    menuId: '550e8400-e29b-41d4-a716-446655440100',
    isUsed: false,
};

const HomePage = () => {
    //식권 상태 (임시)
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(
        DUMMY_TICKET
    );

    // 리뷰 모달 상태 관리
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    // 리뷰할 대상 식권 정보
    const [reviewTarget, setReviewTarget] = useState<Ticket | null>(null);

    // 식사 완료 버튼 -> 식사 상태 변경 및 리뷰 모달 여는 핸들러임
    const handleOpenReviewModal = (ticketData: Ticket) => {
        setActiveTicket({
            ...ticketData,
            isUsed: true,
        });
        console.log('리뷰할 식권:', ticketData);
        setReviewTarget(ticketData); // 클릭된 식권 정보 저장
        setIsReviewModalOpen(true); // 모달 열기
    };
    // 리뷰 모달 닫는 핸들러
    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        // setActiveTicket(null);
    };

    // UI용 fake 유저 정보
    const userInfo = {
        name: '김인하',
    };
    const ticketCount = activeTicket ? 256 : 0;

    return (
        <>
            <TopHeader />

            <div
                className="
          fixed top-20 left-0 right-0 container mx-auto
          flex items-center gap-2 p-3
          bg-white shadow-sm z-10
        "
            >
                <img className="w-6 h-6" src={iconInduck} alt="공지" />
                <span className="font-semibold text-gray-800">
                    10월 6일 ~ 10월 9일 휴무
                </span>
            </div>

            <main className="pt-16 pb-32 px-6  bg-[#E6EDF3] min-h-screen">
                {/* 유저 정보 & 식사 상태 */}
                <div className="flex justify-between items-center mb-4 z-15">
                    <UserInfo
                        name={userInfo.name}
                        ticketCount={ticketCount} // 가짜 장수 전달
                    />
                    <MealStatus />
                </div>

                {/* 나의 식권 섹션 */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        나의 식권
                    </h2>

                    {activeTicket ? (
                        // MyTicketCard에 prop 전달
                        <MyTicketCard
                            ticket={activeTicket}
                            onMealCompleteClick={handleOpenReviewModal}
                        /> // 가짜 식권 데이터 전달
                    ) : (
                        <p className="text-gray-500 p-4 text-center">
                            보유한 식권이 없습니다.
                        </p>
                    )}

                    {/* "식권 예매하기" 버튼은 항상 보임 */}
                    <PurchaseButton />

                    {/* 경고 문구 (식권이 있을 때만 보임) */}
                    {activeTicket && (
                        <p className="text-center text-sm text-gray-600 mt-4">
                            식사 수령 시 해당 모바일 식권을 제시해주세요.
                            <br />
                            캡처 화면은 인정되지 않습니다.
                        </p>
                    )}
                </section>

                <div className="mt-8 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">이벤트</h2>
                    <EventBanner />
                </div>
            </main>

            {/* 리뷰 모달 렌더링 */}
            {/* reviewTarget이 있을 때만 모달을 렌더링 (안정성) */}
            {reviewTarget && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={handleCloseReviewModal}
                    // reviewTarget에서 실제 데이터 전달
                    orderId={reviewTarget.orderId}
                    menuId={reviewTarget.menuId}
                    menuName={reviewTarget.menuName}
                />
            )}
        </>
    );
};

export default HomePage;
