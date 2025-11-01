export interface Menu {
    id: string; // UUID는 string 타입입니다.
    restaurant_id: string; // FK (보통 string이나 number)
    name: string; // 'title' 대신 'name'
    ingredients: string; // 'description' 대신 'ingredients'
    price: number;
    is_available: boolean;
    average_rating: number; // DECIMAL은 number
    review_count: number;
    created_at: string; // TIMESTAMP는 string (ISO 8601 형식)
    updated_at: string;
}
