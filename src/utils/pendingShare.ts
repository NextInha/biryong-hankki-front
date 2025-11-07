const STORAGE_KEY = 'pendingShareOrders';

export interface PendingShareOrder {
    orderId: string;
    shareQrCode: string | null;
    createdAt: string;
}

const readStorage = (): PendingShareOrder[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw) as PendingShareOrder[];
        if (Array.isArray(parsed)) {
            return parsed.filter(
                (item) =>
                    typeof item?.orderId === 'string' &&
                    item.orderId.length > 0 &&
                    typeof item?.shareQrCode === 'string' &&
                    item.shareQrCode.length > 0
            );
        }
        return [];
    } catch (error) {
        console.error('Failed to read pending share orders:', error);
        return [];
    }
};

const writeStorage = (orders: PendingShareOrder[]) => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
        console.error('Failed to persist pending share orders:', error);
    }
};

export const loadPendingShareOrders = (): PendingShareOrder[] => {
    return readStorage().sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addPendingShareOrder = (
    order: PendingShareOrder
): PendingShareOrder[] => {
    if (!order.shareQrCode) {
        return loadPendingShareOrders();
    }

    const current = readStorage();
    const exists = current.some((item) => item.orderId === order.orderId);
    const merged = exists
        ? current.map((item) =>
              item.orderId === order.orderId ? { ...item, ...order } : item
          )
        : [...current, { ...order }];

    const next = merged
        .filter((item) => item.shareQrCode)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

    writeStorage(next);
    return next;
};

export const removePendingShareOrder = (orderId: string): PendingShareOrder[] => {
    const current = readStorage();
    const next = current.filter((item) => item.orderId !== orderId);
    writeStorage(next);
    return next;
};
