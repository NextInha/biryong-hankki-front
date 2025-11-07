// src/pages/HomePage.tsx

import { useCallback, useEffect, useMemo, useState } from 'react';
import TopHeader from '../components/layout/TopHeader';
import UserInfo from '../components/home/UserInfo';
import MealStatus from '../components/home/MealStatus';
import MyTicketCard from '../components/home/MyTicketCard';
import PurchaseButton from '../components/home/PurchaseButton';
import iconInduck from '../assets/icons/icon-induck.svg';
import EventBanner from '../components/home/EventBanner';
import ReviewModal from '../components/home/ReviewModal';
import ShareQrModal from '../components/home/ShareQrModal';
import { claimRemainingTickets, fetchMyTickets } from '../api/mealTickets';
import type { MyTicketApiItem, MyTicketsApiResponse, Ticket } from '../types/ticket';
import { getRestaurantMeta } from '../constants/restaurants';
import { useAuthStore } from '../store/useAuthStore';
import { fetchMyOrders } from '../api/orders';
import {
    loadPendingShareOrders,
    removePendingShareOrder,
    type PendingShareOrder,
} from '../utils/pendingShare';

const formatIssuedAt = (value?: string | null) => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    const dateText = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
    }).format(date);

    const timeText = new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);

    return `${dateText} ${timeText}`;
};

const mapTicket = (item: MyTicketApiItem): Ticket => {
    const meta = getRestaurantMeta(item.restaurantId ?? undefined);

    return {
        id: item.id,
        ticketNumber: item.ticketNumber,
        qrCode: item.qrCode,
        orderId: item.orderId,
        orderItemId: item.orderItemId,
        mealTicketId: item.id,
        menuId: item.menuId,
        menuName: item.menuName,
        restaurantId:
            item.restaurantId != null ? Number(item.restaurantId) : undefined,
        restaurantName: item.restaurantName ?? meta?.label,
        mealLabel: meta?.label,
        price: item.price,
        quantity: item.quantity,
        isActive: item.isActive,
        isUsed: !item.isActive,
        issuedAt: item.issuedAt,
        formattedIssuedAt: formatIssuedAt(item.issuedAt),
        usedAt: item.usedAt,
        expiresAt: item.expiresAt,
        remainingMinutes: item.remainingMinutes ?? 0,
        shareQrCode: item.shareQrCode ?? null,
    };
};

