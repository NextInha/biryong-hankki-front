import { api } from './index';
import type { Menu, MenuDetail } from '../types/menu';
import type { ApiResponse } from '../types/api';

interface MenuApiResponseItem {
    id: string;
    restaurantId: number;
    restaurantName: string;
    name: string;
    ingredients: string | null;
    price: number;
    isAvailable: boolean;
    averageRating: number | string | null;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

interface MenuApiResponseBody {
    menus: MenuApiResponseItem[];
    total: number;
    restaurantFilter: number | null;
}

interface MenuDetailApiResponseMenu {
    id: string;
    name: string;
    ingredients: string | null;
    price: number;
    isAvailable: boolean;
    averageRating: number | string | null;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    restaurant: {
        id: number;
        name: string;
        description: string | null;
    };
}

interface MenuDetailApiResponseBody {
    menu: MenuDetailApiResponseMenu;
}

const mapMenu = (item: MenuApiResponseItem): Menu => ({
    id: item.id,
    restaurantId: item.restaurantId,
    restaurantName: item.restaurantName,
    name: item.name,
    ingredients: item.ingredients,
    price: item.price,
    isAvailable: item.isAvailable,
    averageRating: Number(item.averageRating ?? 0),
    reviewCount: item.reviewCount,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});

export interface FetchMenusOptions {
    date?: string;
    restaurantId?: number;
}

export const fetchMenus = async (
    options?: FetchMenusOptions
): Promise<Menu[]> => {
    const params: Record<string, string | number> = {};

    if (options?.restaurantId != null) {
        params.restaurantId = options.restaurantId;
    }

    if (options?.date) {
        params.date = options.date;
    }

    const response = await api.get<ApiResponse<MenuApiResponseBody>>(
        '/menus',
        { params }
    );

    const menus = response.data.data?.menus ?? [];
    return menus.map(mapMenu);
};

const mapMenuDetail = (menu: MenuDetailApiResponseMenu): MenuDetail => ({
    id: menu.id,
    name: menu.name,
    ingredients: menu.ingredients,
    price: menu.price,
    isAvailable: menu.isAvailable,
    averageRating: Number(menu.averageRating ?? 0),
    reviewCount: menu.reviewCount,
    createdAt: menu.createdAt,
    updatedAt: menu.updatedAt,
    restaurant: {
        id: menu.restaurant.id,
        name: menu.restaurant.name,
        description: menu.restaurant.description,
    },
});

export const fetchMenuDetail = async (menuId: string): Promise<MenuDetail> => {
    const response = await api.get<ApiResponse<MenuDetailApiResponseBody>>(
        `/menus/${menuId}`
    );

    const menu = response.data.data?.menu;
    if (!menu) {
        throw new Error('메뉴 상세 정보를 찾을 수 없습니다.');
    }

    return mapMenuDetail(menu);
};
