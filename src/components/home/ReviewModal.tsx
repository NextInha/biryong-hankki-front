// src/components/review/ReviewModal.tsx

import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa'; // 별 아이콘
import { IoClose } from 'react-icons/io5'; // 닫기 아이콘

// Props 타입 정의
interface ReviewModalProps {
    isOpen: boolean; // 모달이 열려있는지 여부
    onClose: () => void; // 모달을 닫는 함수
    orderId: string; // 리뷰 대상 주문 ID
    menuId: string; // 리뷰 대상 메뉴 ID
    menuName: string; // 리뷰 대상 메뉴 이름
}

const ReviewModal = ({
    isOpen,
    onClose,
    orderId,
    menuId,
    menuName,
}: ReviewModalProps) => {
    const [rating, setRating] = useState(0); // 현재 선택된 별점
    const [hoverRating, setHoverRating] = useState(0); // 마우스 호버 별점
    const [content, setContent] = useState(''); // 리뷰 내용

    // 모달이 닫힐 때 상태 초기화
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                // 닫기 애니메이션(300ms) 후 초기화
                setRating(0);
                setHoverRating(0);
                setContent('');
            }, 300);
        }
    }, [isOpen]);

    // (UI용) 리뷰 제출 핸들러
    const handleSubmit = () => {
        // API 명세서 기준 유효성 검사
        if (rating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }
        if (content.trim().length < 10) {
            alert('리뷰를 10자 이상 입력해주세요.');
            return;
        }

        // (UI용) API 연동 대신 콘솔에 로그 출력
        console.log('--- 리뷰 제출 (UI) ---', {
            orderId,
            menuId,
            rating,
            content,
        });
        alert('리뷰가 등록되었습니다! (UI 테스트)');
        onClose(); // 모달 닫기
    };

    return (
        <>
            {/* 1. 뒷 배경 (Backdrop) */}
            <div
                className={`
          fixed inset-0 bg-black/50 z-40
          transition-opacity duration-300 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
                onClick={onClose} // 배경 클릭 시 닫기
            />

            {/* 2. 모달 패널 (Bottom Sheet) */}
            <div
                className={`
          fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-md bg-white rounded-t-2xl shadow-lg
          z-50 p-6 pt-5
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
            >
                {/* 헤더: 닫기 버튼 + 타이틀 */}
                <div className="relative flex justify-center items-center mb-4">
                    <h3 className="text-lg font-bold text-center">
                        {menuName} 어떠셨나요?
                    </h3>
                    <button
                        onClick={onClose}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-gray-500"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* 별점 */}
                <div className="flex justify-center items-center space-x-2 my-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <FaStar
                                size={40}
                                className={`transition-colors
                  ${
                      (hoverRating || rating) >= star
                          ? 'text-yellow-400' // 활성
                          : 'text-gray-300' // 비활성
                  }
                `}
                            />
                        </button>
                    ))}
                </div>

                {/* 리뷰 텍스트 입력 */}
                <div className="relative w-full">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        maxLength={500} // (API 명세서)
                        placeholder="리뷰 내용을 10자 이상 500자 이하로 입력해주세요."
                        className="
              w-full p-3 border border-gray-300 rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-primary
            "
                    />
                    <p className="absolute bottom-3 right-3 text-sm text-gray-400">
                        {content.length} / 500
                    </p>
                </div>

                {/* 완료 버튼 (primary 색상 사용) */}
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || content.trim().length < 10}
                    className="
            w-full mt-4 p-4 rounded-lg
            bg-primary text-white font-bold
            hover:bg-blue-700
            disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors
          "
                >
                    완료
                </button>
            </div>
        </>
    );
};

export default ReviewModal;
