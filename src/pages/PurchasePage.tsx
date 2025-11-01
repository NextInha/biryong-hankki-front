import TopHeaderSecond from '../components/layout/TopHeaderSecond';
// src/pages/PurchasePage.tsx

import { useState } from 'react';
import MenuItemCard from '../components/menu/MenuItemCard';
import PurchaseSummary from '../components/menu/PurchaseSummary';
import { Menu } from '../types/menu'; // 1. 방금 만든 Menu 타입을 import!

// 2. 새 타입에 맞춘 임시 데이터 (UUID는 간단히 문자열로)
const DUMMY_MENU_LIST: Menu[] = [
    {
        id: 'uuid-m1',
        restaurant_id: 'r1',
        name: '한상한담',
        ingredients: '제육김치볶음*두부, 쌀밥, 건파래볶음, 단무지, 배추김치',
        price: 5800,
        is_available: true,
        average_rating: 4.5,
        review_count: 82,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    {
        id: 'uuid-m2',
        restaurant_id: 'r1',
        name: '원플레이트',
        ingredients: '해물빠에야볶음밥, 쌀밥, 쁘띠고구마롤, 단무지, 배추김치',
        price: 5800,
        is_available: true,
        average_rating: 4.2,
        review_count: 55,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    // ... (Noodle 등)
];

const PurchasePage = () => {
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

    const handleMenuSelect = (menuId: string) => {
        setSelectedMenuId((prevId) => (prevId === menuId ? null : menuId));
    };

    // 3. selectedMenu의 타입이 'Menu | undefined'가 됩니다.
    const selectedMenu = DUMMY_MENU_LIST.find(
        (menu) => menu.id === selectedMenuId
    );

    return (
        <>
            <TopHeaderSecond title="식권 예매하기" />

            <main className="pt-16 pb-32 px-4 space-y-4 bg-gray-100 min-h-screen">
                {/* ... (메뉴 선택 타이틀) ... */}

                {DUMMY_MENU_LIST.map((menu) => (
                    <MenuItemCard
                        key={menu.id}
                        // 4. props로 menu 객체 통째로 넘겨주기 (더 깔끔!)
                        menu={menu}
                        isSelected={selectedMenuId === menu.id}
                        onClick={() => handleMenuSelect(menu.id)}
                    />
                ))}
            </main>

            {selectedMenu && <PurchaseSummary menu={selectedMenu} />}
        </>
    );
};

export default PurchasePage;
