// src/pages/HomePage.tsx

import { useState } from 'react'; // 1. useEffect 대신 useState만 사용
import TopHeader from '../components/layout/TopHeader';
import UserInfo from '../components/home/UserInfo';
import MealStatus from '../components/home/MealStatus';
import MyTicketCard from '../components/home/MyTicketCard';
import PurchaseButton from '../components/home/PurchaseButton';
import iconInduck from '../assets/icons/icon-induck.svg';

// '임시' 식권 타입
interface Ticket {
    id: string;
    menuName: string;
    restaurantName: string; // MyTicketCard에서 필요
    mealType: string; // MyTicketCard에서 필요
    ticketNumber: string; // MyTicketCard에서 필요
    purchaseTime: string; // MyTicketCard에서 필요
}

//  '가짜' 더미 데이터
const DUMMY_TICKET: Ticket = {
    id: 't1',
    menuName: '한상한담',
    restaurantName: '학생식당(학생회관)',
    mealType: '중식',
    ticketNumber: '0256',
    purchaseTime: '2025.10.13.월요일 12:37',
};

const HomePage = () => {
    //식권 상태 (임시)
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

    // (가정) 유저 정보
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

            <main className="pt-16  px-6 bg-[#E6EDF3] min-h-screen">
                {/* 유저 정보 & 식사 상태 */}
                <div className="flex justify-between items-center mb-6 z-15">
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

                    {/*'activeTicket'이 있으면 MyTicketCard 렌더링 */}
                    {activeTicket ? (
                        <MyTicketCard ticket={activeTicket} /> // 가짜 식권 데이터 전달
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
            </main>
        </>
    );
};

export default HomePage;
