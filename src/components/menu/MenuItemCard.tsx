// src/components/menu/MenuItemCard.tsx

import type { Menu } from '../../types/menu';

interface MenuItemCardProps {
    menu: Menu;
    onClick: () => void;
}

const MenuItemCard = ({ menu, onClick }: MenuItemCardProps) => {
    const { name, ingredients, price } = menu;

    // ingredients가 빈 문자열("")일 경우를 대비 (라면)
    const ingredientList = ingredients
        ? ingredients.split(',').map((item) => item.trim())
        : [];

    return (
        <div
            onClick={onClick}
            className="
        p-3 min-h-24 rounded-lg shadow-md cursor-pointer
        flex items-center justify-between gap-2
        bg-white border border-transparent
        
        transition-all duration-150 ease-in-out 
        active:scale-[0.98] active:opacity-80
      "
        >
            {/* 메뉴 이름, 가격 */}
            <div className=" w-[30%]">
                <h3 className="text-lg font-bold ">{name}</h3>
            </div>

            <div className="text-center">
                {ingredientList.map((item) => (
                    <p key={item} className="text-xs leading-tight">
                        {item}
                    </p>
                ))}
            </div>

            <div className=" w-[30%] text-right">
                <p className="text-xl font-bold text-[#0066B3]">
                    {price.toLocaleString()}원
                </p>
            </div>
        </div>
    );
};

export default MenuItemCard;
