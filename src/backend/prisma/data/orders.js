import {API_URL} from './apiConfig.js';

const ordersData = [
    {
        id: 1,
        userId: 1,
        products: JSON.stringify([
            { productId: 1, quantity: 2, size: "M", color: "White" },
            { productId: 2, quantity: 1, size: "L", color: "Black" }
        ]),
        total: 115.00,
        createdAt: new Date()
    },
    {
        id: 2,
        userId: 2,
        products: JSON.stringify([
            { productId: 3, quantity: 1, size: "S", color: "Red" }
        ]),
        total: 30.00,
        createdAt: new Date()
    }
];

export const addOrder = async (order) => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to add order:', error);
            return;
        }

        console.log('Order added:', order);
    } catch (error) {
        console.error('Failed to add order:', error);
    }
};

export const getOrders = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/orders?userId=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch orders:', error);
            return [];
        }

        const orders = await response.json();
        console.log('Orders fetched:', orders);
        return orders;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
};

export const clearOrders = async () => {
    try {
        const response = await fetch(`${API_URL}/orders/clear`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to clear orders:', error);
            return;
        }

        console.log('Orders cleared');
    } catch (error) {
        console.error('Failed to clear orders:', error);
    }
};

export default ordersData;