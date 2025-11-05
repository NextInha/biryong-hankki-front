// src/pages/PurchasePage.tsx
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import MenuItemCard from '../components/menu/MenuItemCard';
import PurchaseSummary from '../components/menu/PurchaseSummary';
import type { Menu } from '../types/menu';
import { useCartStore } from '../store/useCartStore';

// 메뉴 더미 데이터
const DUMMY_MENU_LIST: Menu[] = [
    // --- 중식 ---
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
        ingredients: '해물빠에야볶음밥, 쌀피고구마롤, 단무지, 배추김치',
        price: 5800,
        is_available: true,
        average_rating: 4.2,
        review_count: 55,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    {
        id: 'uuid-m3',
        restaurant_id: 'r1',
        name: 'Noodle',
        ingredients: '김밥볶음밥&떡볶이, 왕김말이튀김, 단무지, 배추김치',
        price: 5500,
        is_available: true,
        average_rating: 4.0,
        review_count: 40,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    {
        id: 'uuid-m4',
        restaurant_id: 'r1',
        name: '테이크아웃',
        ingredients: '두부면샐러드',
        price: 6800,
        is_available: true,
        average_rating: 4.8,
        review_count: 30,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    // 셀프 라면
    {
        id: 'uuid-r1',
        restaurant_id: 'r2',
        name: '신라면',
        ingredients: '',
        price: 2500,
        is_available: true,
        average_rating: 4.9,
        review_count: 150,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    {
        id: 'uuid-r2',
        restaurant_id: 'r2',
        name: '진라면',
        ingredients: '',
        price: 2500,
        is_available: true,
        average_rating: 4.8,
        review_count: 120,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    {
        id: 'uuid-r3',
        restaurant_id: 'r2',
        name: '삼양라면',
        ingredients: '',
        price: 2500,
        is_available: true,
        average_rating: 4.7,
        review_count: 90,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
    {
        id: 'uuid-r4',
        restaurant_id: 'r2',
        name: '안성탕면',
        ingredients: '',
        price: 2500,
        is_available: true,
        average_rating: 4.7,
        review_count: 90,
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z',
    },
];

const PurchasePage = () => {
    // Zustand 스토어에서 '카트 아이템'과 '아이템 추가 함수'를 가져옵니다.
    const { addItem } = useCartStore();

    return (
        <div>
            <TopHeaderSecond title="식권 예매하기" />

            <main
                className="
          pt-8 pb-76 px-8 space-y-4 bg-[#E6EDF3]
          grow overflow-y-auto
          scrollbar-width-none [&::-webkit-scrollbar]:hidden
        "
            >
                <div className="text-2xl font-bold mb-4">메뉴 선택</div>
                <div className="text-lg font-medium mb-2">
                    <span className="font-bold">중식</span> 11:00 ~ 14:00
                </div>

                {DUMMY_MENU_LIST.map((menu) => {
                    if (menu.restaurant_id === 'r1') {
                        return (
                            <MenuItemCard
                                key={menu.id}
                                menu={menu}
                                onClick={() => addItem(menu)}
                            />
                        );
                    }
                })}

                <div className="text-lg font-medium pt-2">
                    <span className="font-bold">셀프라면</span> 11:00 ~ 18:30
                </div>
                {DUMMY_MENU_LIST.map((menu) => {
                    if (menu.restaurant_id === 'r2') {
                        return (
                            <MenuItemCard
                                key={menu.id}
                                menu={menu}
                                onClick={() => addItem(menu)}
                            />
                        );
                    }
                })}
            </main>

            {<PurchaseSummary />}
        </div>
    );
};

export default PurchasePage;
