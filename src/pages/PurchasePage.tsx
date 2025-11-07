// src/pages/PurchasePage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import MenuItemCard from '../components/menu/MenuItemCard';
import PurchaseSummary from '../components/menu/PurchaseSummary';
import { fetchMenus } from '../api/menu';
import type { Menu } from '../types/menu';
import { useCartStore } from '../store/useCartStore';

interface PurchaseLocationState {
    restaurantId?: number;
    restaurantName?: string;
    mealTypeLabel?: string;
    scheduleText?: string;
}

const PurchasePage = () => {
    const location = useLocation();
    const locationState = (location.state ?? {}) as PurchaseLocationState;
    const {
        restaurantName: stateRestaurantName,
        mealTypeLabel,
        scheduleText,
    } = locationState;
    const [searchParams] = useSearchParams();

    const queryRestaurantIdRaw = searchParams.get('restaurantId');
    const parsedQueryRestaurantId = queryRestaurantIdRaw
        ? Number.parseInt(queryRestaurantIdRaw, 10)
        : undefined;
    const normalizedQueryRestaurantId = Number.isNaN(parsedQueryRestaurantId)
        ? undefined
        : parsedQueryRestaurantId;

    const restaurantId =
        locationState.restaurantId ?? normalizedQueryRestaurantId;

    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { addItem } = useCartStore();

    useEffect(() => {
        let ignore = false;

        const loadMenus = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchMenus(
                    restaurantId != null ? { restaurantId } : undefined
                );
                if (!ignore) {
                    setMenus(data);
                }
            } catch (err) {
                console.error('메뉴 불러오기 실패:', err);
                if (!ignore) {
                    setError('메뉴를 불러오지 못했습니다.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadMenus();

        return () => {
            ignore = true;
        };
    }, [restaurantId]);

    const sections = useMemo(() => {
        const availableMenus = menus.filter(
            (menu) => menu.restaurantId !== 1 && menu.isAvailable !== false
        );

        const categorizedIds = new Set<number>();

        const categoryConfigs = [
            {
                key: 'category-lunch',
                title: '중식',
                time: '11:00 ~ 14:00',
                match: (id: number) => [2, 3, 4, 5].includes(id),
            },
            {
                key: 'category-noodle',
                title: '셀프라면',
                time: '11:00 ~ 18:30',
                match: (id: number) => id === 6,
            },
            {
                key: 'category-dinner',
                title: '석식',
                time: '17:00 ~ 18:30',
                match: (id: number) => id === 7,
            },
        ] as const;

        const categorySections = categoryConfigs
            .map(({ key, title, time, match }) => {
                const matchedMenus = availableMenus.filter((menu) => {
                    const matched = match(menu.restaurantId);
                    if (matched) {
                        categorizedIds.add(menu.restaurantId);
                    }
                    return matched;
                });

                if (matchedMenus.length === 0) {
                    return null;
                }

                const hasSelectedRestaurant =
                    restaurantId != null &&
                    matchedMenus.some((menu) => menu.restaurantId === restaurantId);

                return {
                    key,
                    title,
                    time,
                    subtitle: hasSelectedRestaurant
                        ? `${scheduleText ?? ''} ${mealTypeLabel ?? ''}`.trim() ||
                          undefined
                        : undefined,
                    menus: matchedMenus,
                };
            })
            .filter(
                (section): section is NonNullable<typeof section> => section != null
            );

        const remainingMap = new Map<number, Menu[]>();
        availableMenus.forEach((menu) => {
            if (categorizedIds.has(menu.restaurantId)) {
                return;
            }

            const list = remainingMap.get(menu.restaurantId) ?? [];
            list.push(menu);
            remainingMap.set(menu.restaurantId, list);
        });

        const remainingSections = Array.from(remainingMap.entries()).map(
            ([id, groupedMenus]) => {
                const displayName =
                    restaurantId != null &&
                    id === restaurantId &&
                    stateRestaurantName
                        ? stateRestaurantName
                        : groupedMenus[0]?.restaurantName ?? `식당 ${id}`;

                const subtitle =
                    restaurantId != null && id === restaurantId
                        ? `${scheduleText ?? ''} ${mealTypeLabel ?? ''}`.trim()
                        : undefined;

                return {
                    key: `restaurant-${id}`,
                    title: displayName,
                    subtitle: subtitle || undefined,
                    time: undefined,
                    menus: groupedMenus,
                };
            }
        );

        return [...categorySections, ...remainingSections];
    }, [
        menus,
        restaurantId,
        stateRestaurantName,
        scheduleText,
        mealTypeLabel,
    ]);

    const hasMenus = sections.some((section) => section.menus.length > 0);

    return (
        <div>
            <TopHeaderSecond title="식권 예매하기" />

            <main
                className="
          pt-8 pb-76 px-8 space-y-4 bg-[#E6EDF3]
          grow overflow-y-auto
          scrollbar-width-none [&::-webkit-scrollbar]:hidden
        "
            >
                <div className="text-2xl font-bold mb-4">메뉴 선택</div>

                {isLoading && (
                    <p className="text-center text-gray-500 pt-8">
                        메뉴를 불러오는 중입니다...
                    </p>
                )}

                {error && !isLoading && (
                    <p className="text-center text-red-500 pt-8">{error}</p>
                )}

                {!isLoading && !error && !hasMenus && (
                    <p className="text-center text-gray-500 pt-8">
                        주문 가능한 메뉴가 없습니다.
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    sections.map((section) => (
                        <section key={section.key}>
                            <div className="text-lg font-medium mb-2">
                                <span className="font-bold">
                                    {section.title}
                                </span>
                                {section.time && (
                                    <span className="ml-2 text-base font-semibold text-gray-500 whitespace-nowrap">
                                        {section.time}
                                    </span>
                                )}
                                {section.subtitle && (
                                    <span className="ml-2 text-sm text-gray-600">
                                        {section.subtitle}
                                    </span>
                                )}
                            </div>
                            {section.menus.map((menu) => (
                                <MenuItemCard
                                    key={menu.id}
                                    menu={menu}
                                    onClick={() => addItem(menu)}
                                />
                            ))}
                        </section>
                    ))}
            </main>

            <PurchaseSummary />
        </div>
    );
};

export default PurchasePage;
