// src/pages/ReviewPage.tsx

import { useEffect, useMemo, useState } from 'react';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import FilterButton from '../components/review/FilterButton';
import ReviewCard from '../components/review/ReviewCard';
import FilterModal from '../components/review/FilterModal';
import { fetchReviews } from '../api/review';
import { fetchRestaurants } from '../api/restaurant';
import type { Review } from '../types/review';
import type { Restaurant } from '../types/restaurant';

const SORT_OPTIONS = ['별점 높은 순', '최신순', '별점 낮은 순'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];
const MEAL_TYPE_OPTIONS = ['전체', '중식', '석식', '조식'] as const;
type MealTypeOption = (typeof MEAL_TYPE_OPTIONS)[number];

const ReviewPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('별점 높은 순');
    const [restaurantFilter, setRestaurantFilter] = useState('전체');
    const [mealTypeFilter, setMealTypeFilter] =
        useState<MealTypeOption>('전체');
    const [openFilter, setOpenFilter] = useState<
        'sort' | 'restaurant' | 'mealType' | null
    >(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;
        const loadReviews = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchReviews({ page: 1, limit: 20 });
                if (!ignore) {
                    setReviews(data.reviews);
                }
            } catch (err) {
                console.error('리뷰 불러오기 실패:', err);
                if (!ignore) {
                    setError('리뷰를 불러오지 못했습니다.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadReviews();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        const loadRestaurants = async () => {
            try {
                const data = await fetchRestaurants();
                if (!ignore) {
                    setRestaurants(data);
                }
            } catch (err) {
                console.error('식당 불러오기 실패:', err);
            }
        };

        loadRestaurants();

        return () => {
            ignore = true;
        };
    }, []);

    const restaurantOptions = useMemo(() => {
        const sorted = restaurants
            .filter((restaurant) => restaurant.isActive !== false)
            .slice()
            .sort((a, b) => {
                const orderA =
                    a.displayOrder ?? Number.MAX_SAFE_INTEGER;
                const orderB =
                    b.displayOrder ?? Number.MAX_SAFE_INTEGER;
                if (orderA !== orderB) {
                    return orderA - orderB;
                }
                return a.name.localeCompare(b.name, 'ko-KR');
            })
            .map((restaurant) => restaurant.name);

        const unique = Array.from(new Set(sorted));

        if (unique.length === 0) {
            const fallback = Array.from(
                new Set(
                    reviews
                        .map((review) => review.restaurantName)
                        .filter(
                            (name): name is string =>
                                typeof name === 'string' &&
                                name.trim().length > 0
                        )
                )
            );

            return ['전체', ...fallback];
        }

        return ['전체', ...unique];
    }, [restaurants, reviews]);

    useEffect(() => {
        if (!restaurantOptions.includes(restaurantFilter)) {
            setRestaurantFilter('전체');
        }
    }, [restaurantOptions, restaurantFilter]);

    const filteredAndSortedReviews = useMemo(() => {
        let filtered = reviews;

        if (restaurantFilter !== '전체') {
            filtered = filtered.filter(
                (review) => review.restaurantName === restaurantFilter
            );
        }

        if (mealTypeFilter !== '전체') {
            filtered = filtered.filter(
                (review) => review.mealType === mealTypeFilter
            );
        }

        const sorted = [...filtered];

        switch (sortBy) {
            case '최신순':
                sorted.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                break;
            case '별점 낮은 순':
                sorted.sort((a, b) => a.rating - b.rating);
                break;
            case '별점 높은 순':
            default:
                sorted.sort((a, b) => {
                    const ratingDiff = b.rating - a.rating;
                    if (ratingDiff !== 0) {
                        return ratingDiff;
                    }

                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                });
                break;
        }

        return sorted;
    }, [reviews, sortBy, restaurantFilter, mealTypeFilter]);

    return (
        <>
            <TopHeaderSecond title="리뷰" />

            <div className="flex flex-col h-screen bg-white">
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
                    {isLoading && (
                        <p className="text-center text-gray-500 pt-10">
                            리뷰를 불러오는 중입니다...
                        </p>
                    )}

                    {error && !isLoading && (
                        <p className="text-center text-red-500 pt-10">
                            {error}
                        </p>
                    )}

                    {!isLoading &&
                        !error &&
                        (filteredAndSortedReviews.length > 0 ? (
                        filteredAndSortedReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 pt-10">
                            해당하는 리뷰가 없습니다.
                        </p>
                    ))}
                </main>
            </div>

            {/* 9. 3개의 필터 모달 */}
            <FilterModal
                isOpen={openFilter === 'sort'}
                onClose={() => setOpenFilter(null)}
                options={[...SORT_OPTIONS]}
                selectedOption={sortBy}
                onSelect={(option) => {
                    setSortBy(option as SortOption);
                    setOpenFilter(null);
                }}
            />
            <FilterModal
                isOpen={openFilter === 'restaurant'}
                onClose={() => setOpenFilter(null)}
                options={restaurantOptions}
                selectedOption={restaurantFilter}
                onSelect={(option) => {
                    setRestaurantFilter(option);
                    setOpenFilter(null);
                }}
            />
            <FilterModal
                isOpen={openFilter === 'mealType'}
                onClose={() => setOpenFilter(null)}
                options={[...MEAL_TYPE_OPTIONS]}
                selectedOption={mealTypeFilter}
                onSelect={(option) => {
                    setMealTypeFilter(option as MealTypeOption);
                    setOpenFilter(null);
                }}
            />
        </>
    );
};

export default ReviewPage;
