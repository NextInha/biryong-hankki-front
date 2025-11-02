// src/components/menu/CalendarModal.tsx

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // 라이브러리 CSS
import { ko } from 'date-fns/locale'; // 달력 한글 지원

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date;
    onDateSelect: (date: Date | undefined) => void;
}

const CalendarModal = ({
    isOpen,
    onClose,
    selectedDate,
    onDateSelect,
}: CalendarModalProps) => {
    if (!isOpen) {
        return null; // 닫혀있으면 렌더링 안 함
    }

    return (
        // 1. 모달 배경 (어두운 반투명)
        <div
            onClick={onClose} // 배경 클릭 시 닫기
            className="
        fixed inset-0 bg-black bg-opacity-50 z-40
        flex justify-center items-center
      "
        >
            {/* 2. 달력 컨테이너 (흰색) */}
            <div
                onClick={(e) => e.stopPropagation()} // 달력 클릭 시엔 닫히지 않게
                className="bg-white rounded-lg p-4 shadow-xl"
            >
                <DayPicker
                    mode="single" // 날짜 하루만 선택
                    selected={selectedDate} // 현재 선택된 날짜
                    onSelect={onDateSelect} // 날짜 선택 시 실행될 함수
                    locale={ko} // 한글
                    weekStartsOn={0} // 0 = 일요일부터 시작
                    styles={{
                        caption_label: {
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                        },
                        head_cell: { fontSize: '0.9rem', color: '#333' },
                        cell: { fontSize: '0.9rem' },
                    }}
                />
            </div>
        </div>
    );
};

export default CalendarModal;
