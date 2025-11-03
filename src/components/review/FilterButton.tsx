// src/components/review/FilterButton.tsx

import { HiChevronDown } from 'react-icons/hi2';

interface FilterButtonProps {
    label: string;
    onClick: () => void;
}

const FilterButton = ({ label, onClick }: FilterButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="
        flex items-center justify-center gap-1
        bg-gray-100 rounded-full px-3 py-1
        text-sm font-semibold text-gray-700
      "
        >
            <span>{label}</span>
            <HiChevronDown className="w-4 h-4" />
        </button>
    );
};

export default FilterButton;
