// src/types/restaurant.ts

export interface Restaurant {
    id: number;
    name: string;
    description: string | null;
    displayOrder: number | null;
    isActive: boolean;
    createdAt: string;
}

export interface RestaurantListResponse {
    restaurants: Restaurant[];
    total: number;
}
