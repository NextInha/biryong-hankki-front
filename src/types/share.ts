import type { OrderStatus } from './order';

export interface ShareQrOrderInfo {
    orderId: string;
    userId: string;
    userName: string;
    totalPrice: number;
    status: OrderStatus;
    orderedAt: string;
    paidAt: string | null;
}

export interface ShareQrOrderItem {
    id: string;
    menuId: string;
    menuName: string;
    restaurantId?: number | null;
    restaurantName?: string | null;
    ingredients?: string | null;
    price: number;
    quantity: number;
    claimedCount: number;
    remainingQuantity: number;
    subtotal: number;
}

export interface ShareQrScanResponse {
    order: ShareQrOrderInfo;
    items: ShareQrOrderItem[];
    totalItems: number;
    totalRemaining: number;
}

export interface ClaimedTicket {
    id: string;
    ticketNumber: string;
    qrCode: string;
    orderItemId: string;
    menuName: string;
    quantity: number;
    price: number;
    isActive: boolean;
    issuedAt: string;
    expiresAt: string | null;
}

export interface ClaimTicketResponse {
    tickets: ClaimedTicket[];
    totalTickets: number;
}

export interface ClaimSummaryItem {
    menuName: string;
    claimed: number;
}

export interface ClaimSummary {
    totalRemaining: number;
    itemsProcessed: ClaimSummaryItem[];
}

export interface ClaimRemainingResponse {
    tickets: ClaimedTicket[];
    totalTickets: number;
    summary: ClaimSummary;
}
