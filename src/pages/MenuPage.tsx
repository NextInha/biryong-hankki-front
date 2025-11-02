// src/pages/MenuPage.tsx

import { useState } from 'react';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import DateNavigator from '../components/menu/DateNavigator'; // (2번 파일)
import DailyMenuCard from '../components/menu/DailyMenuCard'; // (3번 파일)
import CalendarModal from '../components/menu/CalendarModal'; // (4번 파일)

// (가정) 조식/중식/석식 아이콘 이미지를 import
import iconBreakfast from '../assets/images/icon-breakfast.svg';
import iconLunch from '../assets/images/icon-lunch.svg';
// import iconDinner from '../assets/images/icon-dinner.svg';

// --- (임시) 메뉴 데이터 (디자인 시안 기반) ---
const DUMMY_MENU_DATA = {
    breakfast: {
        mealType: '조식',
        time: '08:00 ~ 09:00',
        icon: iconBreakfast, // 가지고 계신 아이콘 경로
        items: [
            {
                id: 'b1',
                name: '천원의 조식',
                price: 1000,
                ingredients:
                    '쌀밥, 돈육김치찌개, 새우까스*타르타르소스, 양념깻잎지무침, 요구르트, 배추김치',
            },
        ],
    },
    lunch: {
        mealType: '중식',
        time: '11:00 ~ 14:00',
        icon: iconLunch, // 가지고 계신 아이콘 경로
        items: [
            {
                id: 'l1',
                name: '한상한담',
                price: 5800,
                ingredients:
                    '제육김치볶음*두부, 쌀밥, 건파래볶음, 단무지, 배추김치',
            },
            {
                id: 'l2',
                name: '원플레이트',
                price: 5800,
                ingredients: '해물빠에야볶음밥, 쌀피고구마롤, 단무지, 배추김치',
            },
            {
                id: 'l3',
                name: 'Noodle',
                price: 5500,
                ingredients:
                    '김밥볶음밥&떡볶이, 왕김말이튀김, 단무지, 배추김치',
            },
            {
                id: 'l4',
                name: '테이크아웃',
                price: 6800,
                ingredients: '두부면샐러드',
            },
        ],
    },
    // (필요시 'dinner' 석식 데이터도 추가)
};
// --- (데이터 끝) ---

const MenuPage = () => {
    // 1. [핵심 상태 1] 현재 선택된 날짜 (기본값: 오늘)
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 2. [핵심 상태 2] 달력 모달이 열렸는지 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 3. 날짜 변경 함수 (DateNavigator의 < > 버튼용)
    const handleDateChange = (amount: number) => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + amount);
            return newDate;
        });
        // (나중에 여기에 API로 newDate의 메뉴를 불러오는 로직 추가)
    };

    // 4. 달력에서 날짜를 '선택'했을 때
    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            // (나중에 여기에 API로 date의 메뉴를 불러오는 로직 추가)
        }
        setIsModalOpen(false); // 모달 닫기
    };

    return (
        <>
            <TopHeaderSecond title="메뉴" />

            {/* 5. Layout.tsx와 동일하게 flex-col h-screen 구조로 잡기 */}
            <div className="flex flex-col h-screen bg-[#F0F4F8]">
                {/* 6. 날짜 탐색기 (헤더처럼 상단에 고정) */}
                <DateNavigator
                    currentDate={selectedDate}
                    onPrevClick={() => handleDateChange(-1)}
                    onNextClick={() => handleDateChange(1)}
                    onCalendarClick={() => setIsModalOpen(true)}
                />

                {/* 7. 메인 콘텐츠 (헤더 + 날짜탐색기 높이만큼 패딩)
            pt-20 (h-20 헤더) + pt-12 (h-12 탐색기) = pt-32
        */}
                <main
                    className="
          pt-32 pb-20 px-4 space-y-4 grow overflow-y-auto
          scrollbar-width-none [&::-webkit-scrollbar]:hidden
        "
                >
                    {/* 조식 카드 */}
                    <DailyMenuCard
                        mealType={DUMMY_MENU_DATA.breakfast.mealType}
                        time={DUMMY_MENU_DATA.breakfast.time}
                        icon={DUMMY_MENU_DATA.breakfast.icon}
                        items={DUMMY_MENU_DATA.breakfast.items}
                    />

                    {/* 중식 카드 */}
                    <DailyMenuCard
                        mealType={DUMMY_MENU_DATA.lunch.mealType}
                        time={DUMMY_MENU_DATA.lunch.time}
                        icon={DUMMY_MENU_DATA.lunch.icon}
                        items={DUMMY_MENU_DATA.lunch.items}
                    />
                </main>
            </div>

            {/* 8. 달력 모달 (isModalOpen이 true일 때만 보임) */}
            <CalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />
        </>
    );
};

export default MenuPage;
