import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import TopHeaderSecond from '../../components/layout/TopHeaderSecond';
import type { CreateOrderResponse, OrderItem } from '../../types/order';
import { apiProcessPayment } from '../../api/order';
import type { ApiError } from '../../types/api';
import { fetchMenuDetail } from '../../api/menu';
import { addPendingShareOrder } from '../../utils/pendingShare';

import iconKakao from '../../assets/icons/icon-kakaopay.svg';
import iconNaver from '../../assets/icons/icon-naverpay.svg';
import iconPayco from '../../assets/icons/icon-payco.svg';
import iconToss from '../../assets/icons/icon-tosspay.svg';

const PAYMENT_METHODS = [
    { id: 'hana', name: '인하대 하나카드', icon: null },
    { id: 'card', name: '신용/체크카드', icon: null },
    { id: 'kakao', name: '카카오페이', icon: iconKakao },
    { id: 'naver', name: '네이버페이', icon: iconNaver },
    { id: 'payco', name: '페이코', icon: iconPayco },
    { id: 'toss', name: '토스페이', icon: iconToss },
    { id: 'other', name: '기타 결제 수단', icon: null },
] as const;

const getMealType = (dateString: string): string => {
    try {
        const hours = new Date(dateString).getHours();

        if (hours >= 6 && hours < 10) {
            return '조식';
        }
        if (hours >= 10 && hours < 15) {
            return '중식';
        }
        if (hours >= 17 && hours < 20) {
            return '석식';
        }
    } catch (error) {
        console.error('날짜 변환 오류:', error);
    }

    return '주문';
};

