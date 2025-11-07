import { useEffect, useMemo, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { AxiosError } from 'axios';
import { updateReview, type UpdateReviewPayload } from '../../api/review';
import type { Review, ReviewDetail } from '../../types/review';

interface MyReviewEditModalProps {
    review: Review | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: (updated: ReviewDetail) => void;
}

const MIN_RATING = 1;

const MyReviewEditModal = ({
    review,
    isOpen,
    onClose,
    onUpdated,
}: MyReviewEditModalProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && review) {
            setRating(review.rating);
            setContent(review.content);
        }
    }, [isOpen, review]);

    useEffect(() => {
        if (!isOpen) {
            const timer = window.setTimeout(() => {
                setRating(0);
                setHoverRating(0);
                setContent('');
            }, 300);

            return () => window.clearTimeout(timer);
        }

        return undefined;
    }, [isOpen]);

    const titleText = useMemo(() => {
        if (!review) {
            return '리뷰 수정';
        }

        return `${review.restaurantName ?? review.menuName} 리뷰 수정`;
    }, [review]);

    const handleSubmit = async () => {
        if (!review) {
            return;
        }

        if (rating < MIN_RATING) {
            window.alert('별점을 선택해주세요.');
            return;
        }

        if (content.trim().length === 0) {
            window.alert('리뷰 내용을 입력해주세요.');
            return;
        }

        const payload: UpdateReviewPayload = {
            rating,
            content: content.trim(),
        };

        try {
            setIsSubmitting(true);
            const updated = await updateReview(review.id, payload);
            onUpdated(updated);
            window.alert('리뷰가 수정되었습니다.');
            onClose();
        } catch (error) {
            console.error('리뷰 수정 실패:', error);
            const axiosError = error as AxiosError<{
                error?: { message?: string };
            }>;
            const apiMessage = axiosError.response?.data?.error?.message;
            window.alert(
                apiMessage ?? '리뷰 수정에 실패했습니다. 다시 시도해주세요.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div
                className={`
          fixed inset-0 bg-black/50 z-40
          transition-opacity duration-300 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
                onClick={isSubmitting ? undefined : onClose}
            />

            <div
                className={`
          fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-md bg-white rounded-t-3xl shadow-lg
          z-50 px-6 pt-6 pb-8
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
            >
                <div className="relative flex items-center justify-center">
                    <h3 className="text-lg font-bold text-gray-900">
                        {titleText}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="
              absolute right-0 top-1/2 -translate-y-1/2
              text-2xl text-gray-500 hover:text-gray-700
            "
                    >
                        <IoClose />
                    </button>
                </div>

                <div className="mt-5 flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isActive =
                            (hoverRating || rating) >= star;
                        return (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <FaStar
                                    size={34}
                                    className={`
                    transition-colors
                    ${isActive ? 'text-yellow-400' : 'text-gray-300'}
                  `}
                                />
                            </button>
                        );
                    })}
                </div>

                <div className="mt-5">
                    <label htmlFor="my-review-edit-content" className="sr-only">
                        리뷰 내용
                    </label>
                    <textarea
                        id="my-review-edit-content"
                        name="my-review-edit-content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows={5}
                        maxLength={1000}
                        placeholder="리뷰 내용을 입력해주세요."
                        className="
              w-full rounded-2xl border border-gray-200 bg-gray-50 p-4
              text-sm text-gray-800 leading-relaxed
              focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20
            "
                    />
                    <p className="mt-2 text-right text-xs text-gray-400">
                        {content.length} / 1000
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating < MIN_RATING || !content.trim()}
                    className={`
          mt-6 w-full rounded-full bg-primary py-3 text-base font-semibold text-white
          transition-colors
          ${
              isSubmitting || rating < MIN_RATING || !content.trim()
                  ? 'bg-gray-300'
                  : 'hover:bg-[#005199]'
          }
        `}
                >
                    {isSubmitting ? '수정 중...' : '수정 완료'}
                </button>
            </div>
        </>
    );
};

export default MyReviewEditModal;
