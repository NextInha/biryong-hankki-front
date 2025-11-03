// src/components/review/FilterModal.tsx

import clsx from 'clsx'; // (설치 필요: npm install clsx)

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    options: string[];
    selectedOption: string;
    onSelect: (option: string) => void;
}

const FilterModal = ({
    isOpen,
    onClose,
    options,
    selectedOption,
    onSelect,
}: FilterModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        // 1. 모달 배경 (클릭 시 닫기)
        <div onClick={onClose} className="fixed inset-0 bg-transparent z-40">
            {/* 2. 드롭다운 컨테이너 (위치는 px-4, top-44 등으로 조절 필요) */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="
          absolute top-32 right-4 
          bg-white rounded-lg shadow-lg border border-gray-100
          w-36 py-2 z-50
        "
            >
                {/* (시안처럼 오른쪽에 붙도록 right-4, top-44로 임시 설정) */}
                <ul className="flex flex-col">
                    {options.map((option) => (
                        <li key={option}>
                            <button
                                onClick={() => onSelect(option)}
                                className={clsx(
                                    'w-full text-left px-4 py-2 text-sm',
                                    {
                                        // 선택된 항목은 파란색/굵게
                                        'text-primary font-bold':
                                            option === selectedOption,
                                        // 선택 안 된 항목
                                        'text-gray-700 hover:bg-gray-50':
                                            option !== selectedOption,
                                    }
                                )}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FilterModal;
