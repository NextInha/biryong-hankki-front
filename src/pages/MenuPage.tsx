// src/pages/MenuPage.tsx

import { useEffect, useMemo, useState } from 'react';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import DateNavigator from '../components/menu/DataNavigator';
import CalendarModal from '../components/menu/CalendarModal';
import MenuEntryCard from '../components/menu/DailyEntryCard';
import { fetchMenus } from '../api/menu';
import type { Menu } from '../types/menu';

import { RESTAURANT_META } from '../constants/restaurants';

const DEFAULT_RESTAURANT_ICON =
    RESTAURANT_META[2]?.icon ?? RESTAURANT_META[1]?.icon ?? '';

// --- (임시) 메뉴 데이터 (DUMMY_MENU_DATA) ---
// const DUMMY_MENU_DATA = {
//     breakfast: {
//         mealType: '조식',
//         time: '08:00 ~ 09:00',
//         icon: iconBreakfast,
//         items: [
//             {
//                 id: 'b1',
//                 name: '천원의 조식',
//                 price: 1000,
//                 ingredients:
//                     '쌀밥, 돈육김치찌개, 새우까스*타르타르소스, 양념깻잎지무침, 요구르트, 배추김치',
//             },
//         ],
//     },
//     lunch: {
//         mealType: '중식',
//         time: '11:00 ~ 14:00',
//         icon: iconLunch,
//         items: [
//             {
//                 id: 'l1',
//                 name: '한상한담',
//                 price: 5800,
//                 ingredients:
//                     '제육김치볶음*두부, 쌀밥, 건파래볶음, 단무지, 배추김치',
//             },
//             {
//                 id: 'l2',
//                 name: '원플레이트',
//                 price: 5800,
//                 ingredients: '해물빠에야볶음밥, 쌀피고구마롤, 단무지, 배추김치',
//             },
//             {
//                 id: 'l3',
//                 name: 'Noodle',
//                 price: 5500,
//                 ingredients:
//                     '김밥볶음밥&떡볶이, 왕김말이튀김, 단무지, 배추김치',
//             },
//             {
//                 id: 'l4',
//                 name: '테이크아웃',
//                 price: 6800,
//                 ingredients: '두부면샐러드',
//             },
//         ],
//     },
//     dinner: {
//         mealType: '석식',
//         time: '17:00 ~ 18:30',
//         icon: iconDinner,
//         items: [
//             {
//                 id: 'd1',
//                 name: '석식',
//                 price: 5500,
//                 ingredients: '닭개장, 쌀밥, 동그랑땡야채볶음, 지마구, 맛김치',
//             },
//         ],
//     },
// };

const formatDateParam = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MenuPage = () => {
    // --- (상태 관리 로직: useState, handleDateChange, handleDateSelect) ---
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoadingMenus, setIsLoadingMenus] = useState(false);
    const [menuError, setMenuError] = useState<string | null>(null);

    const formattedDate = useMemo(
        () => formatDateParam(selectedDate),
        [selectedDate]
    );

    useEffect(() => {
        let ignore = false;

        const loadMenus = async () => {
            setIsLoadingMenus(true);
            setMenuError(null);

            try {
                const data = await fetchMenus({ date: formattedDate });
                if (!ignore) {
                    setMenus(data);
                }
            } catch (error) {
                console.error('메뉴 불러오기 실패:', error);
                if (!ignore) {
                    setMenuError('메뉴 정보를 불러오지 못했습니다.');
                }
            } finally {
                if (!ignore) {
                    setIsLoadingMenus(false);
                }
            }
        };

        loadMenus();

        return () => {
            ignore = true;
        };
    }, [formattedDate]);

    const sections = useMemo(() => {
        const lunchIds = new Set([2, 3, 4, 5]);

        const categorizedIds = new Set<number>();

        const categorySections = [
            { id: 1, check: (menu: Menu) => menu.restaurantId === 1 },
            { id: 2, check: (menu: Menu) => lunchIds.has(menu.restaurantId) },
            { id: 6, check: (menu: Menu) => menu.restaurantId === 6 },
            { id: 7, check: (menu: Menu) => menu.restaurantId === 7 },
        ]
            .map(({ id, check }) => {
                const matchedMenus = menus.filter((menu) => {
                    const match = check(menu);
                    if (match) {
                        categorizedIds.add(menu.restaurantId);
                    }
                    return match;
                });

                if (matchedMenus.length === 0) {
                    return null;
                }

                const meta = RESTAURANT_META[id];

                return {
                    key: `category-${id}`,
                    title: meta?.label ?? `식당 ${id}`,
                    icon: meta?.icon ?? DEFAULT_RESTAURANT_ICON,
                    time: meta?.time,
                    menus: matchedMenus,
                };
            })
            .filter(
                (section): section is NonNullable<typeof section> => section != null
            );

        const remainingMap = new Map<number, Menu[]>();
        menus.forEach((menu) => {
            if (categorizedIds.has(menu.restaurantId)) {
                return;
            }

            const list = remainingMap.get(menu.restaurantId) ?? [];
            list.push(menu);
            remainingMap.set(menu.restaurantId, list);
        });

        const remainingSections = Array.from(remainingMap.entries()).map(
            ([id, groupedMenus]) => {
                const meta = RESTAURANT_META[id];
                const fallbackTitle =
                    groupedMenus[0]?.restaurantName ?? `식당 ${id}`;

                return {
                    key: `restaurant-${id}`,
                    title: meta?.label ?? fallbackTitle,
                    icon: meta?.icon ?? DEFAULT_RESTAURANT_ICON,
                    time: meta?.time,
                    menus: groupedMenus,
                };
            }
        );

        return [...categorySections, ...remainingSections];
    }, [menus]);

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
          pt-16 pb-20 px-6 space-y-8 grow overflow-y-auto
          scrollbar-width-none [&::-webkit-scrollbar]:hidden
        "
                >
                    {isLoadingMenus && (
                        <p className="text-center text-gray-500">
                            메뉴를 불러오는 중입니다...
                        </p>
                    )}

                    {menuError && (
                        <p className="text-center text-red-500">{menuError}</p>
                    )}

                    {!isLoadingMenus && !menuError && sections.length === 0 && (
                        <p className="text-center text-gray-500">
                            선택한 날짜에 등록된 메뉴가 없습니다.
                        </p>
                    )}
                    {sections.map((section) => (
                        <section key={section.key}>
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <img
                                    src={section.icon}
                                    alt={section.title}
                                    className="w-6 h-6"
                                />
                                <h3 className="text-lg font-bold text-gray-900">
                                    {section.title}
                                </h3>
                                {section.time && (
                                    <span className="text-sm text-gray-500">
                                        {section.time}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                {section.menus.map((item) => (
                                    <MenuEntryCard key={item.id} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
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
