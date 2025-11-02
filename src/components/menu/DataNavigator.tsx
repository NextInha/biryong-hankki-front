// src/components/menu/DateNavigator.tsx

// (아이콘 설치 필요: npm install react-icons)
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface DateNavigatorProps {
    currentDate: Date;
    onPrevClick: () => void;
    onNextClick: () => void;
    onCalendarClick: () => void;
}

const DateNavigator = ({
    currentDate,
    onPrevClick,
    onNextClick,
    onCalendarClick,
}: DateNavigatorProps) => {
    // 1. 날짜를 "10.13(월)" 형식으로 포맷팅
    // (Intl.DateTimeFormat은 브라우저마다 . 위치가 다를 수 있음)
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const weekday = currentDate.toLocaleDateString('ko-KR', {
        weekday: 'short',
    });
    const formattedDate = `${month}.${day}(${weekday})`;

    return (
        <div
            className="
        fixed top-20 right-0 w-full max-w-md mx-auto
        flex justify-between items-center
        h-12 px-6 bg-[#E6EDF3] z-10
        shadow-xs
        border-b border-gray-200
        left-1/2 -translate-x-1/2 
      "
        >
            {/* 1. 이전 날짜 버튼 */}
            <button onClick={onPrevClick} className="p-2 text-gray-600">
                <HiChevronLeft className="w-6 h-6" />
            </button>

            {/* 2. 날짜 (클릭 시 달력 팝업) */}
            <button
                onClick={onCalendarClick}
                className="text-xl font-bold text-gray-900"
            >
                {formattedDate}
            </button>

            {/* 3. 다음 날짜 버튼 */}
            <button onClick={onNextClick} className="p-2 text-gray-600">
                <HiChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
};

export default DateNavigator;
