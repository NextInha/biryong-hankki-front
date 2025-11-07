import { useEffect, useMemo, useState } from 'react';
import TopHeaderSecond from '../components/layout/TopHeaderSecond';
import { fetchMyOrders } from '../api/orders';
import type { OrderHistoryOrder } from '../types/order';

const formatOrderDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
};

const resolveMealLabel = (
    label?: string | null,
    restaurantName?: string | null
): string => {
    const trimmed = label?.trim();
    if (trimmed) {
        return trimmed;
    }

    const name = (restaurantName ?? '').trim();
    if (!name) {
        return '중식';
    }

    const lowerName = name.toLowerCase();
    if (lowerName.includes('조식')) {
        return '조식';
    }
    if (
        lowerName.includes('셀프') ||
        lowerName.includes('라면') ||
        lowerName.includes('ramen')
    ) {
        return '셀프라면';
    }
    if (lowerName.includes('석식')) {
        return '석식';
    }
    return '중식';
};

interface DisplayOrder {
    id: string;
    date: string;
    title: string;
    ingredients: string;
}

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<OrderHistoryOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;

        const loadOrders = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchMyOrders();
                if (!ignore) {
                    setOrders(data.orders);
                }
            } catch (err) {
                console.error('주문 내역 불러오기 실패:', err);
                if (!ignore) {
                    setError('주문 내역을 불러오지 못했습니다.');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadOrders();

        return () => {
            ignore = true;
        };
    }, []);

    const displayOrders = useMemo<DisplayOrder[]>(() => {
        return orders.flatMap((order) => {
            const date = formatOrderDate(order.orderedAt);
            return order.items.flatMap((item) => {
                const restaurantRaw = item.restaurantName ?? '';
                const restaurant = restaurantRaw.trim() || '식당';
                const mealLabel = resolveMealLabel(
                    item.mealLabel,
                    item.restaurantName
                );
                const quantity = Math.max(item.quantity, 1);

                return Array.from({ length: quantity }, (_, index) => ({
                    id: `${order.id}-${item.id}-${index}`,
                    date,
                    title: `${mealLabel} - ${restaurant}`,
                    ingredients: item.ingredients ?? '',
                }));
            });
        });
    }, [orders]);

    const orderCountText = useMemo(
        () => `나의 주문 ${displayOrders.length}개`,
        [displayOrders.length]
    );

    return (
        <>
            <TopHeaderSecond title="나의 주문" />

            <div className="flex h-screen flex-col bg-white">
                <main className="grow overflow-y-auto px-6 pb-24">
                    <h2 className="mt-6 text-xl font-bold text-gray-900">
                        {orderCountText}
                    </h2>

                    {isLoading && (
                        <p className="mt-12 text-center text-gray-500">
                            주문 내역을 불러오는 중입니다...
                        </p>
                    )}

                    {error && !isLoading && (
                        <p className="mt-12 text-center text-red-500">{error}</p>
                    )}

                    {!isLoading && !error && (
                        <ul className="mt-6 divide-y divide-gray-200">
                            {displayOrders.map((order) => (
                                <li key={order.id} className="space-y-2 py-4">
                                    <p className="text-xs font-semibold text-gray-500">
                                        {order.date}
                                    </p>
                                    <p className="text-base font-semibold text-gray-900">
                                        {order.title}
                                    </p>
                                    {order.ingredients && (
                                        <p className="text-xs text-gray-500">
                                            {order.ingredients}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </main>
            </div>
        </>
    );
};

export default MyOrdersPage;
