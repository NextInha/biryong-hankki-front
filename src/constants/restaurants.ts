import iconBreakfast from '../assets/icons/icon-breakfast.svg';
import iconLunch from '../assets/icons/icon-lunch.svg';
import iconDinner from '../assets/icons/icon-dinner.svg';

export interface RestaurantMeta {
    label: string;
    time?: string;
    icon: string;
}

const LUNCH_META = {
    label: '중식',
    time: '11:00 ~ 14:00',
    icon: iconLunch,
} as const;

export const RESTAURANT_META: Record<number, RestaurantMeta> = {
    1: {
        label: '조식',
        time: '08:00 ~ 09:00',
        icon: iconBreakfast,
    },
    2: { ...LUNCH_META },
    3: { ...LUNCH_META },
    4: { ...LUNCH_META },
    5: { ...LUNCH_META },
    6: {
        label: '셀프라면',
        time: '11:00 ~ 18:30',
        icon: iconLunch,
    },
    7: {
        label: '석식',
        time: '17:00 ~ 18:30',
        icon: iconDinner,
    },
};

export const getRestaurantMeta = (restaurantId?: number | null) =>
    restaurantId != null ? RESTAURANT_META[restaurantId] : undefined;
