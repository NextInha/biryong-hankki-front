import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';
import { IoClose } from 'react-icons/io5';
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
    return (
        <>
            {/* 모달 패널 (Bottom Sheet) */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
          fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-md bg-white rounded-t-2xl shadow-xl
          h-[47%] /* (기존 높이 유지) */
          z-50

         
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
            >
                <div className="relative w-full h-12 flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* DayPicker (달력) */}
                <div className="flex justify-center">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={onDateSelect}
                        locale={ko}
                        weekStartsOn={0}
                        styles={{
                            caption_label: {
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                            },
                            head_cell: {
                                fontSize: '0.9rem',
                                color: '#333',
                            },
                            cell: { fontSize: '0.9rem' },
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default CalendarModal;
