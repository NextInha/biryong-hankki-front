export interface Menu {
    id: string; // UUID는 string 타입입니다.
    restaurantId: number; // FK → restaurants.id
    restaurantName: string;
    name: string;
    ingredients: string | null;
    price: number;
    isAvailable: boolean;
    averageRating: number;
    reviewCount: number;
    createdAt: string; // TIMESTAMP는 string (ISO 8601 형식)
    updatedAt: string;
}

export interface MenuDetailRestaurant {
    id: number;
    name: string;
    description: string | null;
}

export interface MenuDetail {
    id: string;
    name: string;
    ingredients: string | null;
    price: number;
    isAvailable: boolean;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    restaurant: MenuDetailRestaurant;
}
