import { api } from './index';
import type { ApiResponse } from '../types/api';
import type {
    MyTicketsApiResponse,
    MyTicketsQueryParams,
} from '../types/ticket';
import type {
    ClaimTicketResponse,
    ShareQrScanResponse,
    ClaimRemainingResponse,
} from '../types/share';

export const fetchMyTickets = async (
    params?: MyTicketsQueryParams
): Promise<MyTicketsApiResponse> => {
    const response = await api.get<ApiResponse<MyTicketsApiResponse>>(
        '/meal-tickets/my',
        {
            params,
        }
    );

    return response.data.data;
};

interface ShareQrScanRequestBody {
    shareQrCode: string;
}

export const scanShareQrCode = async (
    shareQrCode: string
): Promise<ShareQrScanResponse> => {
    const response = await api.post<ApiResponse<ShareQrScanResponse>>(
        '/meal-tickets/share/scan',
        {
            shareQrCode,
        } satisfies ShareQrScanRequestBody
    );

    return response.data.data;
};

interface ClaimShareTicketRequestBody {
    orderId: string;
    items: Array<{
        orderItemId: string;
        quantity: number;
    }>;
}

export const claimShareTicket = async (
    orderId: string,
    orderItemId: string
): Promise<ClaimTicketResponse> => {
    const response = await api.post<ApiResponse<ClaimTicketResponse>>(
        '/meal-tickets/claim',
        {
            orderId,
            items: [{ orderItemId, quantity: 1 }],
        } satisfies ClaimShareTicketRequestBody
    );

    return response.data.data;
};

interface ClaimRemainingRequestBody {
    orderId: string;
}

export const claimRemainingTickets = async (
    orderId: string
): Promise<ClaimRemainingResponse> => {
    const response = await api.post<ApiResponse<ClaimRemainingResponse>>(
        '/meal-tickets/claim-remaining',
        {
            orderId,
        } satisfies ClaimRemainingRequestBody
    );

    return response.data.data;
};
