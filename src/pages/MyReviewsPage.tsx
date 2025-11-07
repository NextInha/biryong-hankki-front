import { useCallback, useEffect, useMemo, useState } from 'react';
import { HiStar } from 'react-icons/hi2';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import MyReviewEditModal from '../components/review/MyReviewEditModal';
import {
    deleteReview,
    fetchMyReviews,
} from '../api/review';
import type {
    Review,
    ReviewDetail,
    ReviewStatistics,
} from '../types/review';

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
};

const fallbackMealLabel = (review: Review): string => {
    if (review.mealType) {
        return review.mealType;
    }

    const lowerRestaurant = review.restaurantName?.toLowerCase() ?? '';
    if (lowerRestaurant.includes('조식')) {
        return '조식';
    }
    if (
        lowerRestaurant.includes('셀프') ||
        lowerRestaurant.includes('라면') ||
        lowerRestaurant.includes('ramen')
    ) {
        return '셀프라면';
    }
    if (lowerRestaurant.includes('석식')) {
        return '석식';
    }
    return '중식';
};

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadReviews = useCallback(
        async (options?: { silent?: boolean }) => {
            const silent = options?.silent ?? false;
            if (!silent) {
                setIsLoading(true);
                setError(null);
            }

            try {
                const data = await fetchMyReviews({ page: 1, limit: 50 });
                setReviews(data.reviews);
                setStatistics(data.statistics);
            } catch (err) {
                console.error('내 리뷰 불러오기 실패:', err);
                if (!silent) {
                    setError('내 리뷰를 불러오지 못했습니다.');
                }
            } finally {
                if (!silent) {
                    setIsLoading(false);
                }
            }
        },
        []
    );

    useEffect(() => {
        void loadReviews();
    }, [loadReviews]);

    const reviewCountText = useMemo(() => {
        const count = statistics?.totalReviews ?? reviews.length;
        return `나의 리뷰 ${count}개`;
    }, [statistics?.totalReviews, reviews.length]);

    const handleOpenEdit = (review: Review) => {
        setEditingReview(review);
        setIsEditModalOpen(true);
    };

    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
    };

    const handleEditUpdated = (detail: ReviewDetail) => {
        setReviews((prev) =>
            prev.map((item) =>
                item.id === detail.id
                    ? {
                          ...item,
                          rating: detail.rating,
                          content: detail.content,
                          updatedAt: detail.updatedAt,
                      }
                    : item
            )
        );

        void loadReviews({ silent: true });
    };

    const handleDelete = async (review: Review) => {
        if (!window.confirm('선택한 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        try {
            setDeletingId(review.id);
            await deleteReview(review.id);
            window.alert('리뷰가 삭제되었습니다.');
            await loadReviews();
        } catch (err) {
            console.error('리뷰 삭제 실패:', err);
            window.alert('리뷰 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <TopHeaderSecond title="나의 리뷰" />

            <div className="flex h-screen flex-col bg-white">
                <main className="grow overflow-y-auto px-6 pb-28">
                    <section className="mt-10">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {reviewCountText}
                        </h2>
                    </section>

                    <section className="mt-8">
                        {isLoading && (
                            <p className="pt-20 text-center text-gray-500">
                                나의 리뷰를 불러오는 중입니다...
                            </p>
                        )}

                        {error && !isLoading && (
                            <p className="pt-20 text-center text-red-500">
                                {error}
                            </p>
                        )}

                        {!isLoading && !error && reviews.length === 0 && (
                            <div className="pt-16 text-center text-sm text-gray-500">
                                아직 작성한 리뷰가 없습니다.
                            </div>
                        )}

                        {!isLoading && !error && reviews.length > 0 && (
                            <ul>
                                {reviews.map((review) => {
                                    const mealLabel = fallbackMealLabel(review);
                                    const displayName =
                                        review.restaurantName ?? review.menuName;
                                    const formattedDate = formatDateTime(
                                        review.updatedAt ?? review.createdAt
                                    );
                                    const ingredients =
                                        review.ingredients ??
                                        review.menuIngredients ??
                                        null;

                                    return (
                                        <li key={review.id} className="py-6 first:pt-4">
                                            <div className="text-xs text-gray-500">
                                                {formattedDate}
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-semibold text-gray-900">
                                                        {`${mealLabel} - ${displayName}`}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: 5 }).map((_, index) => (
                                                            <HiStar
                                                                key={index}
                                                                className={`h-4 w-4 ${
                                                                    index < review.rating
                                                                        ? 'text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="ml-auto flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(review)}
                                                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(review)}
                                                        disabled={deletingId === review.id}
                                                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                                                            deletingId === review.id
                                                                ? 'border-gray-300 text-gray-400'
                                                                : 'border-red-400 text-red-500 hover:bg-red-50'
                                                        }`}
                                                    >
                                                        {deletingId === review.id
                                                            ? '삭제 중...'
                                                            : '삭제'}
                                                    </button>
                                                </div>
                                            </div>

                                            {ingredients && (
                                                <div className="mt-3">
                                                    <span className="inline-flex items-center rounded-md bg-[#E6F2FF] px-3 py-1 text-xs font-semibold text-primary">
                                                        {ingredients}
                                                    </span>
                                                </div>
                                            )}

                                            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                                {review.content}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                </main>
            </div>

            <MyReviewEditModal
                review={editingReview}
                isOpen={isEditModalOpen}
                onClose={handleCloseEdit}
                onUpdated={handleEditUpdated}
            />
        </>
    );
};

export default MyReviewsPage;