const HomePage = () => {
    const user = useAuthStore((state) => state.user);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [summary, setSummary] = useState({
        total: 0,
        activeCount: 0,
        usedCount: 0,
    });
    const [orderItemCount, setOrderItemCount] = useState(0);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<Ticket | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    type ShareTarget = {
        orderId: string;
        shareQrCode: string | null;
    };

    const [shareTarget, setShareTarget] = useState<ShareTarget | null>(null);
    const [pendingShareOrders, setPendingShareOrders] = useState<
        PendingShareOrder[]
    >([]);
    const [isClaimingRemaining, setIsClaimingRemaining] = useState(false);

    useEffect(() => {
        setPendingShareOrders(loadPendingShareOrders());
    }, []);

    const applyTicketResponse = useCallback((data: MyTicketsApiResponse) => {
        const mapped = data.tickets.map(mapTicket);

        setTickets(mapped);
        setSummary({
            total: data.total,
            activeCount: data.activeCount,
            usedCount: data.usedCount,
        });

        setSelectedTicketId((prev) => {
            if (prev && mapped.some((ticket) => ticket.id === prev)) {
                return prev;
            }

            const firstActive =
                mapped.find((ticket) => !ticket.isUsed) ?? mapped[0] ?? null;
            return firstActive?.id ?? null;
        });
    }, []);

    const loadTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchMyTickets({ status: 'active' });
            applyTicketResponse(data);
            setPendingShareOrders(loadPendingShareOrders());
        } catch (err) {
            console.error('식권 불러오기 실패:', err);
            setError('식권을 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [applyTicketResponse]);

    useEffect(() => {
        void loadTickets();
    }, [loadTickets]);

    useEffect(() => {
        let ignore = false;

        const loadOrderCount = async () => {
            try {
                const history = await fetchMyOrders();
                if (ignore) {
                    return;
                }

                const totalItems = history.orders.reduce((orderAcc, order) => {
                    const orderTotal = order.items.reduce(
                        (itemAcc, item) => itemAcc + Math.max(item.quantity, 1),
                        0
                    );
                    return orderAcc + orderTotal;
                }, 0);

                setOrderItemCount(totalItems);
            } catch (error) {
                console.error('주문 수량 불러오기 실패:', error);
            }
        };

        loadOrderCount();

        return () => {
            ignore = true;
        };
    }, []);

    const activeTicket = useMemo(() => {
        if (selectedTicketId) {
            return (
                tickets.find((ticket) => ticket.id === selectedTicketId) ?? null
            );
        }

        return null;
    }, [selectedTicketId, tickets]);

    const handleOpenReviewModal = (ticketData: Ticket) => {
        setSelectedTicketId(ticketData.id);
        setReviewTarget(ticketData);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
    };

    const handleReviewSuccess = (ticketId: string) => {
        setTickets((prev) =>
            prev.map((ticket) =>
                ticket.id === ticketId
                    ? { ...ticket, isUsed: true, isActive: false }
                    : ticket
            )
        );

        setSummary((prev) => ({
            ...prev,
            activeCount: Math.max(prev.activeCount - 1, 0),
            usedCount: prev.usedCount + 1,
        }));

        setSelectedTicketId(ticketId);
    };

    const handleOpenShareModal = (ticketData: Ticket | null) => {
        const latestStores = loadPendingShareOrders();
        setPendingShareOrders(latestStores);

        const fallbackList =
            latestStores.length > 0 ? latestStores : pendingShareOrders;
        let target: ShareTarget | null = null;

        if (ticketData?.shareQrCode) {
            target = {
                orderId: ticketData.orderId,
                shareQrCode: ticketData.shareQrCode,
            };
        } else if (fallbackList.length > 0) {
            const latest = fallbackList[0];
            target = {
                orderId: latest.orderId,
                shareQrCode: latest.shareQrCode ?? null,
            };
        }

        if (!target || !target.shareQrCode) {
            window.alert('공유 가능한 QR 정보를 찾지 못했습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        setShareTarget(target);
        setIsShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
    };

    const ticketCount = orderItemCount > 0 ? orderItemCount : summary.total;
    const userName = user?.name ?? '인하인';

    return (
        <>
            <TopHeader />

            <div
                className="
          fixed top-20 left-0 right-0 container mx-auto
          flex items-center gap-2 p-3
          bg-white shadow-sm z-10
        "
            >
                <img className="w-6 h-6" src={iconInduck} alt="공지" />
                <span className="font-semibold text-gray-800">
                    10월 6일 ~ 10월 9일 휴무
                </span>
            </div>

            <main className="pt-16 pb-32 px-6  bg-[#E6EDF3] min-h-screen">
                {/* 유저 정보 & 식사 상태 */}
                <div className="flex justify-between items-center mb-4 z-15">
                    <UserInfo
                        name={userName}
                        ticketCount={ticketCount}
                    />
                    <MealStatus />
                </div>

                {/* 나의 식권 섹션 */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        나의 식권
                    </h2>

                    {isLoading && (
                        <p className="text-gray-500 p-4 text-center">
                            식권을 불러오는 중입니다...
                        </p>
                    )}

                    {error && !isLoading && (
                        <p className="text-red-500 p-4 text-center">{error}</p>
                    )}

                    {!isLoading && !error && (
                        <MyTicketCard
                            ticket={activeTicket ?? null}
                            onMealCompleteClick={handleOpenReviewModal}
                            onShareClick={handleOpenShareModal}
                        />
                    )}

                    {/* "식권 예매하기" 버튼은 항상 보임 */}
                    <PurchaseButton />

                    {/* 경고 문구 (식권이 있을 때만 보임) */}
                    {activeTicket && !isLoading && !error && (
                        <p className="text-center text-sm text-gray-600 mt-4">
                            식사 수령 시 해당 모바일 식권을 제시해주세요.
                            <br />
                            캡처 화면은 인정되지 않습니다.
                        </p>
                    )}
                </section>

                <div className="mt-8 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">이벤트</h2>
                    <EventBanner />
                </div>
            </main>

            {/* 리뷰 모달 렌더링 */}
            {/* reviewTarget이 있을 때만 모달을 렌더링 (안정성) */}
            {reviewTarget && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={handleCloseReviewModal}
                    onSuccess={() => handleReviewSuccess(reviewTarget.mealTicketId)}
                    // reviewTarget에서 실제 데이터 전달
                    orderId={reviewTarget.orderId}
                    orderItemId={reviewTarget.orderItemId}
                    mealTicketId={reviewTarget.mealTicketId}
                    menuId={reviewTarget.menuId}
                    menuName={reviewTarget.menuName}
                />
            )}
            {isShareModalOpen && (
                <ShareQrModal
                    shareQrCode={shareTarget?.shareQrCode ?? null}
                    orderId={shareTarget?.orderId ?? null}
                    isClaiming={isClaimingRemaining}
                    onClose={handleCloseShareModal}
                    onClaimRemaining={async (orderId) => {
                        try {
                            setIsClaimingRemaining(true);
                            await claimRemainingTickets(orderId);
                            removePendingShareOrder(orderId);
                            const data = await fetchMyTickets({ status: 'active' });
                            applyTicketResponse(data);
                            setPendingShareOrders(loadPendingShareOrders());
                            setShareTarget(null);
                            setIsShareModalOpen(false);
                            window.alert('남은 식권을 모두 발급했습니다.');
                        } catch (err) {
                            console.error('남은 식권 발급 실패:', err);
                            window.alert('남은 식권을 발급하지 못했습니다. 다시 시도해주세요.');
                        } finally {
                            setIsClaimingRemaining(false);
                        }
                    }}
                />
            )}
        </>
    );
};

export default HomePage;
