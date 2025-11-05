// src/pages/ReviewPage.tsx

import { useState, useMemo } from 'react'; // 1. [추가] useMemo 훅
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import FilterButton from '../components/review/FilterButton';
import ReviewCard from '../components/review/ReviewCard';
import FilterModal from '../components/review/FilterModal';
import type { Review } from '../types/review';

// --- (임시) 리뷰 더미 데이터 ---
const DUMMY_REVIEWS: Review[] = [
    {
        id: 'r1',
        orderId: 'o1',
        menuId: 'm1',
        menuName: '한상한담',
        userId: 'u1',
        userName: '익명',
        rating: 5,
        content:
            '제육 김치에 두부 조합 ㄹㅈㄷ JMT,,, 특히 김치가 짜지 않고 간 좋았음 ㅇㅇㅇ',
        images: [],
        createdAt: '2025-10-17T10:30:00Z',
        updatedAt: '2025-10-17T10:30:00Z',
        restaurantName: '한상한담',
        mealType: '중식',
    },
    {
        id: 'r2',
        orderId: 'o2',
        menuId: 'm2',
        menuName: '원플레이트',
        userId: 'u2',
        userName: '밥잘먹는인덕이',
        rating: 4,
        content: '해물 빠에야 볶음밥 맛있어요. 안에 새우 나름 많이 들어 있어요',
        images: [],
        createdAt: '2025-10-17T09:15:00Z',
        updatedAt: '2025-10-17T09:15:00Z',
        restaurantName: '원플레이트',
        mealType: '중식',
    },
    {
        id: 'r3',
        orderId: 'o3',
        menuId: 'm3',
        menuName: '천원의 조식',
        userId: 'u3',
        userName: '교수님제발요',
        rating: 3,
        content:
            '이 가격에 이 퀄리티라는게 믿기지 않음; 세상 물가가 천 원의 조식 급이었으면 조켄네.',
        images: [],
        createdAt: '2025-10-17T14:20:00Z',
        updatedAt: '2025-10-17T14:20:00Z',
        restaurantName: '천원의 조식',
        mealType: '조식',
    },
    {
        id: 'r4',
        orderId: 'o4',
        menuId: 'm2', // 원플레이트
        menuName: '원플레이트',
        userId: 'u4',
        userName: '익명아님',
        rating: 5,
        content:
            '해물 빠에야 볶음밥 맛있ㅇ어요. 옆에 동기가 먹는 김말이 뺏어먹으니까 더 맛있음 개추',
        images: [],
        createdAt: '2025-10-17T11:00:00Z',
        updatedAt: '2025-10-17T11:00:00Z',
        restaurantName: '원플레이트',
        mealType: '중식',
    },
];

//  필터/정렬 옵션 정의
const SORT_OPTIONS = ['추천순', '최신순', '별점 높은 순', '별점 낮은 순'];
const RESTAURANT_OPTIONS = [
    '전체',
    '천원의 조식',
    '한상한담',
    '원플레이트',
    'Noodle',
    '테이크아웃',
];
const MEAL_TYPE_OPTIONS = ['전체', '조식', '중식', '석식'];

const ReviewPage = () => {
    // 3. 3개의 명확한 상태
    const [sortBy, setSortBy] = useState('추천순');
    const [restaurantFilter, setRestaurantFilter] = useState('전체'); // 전체 식당
    const [mealTypeFilter, setMealTypeFilter] = useState('전체'); // 전체 시간대

    // 4. 모달 열림 상태 (이전과 동일)
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    // 5. 필터링과 정렬을 useMemo로 구현
    const filteredAndSortedReviews = useMemo(() => {
        let filtered = DUMMY_REVIEWS;
        // 1. 식당 필터
        if (restaurantFilter !== '전체') {
            filtered = filtered.filter(
                (review) => review.restaurantName === restaurantFilter
            );
        }
        // 2. 시간대 필터)
        if (mealTypeFilter !== '전체') {
            filtered = filtered.filter(
                (review) => review.mealType === mealTypeFilter
            );
        }
        // 정렬
        switch (sortBy) {
            case '최신순':
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                break;
            case '별점 높은 순':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case '별점 낮은 순':
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            case '추천순':
            default:
                // (추천순 로직은 API가 정해주는 것이므로, 일단 기본값(최신순)으로 둡니다)
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                break;
        }

        return filtered;
    }, [sortBy, restaurantFilter, mealTypeFilter]); // 3개 상태 중 하나라도 바뀌면 재계산

    return (
        <>
            <TopHeaderSecond title="리뷰" />

            <div className="flex flex-col h-screen bg-white">
                {/* 6. [변경] 필터 버튼 UI (3개로 명확히 나눔) */}
                <div
                    className="
          sticky top-20 w-full max-w-md mx-auto
          flex justify-end items-center gap-2 shadow-xs
          px-6 h-12 bg-white z-10 border-b border-gray-100
          
        "
                >
                    <FilterButton
                        label={sortBy}
                        onClick={() => setOpenFilter('sort')}
                    />
                    <FilterButton
                        label={restaurantFilter}
                        onClick={() => setOpenFilter('restaurant')}
                    />
                    <FilterButton
                        label={mealTypeFilter}
                        onClick={() => setOpenFilter('mealType')}
                    />
                </div>

                {/* 7. 메인 콘텐츠 (리뷰 목록) */}
                <main
                    className="
          pt-6 pb-20 px-4 space-y-6 grow overflow-y-auto
          scrollbar-width-none [&::-webkit-scrollbar]:hidden
        "
                >
                    {/* 8. 최종 필터링/정렬된 목록을 렌더링 */}
                    {filteredAndSortedReviews.length > 0 ? (
                        filteredAndSortedReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 pt-10">
                            해당하는 리뷰가 없습니다.
                        </p>
                    )}
                </main>
            </div>

            {/* 9. 3개의 필터 모달 */}
            <FilterModal
                isOpen={openFilter === 'sort'}
                onClose={() => setOpenFilter(null)}
                options={SORT_OPTIONS}
                selectedOption={sortBy}
                onSelect={(option) => {
                    setSortBy(option);
                    setOpenFilter(null);
                }}
            />
            <FilterModal
                isOpen={openFilter === 'restaurant'}
                onClose={() => setOpenFilter(null)}
                options={RESTAURANT_OPTIONS}
                selectedOption={restaurantFilter}
                onSelect={(option) => {
                    setRestaurantFilter(option);
                    setOpenFilter(null);
                }}
            />
            <FilterModal
                isOpen={openFilter === 'mealType'}
                onClose={() => setOpenFilter(null)}
                options={MEAL_TYPE_OPTIONS}
                selectedOption={mealTypeFilter}
                onSelect={(option) => {
                    setMealTypeFilter(option);
                    setOpenFilter(null);
                }}
            />
        </>
    );
};

export default ReviewPage;