const getMealLabelByRestaurantId = (restaurantId?: number): string => {
    if (restaurantId === 1) {
        return '조식';
    }
    if (restaurantId === 6) {
        return '셀프라면';
    }
    if (restaurantId === 7) {
        return '석식';
    }
    if (restaurantId && [2, 3, 4, 5].includes(restaurantId)) {
        return '중식';
    }
    return '주문';
};

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as
        | {
              orderData?: CreateOrderResponse;
          }
        | undefined;

    const [orderData, setOrderData] = useState<CreateOrderResponse | null>(
        locationState?.orderData ?? null
    );
    const [selectedMethod, setSelectedMethod] = useState(
        PAYMENT_METHODS[0]?.id ?? 'card'
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [menuMetaById, setMenuMetaById] = useState<
        Record<
            string,
            {
                restaurantId: number;
                restaurantName: string;
                ingredients: string | null;
            }
        >
    >({});

    useEffect(() => {
        if (!locationState?.orderData) {
            setOrderData(null);
        } else {
            setOrderData(locationState.orderData);
        }
    }, [locationState]);

    useEffect(() => {
        if (!orderData) {
            setMenuMetaById({});
            return;
        }

        const uniqueMenuIds = Array.from(
            new Set(orderData.items.map((item) => item.menuId))
        );

        if (uniqueMenuIds.length === 0) {
            setMenuMetaById({});
            return;
        }

        let ignore = false;
        const loadDetails = async () => {
            try {
                const entries = await Promise.all(
                    uniqueMenuIds.map(async (menuId) => {
                        try {
                            const detail = await fetchMenuDetail(menuId);
                            return [
                                menuId,
                                {
                                    restaurantId: detail.restaurant.id,
                                    restaurantName: detail.restaurant.name,
                                    ingredients: detail.ingredients,
                                },
                            ] as const;
                        } catch (error) {
                            console.error(
                                `메뉴 상세 불러오기 실패 (${menuId}):`,
                                error
                            );
                            return null;
                        }
                    })
                );

                if (ignore) {
                    return;
                }

                const nextMeta = entries.reduce<
                    Record<
                        string,
                        {
                            restaurantId: number;
                            restaurantName: string;
                            ingredients: string | null;
                        }
                    >
                >((acc, entry) => {
                    if (!entry) {
                        return acc;
                    }
                    const [menuId, meta] = entry;
                    acc[menuId] = meta;
                    return acc;
                }, {});

                setMenuMetaById(nextMeta);
            } catch (error) {
                console.error('메뉴 상세 정보를 불러오지 못했습니다.', error);
            }
        };

        loadDetails();

        return () => {
            ignore = true;
        };
    }, [orderData]);

    const mealType = useMemo(
        () => (orderData ? getMealType(orderData.orderedAt) : ''),
        [orderData]
    );

    const primaryMeta = useMemo(() => {
        if (!orderData || orderData.items.length === 0) {
            return undefined;
        }
        const firstMenuId = orderData.items[0]?.menuId;
        return firstMenuId ? menuMetaById[firstMenuId] : undefined;
    }, [orderData, menuMetaById]);

    const primaryRestaurantName = '학생식당(학생회관)';

    const primaryMealLabel = primaryMeta
        ? getMealLabelByRestaurantId(primaryMeta.restaurantId)
        : mealType;

    const handlePayment = async () => {
        if (!orderData) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const paymentKey = `${selectedMethod}-${Date.now()}`;
            const paymentResult = await apiProcessPayment(orderData.orderId, {
                paymentKey,
                amount: orderData.totalPrice,
            });

            if (paymentResult.shareQrCode) {
                addPendingShareOrder({
                    orderId: orderData.orderId,
                    shareQrCode: paymentResult.shareQrCode,
                    createdAt: new Date().toISOString(),
                });
            }

            setIsProcessing(false);
            navigate('/order-complete', { state: { orderData, paymentResult } });
        } catch (error) {
            const axiosError = error as AxiosError<{ error: ApiError }>;
            if (axiosError.response?.data?.error) {
                const { code, message } = axiosError.response.data.error;
                switch (code) {
                    case 'INVALID_PAYMENT_KEY':
                        setErrorMessage('유효하지 않은 결제 키입니다.');
                        break;
                    case 'INVALID_PAYMENT_AMOUNT':
                        setErrorMessage('결제 금액이 올바르지 않습니다.');
                        break;
                    case 'ORDER_NOT_PAYABLE':
                        setErrorMessage('결제할 수 없는 주문 상태입니다.');
                        break;
                    case 'ORDER_OWNER_MISMATCH':
                        setErrorMessage('본인의 주문만 결제할 수 있습니다.');
                        break;
                    case 'UNAUTHORIZED':
                    case 'INVALID_TOKEN':
                        setErrorMessage('다시 로그인해 주세요.');
                        break;
                    default:
                        setErrorMessage(message ?? '결제에 실패했습니다.');
                }
            } else {
                setErrorMessage('결제에 실패했습니다. 다시 시도해주세요.');
            }
            setIsProcessing(false);
        }
    };

    if (!orderData) {
        return (
            <div className="flex h-screen flex-col bg-white">
                <TopHeaderSecond title="구매하기" />
                <div className="flex flex-1 items-center justify-center px-6 text-center">
                    <div>
                        <p className="text-lg font-semibold text-gray-900">
                            주문 정보가 없습니다.
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            메뉴를 다시 선택해 주세요.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <TopHeaderSecond title="구매하기" />

            <div className="flex h-screen flex-col bg-white">
                <main className="grow overflow-y-auto px-6 pb-28">
                    <div className="mt-6 rounded-[28px] border border-gray-200 bg-white px-6 py-7 text-center shadow">
                        <p className="text-base font-semibold text-gray-700">
                            {primaryRestaurantName}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-primary">
                            {primaryMealLabel}
                        </p>

                        <div className="my-5 h-px bg-gray-200" />

                        <div className="space-y-4 text-left">
                            <h3 className="text-base font-semibold text-gray-900">
                                주문내역
                            </h3>
                            {orderData.items.map((item: OrderItem) => {
                                const meta = menuMetaById[item.menuId];
                                const mealLabel = meta
                                    ? getMealLabelByRestaurantId(
                                          meta.restaurantId
                                      )
                                    : primaryMealLabel;
                                const restaurantName =
                                    meta?.restaurantName ??
                                    primaryRestaurantName;

                                return (
                                    <div key={item.id}>
                                        <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                            <span>
                                                ({mealLabel}) {restaurantName} x
                                                {item.quantity}
                                            </span>
                                            <span>
                                                {item.subtotal.toLocaleString()}원
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 pl-4">
                                            {meta?.ingredients ??
                                                '구성 정보가 준비 중입니다.'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <section className="mt-10 space-y-5">
                        <h3 className="text-base font-semibold text-gray-900">
                            결제수단
                        </h3>
                        <div className="space-y-4">
                            {PAYMENT_METHODS.map((method) => {
                                const isSelected =
                                    selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedMethod(method.id)
                                        }
                                        className="flex w-full items-center justify-between text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                    isSelected
                                                        ? 'border-primary'
                                                        : 'border-gray-400'
                                                }`}
                                            >
                                                {isSelected && (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                                                )}
                                            </span>
                                            {method.icon && (
                                                <img
                                                    src={method.icon}
                                                    alt={method.name}
                                                    className="h-6 w-6"
                                                />
                                            )}
                                            <span className="text-sm font-semibold text-gray-900">
                                                {method.name}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {errorMessage && (
                        <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {errorMessage}
                        </p>
                    )}
                </main>

                <footer className="fixed bottom-0 right-0 left-1/2 flex w-full max-w-md -translate-x-1/2 items-center justify-between bg-white px-6 py-5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <div>
                        <span className="text-xs text-gray-500">결제금액</span>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {orderData.totalPrice.toLocaleString()}원
                        </p>
                    </div>
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="rounded-xl bg-primary px-10 py-3 text-base font-bold text-white transition hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400"
                    >
                        {isProcessing ? '결제 중...' : '결제하기'}
                    </button>
                </footer>
            </div>
        </>
    );
};

export default PaymentPage;
