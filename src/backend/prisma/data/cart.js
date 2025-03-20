import {API_URL} from './apiConfig.js';

export const addToCart = async (product) => {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to add product to cart:', error);
            return;
        }

        console.log('Product added to cart');
    } catch (error) {
        console.error('Failed to add product to cart:', error);
    }
};

export const getCart = async () => {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to fetch cart:', error);
            return [];
        }

        const cart = await response.json();
        console.log('Cart fetched:', cart);
        return cart;
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        return [];
    }
};

export const removeFromCart = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to remove product from cart:', error);
            return;
        }

        console.log('Product removed from cart');
    } catch (error) {
        console.error('Failed to remove product from cart:', error);
    }
};

export const clearCart = async () => {
    try {
        const response = await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to clear cart:', error);
            return;
        }

        console.log('Cart cleared');
    } catch (error) {
        console.log('Failed to clear cart:', error);
    }
};