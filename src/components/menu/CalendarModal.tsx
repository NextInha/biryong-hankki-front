// src/components/menu/CalendarModal.tsx

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ko } from 'date-fns/locale';

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
        return null;
    }

    return (
        <div
            onClick={onClose}
            className="
        fixed inset-0 z-40
        flex justify-center items-end
      "
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
          bg-white rounded-t-4xl shadow-xl
          w-full h-[47%]
          animate-slideUp
        "
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />
                <div>
                    <div className="flex justify-center pb-4">
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
            </div>
        </div>
    );
};

export default CalendarModal;
