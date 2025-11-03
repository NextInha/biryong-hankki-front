// src/components/review/ReviewCard.tsx

import type { Review } from '../../types/review';
import { HiStar } from 'react-icons/hi2';

// (가정) 프로필 아이콘 이미지 2종 import
import profileIcon from '../../assets/icons/icon-induck.svg';

interface ReviewCardProps {
    review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    // 날짜 포맷팅
    const formattedDate = new Date(review.createdAt).toLocaleDateString(
        'ko-KR',
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }
    );

    return (
        <article className="flex gap-3 pt-4 border-t border-gray-100 first:border-t-0 first:pt-0">
            {/* 1. 프로필 아이콘 */}
            <img
                src={profileIcon}
                alt="프로필"
                className="w-10 h-10 rounded-full bg-gray-100"
            />

            {/* 2. 리뷰 내용 */}
            <div className="flex-1">
                {/* 닉네임, 별점, 날짜 */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{review.userName}</span>
                    {/* 별점 */}
                    <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <HiStar
                                key={i}
                                className={`w-4 h-4 ${
                                    i < review.rating
                                        ? 'text-yellow-500'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-auto">
                        {formattedDate}
                    </span>
                </div>

                {/* 태그 (메뉴명, 식사 타입) */}
                <div className="flex gap-2 mb-2">
                    <span
                        className="
            text-xs font-semibold text-white 
            bg-primary rounded-full px-2 py-0.5
          "
                    >
                        {review.mealType}
                    </span>
                    <span
                        className="
            text-xs font-semibold text-primary 
            bg-blue-100 rounded-full px-2 py-0.5
          "
                    >
                        {review.restaurantName}
                    </span>
                </div>

                {/* 리뷰 본문 */}
                <p className="text-sm text-gray-800 leading-snug">
                    {review.content}
                </p>
            </div>
        </article>
    );
};

export default ReviewCard;
