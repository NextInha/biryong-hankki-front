// src/components/home/MealStatus.tsx

// (가정) '수저' 아이콘 이미지가 있다고 가정
import iconMeal from '../../assets/icons/icon-menu-blue.svg';

const MealStatus = () => {
    return (
        <div className="flex flex-col items-center gap-2">
            <img src={iconMeal} alt="식사 아이콘" className="w-32 h-32" />
            <span className="font-semibold text-gray-700">중식 운영중</span>
        </div>
    );
};

export default MealStatus;
