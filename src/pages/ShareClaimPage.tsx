import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import BottomNavBar from '../components/layout/BottomNavBar';
import { claimShareTicket } from '../api/mealTickets';
import type { ShareQrOrderItem, ShareQrScanResponse } from '../types/share';
import type { ApiError } from '../types/api';
import iconClose from '../assets/icons/icon-x-black.svg';

interface LocationState {
    shareQrCode: string;
    shareData: ShareQrScanResponse;
}

const toFiniteNumber = (value: unknown): number | null => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return null;
        }
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};

const normalizeNumber = (value: unknown): number => {
    const parsed = toFiniteNumber(value);
    return parsed ?? 0;
};

const resolveRemainingCount = (item: ShareQrOrderItem): number => {
    const quantity = toFiniteNumber(item.quantity) ?? 0;
    const claimed = toFiniteNumber(item.claimedCount) ?? 0;
    const fallback = Math.max(quantity - claimed, 0);

    const direct = toFiniteNumber(item.remainingQuantity);
    if (direct != null) {
        return Math.max(direct, fallback);
    }

    return fallback;
};

const toUuidString = (value: unknown): string => {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'object') {
        const record = value as Record<string, unknown>;

        // Jackson `UUID` breakdown: mostSignificantBits / leastSignificantBits
        if (
            record.mostSignificantBits != null &&
            record.leastSignificantBits != null
        ) {
            try {
                const toUnsigned = (source: unknown): bigint => {
                    const big = BigInt(source as string | number);
                    return big >= 0n ? big : (big + (1n << 64n));
                };

                const msb = toUnsigned(record.mostSignificantBits);
                const lsb = toUnsigned(record.leastSignificantBits);
                const combined = (msb << 64n) | lsb;

                const hex = combined.toString(16).padStart(32, '0');
                return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
            } catch (error) {
                console.warn('Failed to decode UUID bits:', error);
            }
        }

        if (typeof record.value === 'string') {
            return record.value;
        }

        if (typeof (record as { toString?: () => string }).toString === 'function') {
            const raw = (record as { toString: () => string }).toString();
            if (raw && raw !== '[object Object]') {
                return raw;
            }
        }
    }

    return '';
};

const ShareClaimPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | undefined;

    const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
        null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const shareData = state?.shareData;

    const normalizedOrderId = useMemo(() => {
        if (!shareData) {
            return '';
        }

        const raw =
            (shareData.order as unknown as { id?: unknown })?.id ??
            (shareData as unknown as { orderId?: unknown })?.orderId ??
            null;

        return toUuidString(raw);
    }, [shareData]);

    useEffect(() => {
        if (!shareData || !state?.shareQrCode) {
            navigate('/home', { replace: true });
        }
    }, [shareData, state?.shareQrCode, navigate]);

    const handleClaim = async () => {
        if (!selectedOrderItemId || isSubmitting) {
            return;
        }

        if (!normalizedOrderId) {
            setErrorMessage('주문 정보를 확인하지 못했습니다. 다시 시도해주세요.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            await claimShareTicket(normalizedOrderId, selectedOrderItemId);
            setIsSuccess(true);
        } catch (error) {
            const axiosError = error as AxiosError<{ error: ApiError }>;
            if (axiosError.response?.data?.error) {
                setErrorMessage(
                    axiosError.response.data.error.message ??
                        '식권 발급에 실패했습니다.'
                );
            } else {
                setErrorMessage('식권 발급에 실패했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatIngredients = (value?: string | null) => {
        if (!value) {
            return [];
        }
        const trimmed = value.trim();
        if (!trimmed) {
            return [];
        }

        const normalized = trimmed.replace(/\r\n/g, '\n');
        if (normalized.includes('\n')) {
            return normalized
                .split(/\n+/)
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        }

        const commaSeparated = normalized
            .split(/,\s*/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (commaSeparated.length > 1) {
            return commaSeparated;
        }

        return [trimmed];
    };

    const items = useMemo<ShareQrOrderItem[]>(() => {
        if (!shareData) {
            return [];
        }

        return shareData.items
            .map((item) => {
                const normalizedQuantity = normalizeNumber(item.quantity);
                const normalizedClaimed = normalizeNumber(item.claimedCount);
                const remaining = resolveRemainingCount({
                    ...item,
                    quantity: normalizedQuantity,
                    claimedCount: normalizedClaimed,
                });

                const id = toUuidString(item.id);

                return {
                    ...item,
                    quantity: normalizedQuantity,
                    claimedCount: normalizedClaimed,
                    remainingQuantity: remaining,
                    id,
                };
            })
            .filter((item) => typeof item.id === 'string' && item.id.length > 0);
    }, [shareData]);

    const firstAvailableId = useMemo(() => {
        return items.find((item) => resolveRemainingCount(item) > 0)?.id ?? null;
    }, [items]);

    useEffect(() => {
        if (firstAvailableId) {
            setSelectedOrderItemId(firstAvailableId);
        } else {
            setSelectedOrderItemId(null);
        }
        setIsSuccess(false);
        setIsSubmitting(false);
        setErrorMessage(null);
    }, [firstAvailableId]);

    const handleSelect = (item: ShareQrOrderItem) => {
        if (resolveRemainingCount(item) <= 0 || isSuccess) {
            return;
        }
        setSelectedOrderItemId(item.id);
    };

    const selectedItem = shareData
        ? items.find((item) => item.id === selectedOrderItemId)
        : undefined;
    const selectedItemRemaining = selectedItem
        ? resolveRemainingCount(selectedItem)
        : 0;

    const renderCard = (item: ShareQrOrderItem) => {
        const isSelected = item.id === selectedOrderItemId;
        const remainingCount = resolveRemainingCount(item);
        const isDisabled = remainingCount <= 0;
        const ingredients = formatIngredients(item.ingredients);
        const restaurantName =
            item.restaurantName ?? shareData?.order.userName ?? item.menuName;
        const baseClasses =
            'w-full mb-[13px] last:mb-0 p-3 min-h-24 rounded-lg shadow-md flex items-center justify-between gap-3 border transition-all duration-150';
        const stateClasses = isDisabled
            ? 'bg-gray-100 border-transparent text-gray-400 cursor-not-allowed'
            : isSelected
              ? 'bg-[#D6E9FF] border-primary shadow-lg cursor-pointer'
              : 'bg-white border-transparent cursor-pointer hover:border-primary/40 active:scale-[0.98] active:opacity-80';

        return (
            <button
                key={item.id}
                onClick={() => handleSelect(item)}
                type="button"
                disabled={isDisabled || isSuccess}
                className={`${baseClasses} ${stateClasses}`}
            >
                <div className="w-[35%] pl-6 text-left">
                    <p
                        className={`text-lg font-semibold ${
                            isDisabled ? 'text-gray-400' : 'text-gray-900'
                        } whitespace-nowrap`}
                    >
                        {restaurantName}
                    </p>
                </div>

                <div className="flex-1 text-center">
                    {ingredients.length > 0 ? (
                        ingredients.map((line, index) => (
                            <p
                                key={`${item.id}-ingredient-${index}`}
                                className={`text-xs leading-tight ${
                                    isDisabled ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                {line}
                            </p>
                        ))
                    ) : (
                        <p
                            className={`text-xs ${
                                isDisabled ? 'text-gray-300' : 'text-gray-500'
                            }`}
                        >
                            구성 정보가 준비 중입니다.
                        </p>
                    )}
                </div>

                <div className="w-[30%] pr-2 text-right">
                    <p
                        className={`text-xl font-semibold ${
                            isDisabled ? 'text-gray-300' : 'text-primary'
                        }`}
                    >
                        {item.price.toLocaleString()}원
                    </p>
                    {!isDisabled && (
                        <p className="mt-1 text-[11px] font-semibold text-primary/70">
                            남은 {remainingCount}장
                        </p>
                    )}
                </div>
            </button>
        );
    };

    if (!shareData || !state?.shareQrCode) {
        return (
            <div className="flex h-screen items-center justify-center bg-white px-6 text-center">
                <div className="space-y-3">
                    <p className="text-lg font-semibold text-gray-900">
                        공유 정보를 불러오지 못했습니다.
                    </p>
                    <button
                        onClick={() => navigate('/home')}
                        className="text-primary font-semibold"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-[#E6EDF3]">
            <header className="px-6 pt-12 pb-6">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            navigate('/home', {
                                replace: true,
                            })
                        }
                        className="p-1"
                    >
                        <img
                            src={iconClose}
                            alt="닫기"
                            className="h-5 w-5 text-gray-600"
                        />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-medium text-gray-900">
                        공유 식권 선택
                    </h1>
                    <div className="h-6 w-6" aria-hidden />
                </div>
                <p className="mt-8 text-center text-base font-medium text-gray-700">
                    식권을 선택해 주세요.
                </p>
            </header>

            <main className="grow overflow-y-auto px-6 pb-6">
                <div className="space-y-4">
                    {items.length === 0 ? (
                        <div className="rounded-3xl bg-white p-6 text-center text-sm text-gray-600 shadow">
                            공유 가능한 식권이 없습니다.
                        </div>
                    ) : (
                        items.map((item) => renderCard(item))
                    )}
                </div>

                {errorMessage && (
                    <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
                        {errorMessage}
                    </p>
                )}

                {isSuccess && (
                    <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
                        식권이 발급되었습니다. 홈에서 식권을 확인해 주세요.
                    </div>
                )}
            </main>

            <div className="shrink-0 bg-[#E6EDF3] px-6 pb-4">
                {(() => {
                    const actionDisabled =
                        isSubmitting ||
                        (!isSuccess &&
                            (!selectedItem || selectedItemRemaining <= 0));
                    return (
                        <button
                            type="button"
                            onClick={
                                isSuccess ? () => navigate('/home') : handleClaim
                            }
                            disabled={actionDisabled}
                            className={`w-full rounded-xl bg-primary py-4 text-base font-semibold text-white transition-colors ${
                                actionDisabled ? 'bg-gray-400' : 'hover:bg-[#005199]'
                            }`}
                        >
                            {isSuccess
                                ? '홈으로 가기'
                                : isSubmitting
                                  ? '발급 중...'
                                  : '식권 지정하기'}
                        </button>
                    );
                })()}
            </div>

            <footer className="shrink-0 bg-white">
                <BottomNavBar />
            </footer>
        </div>
    );
};

export default ShareClaimPage;
