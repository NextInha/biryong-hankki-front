// src/api/restaurant.ts

import { api } from './index';
import type { Restaurant, RestaurantListResponse } from '../types/restaurant';

interface RestaurantApiResponse {
    success: boolean;
    data: RestaurantListResponse;
}

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
    const response = await api.get<RestaurantApiResponse>('/restaurants');
    return response.data.data.restaurants;
};
