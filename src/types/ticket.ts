export interface MyTicketApiItem {
    id: string;
    ticketNumber: string;
    qrCode: string | null;
    orderId: string;
    orderItemId: string;
    mealTicketId: string;
    menuId: string;
    menuName: string;
    restaurantId?: number | null;
    restaurantName?: string | null;
    price: number;
    quantity: number;
    isActive: boolean;
    issuedAt: string;
    usedAt: string | null;
    expiresAt: string | null;
    remainingMinutes: number | null;
    shareQrCode: string | null;
}

export interface MyTicketsApiResponse {
    tickets: MyTicketApiItem[];
    total: number;
    activeCount: number;
    usedCount: number;
}

export interface MyTicketsQueryParams {
    status?: 'active' | 'all';
}

export interface Ticket {
    id: string;
    ticketNumber: string;
    qrCode: string | null;
    orderId: string;
    orderItemId: string;
    mealTicketId: string;
    menuId: string;
    menuName: string;
    restaurantId?: number;
    restaurantName?: string;
    mealLabel?: string;
    price: number;
    quantity: number;
    isActive: boolean;
    isUsed: boolean;
    issuedAt: string;
    formattedIssuedAt: string;
    usedAt: string | null;
    expiresAt: string | null;
    remainingMinutes: number;
    shareQrCode: string | null;
}
