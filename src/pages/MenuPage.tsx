// src/pages/MenuPage.tsx

import { useState } from 'react';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import DateNavigator from '../components/menu/DataNavigator';
import CalendarModal from '../components/menu/CalendarModal';
import MenuEntryCard from '../components/menu/DailyEntryCard';

import iconBreakfast from '../assets/icons/icon-breakfast.svg';
import iconLunch from '../assets/icons/icon-lunch.svg';
import iconDinner from '../assets/icons/icon-dinner.svg';

// --- (임시) 메뉴 데이터 (DUMMY_MENU_DATA) ---
const DUMMY_MENU_DATA = {
    breakfast: {
        mealType: '조식',
        time: '08:00 ~ 09:00',
        icon: iconBreakfast,
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
        icon: iconLunch,
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
    dinner: {
        mealType: '석식',
        time: '17:00 ~ 18:30',
        icon: iconDinner,
        items: [
            {
                id: 'd1',
                name: '석식',
                price: 5500,
                ingredients: '닭개장, 쌀밥, 동그랑땡야채볶음, 지마구, 맛김치',
            },
        ],
    },
};

const MenuPage = () => {
    // --- (상태 관리 로직: useState, handleDateChange, handleDateSelect) ---
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDateChange = (amount: number) => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + amount);
            return newDate;
        });
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <TopHeaderSecond title="메뉴" />

            <div className="flex flex-col h-screen bg-[#F0F4F8]">
                <DateNavigator
                    currentDate={selectedDate}
                    onPrevClick={() => handleDateChange(-1)}
                    onNextClick={() => handleDateChange(1)}
                    onCalendarClick={() => setIsModalOpen(true)}
                />

                <main
                    className="
          pt-20 pb-20 px-6 space-y-8 grow overflow-y-auto
          scrollbar-width-none [&::-webkit-scrollbar]:hidden
        "
                >
                    {/* --- 조식 섹션 --- */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <img
                                src={DUMMY_MENU_DATA.breakfast.icon}
                                alt="조식"
                                className="w-6 h-6"
                            />
                            <h3 className="text-lg font-bold text-gray-900">
                                {DUMMY_MENU_DATA.breakfast.mealType}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {DUMMY_MENU_DATA.breakfast.time}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {DUMMY_MENU_DATA.breakfast.items.map((item) => (
                                <MenuEntryCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* --- 중식 섹션 --- */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <img
                                src={DUMMY_MENU_DATA.lunch.icon}
                                alt="중식"
                                className="w-6 h-6"
                            />
                            <h3 className="text-lg font-bold text-gray-900">
                                {DUMMY_MENU_DATA.lunch.mealType}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {DUMMY_MENU_DATA.lunch.time}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {DUMMY_MENU_DATA.lunch.items.map((item) => (
                                <MenuEntryCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                    {/* 석식 */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <img
                                src={DUMMY_MENU_DATA.dinner.icon}
                                alt="석식"
                                className="w-6 h-6"
                            />
                            <h3 className="text-lg font-bold text-gray-900">
                                {DUMMY_MENU_DATA.dinner.mealType}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {DUMMY_MENU_DATA.dinner.time}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {DUMMY_MENU_DATA.dinner.items.map((item) => (
                                <MenuEntryCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            {/* 달력 모달 (변경 없음) */}
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
