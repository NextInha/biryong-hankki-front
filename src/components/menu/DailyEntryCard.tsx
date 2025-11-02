// src/components/menu/MenuEntryCard.tsx

// 메뉴 1개(한상한담 등)의 타입
// (MenuPage의 DUMMY_MENU_DATA.breakfast.items[0]와 형식이 일치)
interface MenuItem {
    id: string;
    name: string;
    price: number;
    ingredients: string;
}

interface MenuEntryCardProps {
    item: MenuItem;
}

// 이 컴포넌트는 메뉴 아이템 1개만 책임집니다.
const MenuEntryCard = ({ item }: MenuEntryCardProps) => {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className=" text-lg  font-bold text-gray-900">
                    {item.name}
                </span>
                <span className="text-md font-bold text-gray-500">
                    {item.price.toLocaleString()}원
                </span>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 leading-snug">
                    {item.ingredients}
                </p>
            </div>
        </div>
    );
};

export default MenuEntryCard;
