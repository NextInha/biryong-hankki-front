// src/components/menu/MenuEntryCard.tsx

import type { Menu } from '../../types/menu';

interface MenuEntryCardProps {
    item: Menu;
}

// 이 컴포넌트는 메뉴 아이템 1개만 책임집니다.
const MenuEntryCard = ({ item }: MenuEntryCardProps) => {
    const displayName = item.restaurantName || item.name;

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className=" text-lg  font-bold text-gray-900">
                    {displayName}
                </span>
                <span className="text-md font-bold text-gray-500">
                    {item.price.toLocaleString()}원
                </span>

                {!item.isAvailable && (
                    <span className="ml-2 text-xs font-semibold text-red-500">
                        품절
                    </span>
                )}
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 leading-snug">
                    {item.ingredients || '구성 정보가 준비 중입니다.'}
                </p>
            </div>
        </div>
    );
};

export default MenuEntryCard;
