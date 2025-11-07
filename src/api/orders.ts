import { api } from './index';
import type { ApiResponse } from '../types/api';
import type { OrderHistoryResponse } from '../types/order';

export const fetchMyOrders = async (): Promise<OrderHistoryResponse> => {
    const response = await api.get<ApiResponse<OrderHistoryResponse>>(
        '/orders/my',
        {
            params: { page: 1, limit: 20 },
        }
    );

    return response.data.data;
};
