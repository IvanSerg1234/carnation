import { API_URL } from './apiConfig.js';

export const registerUser = async (user) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
        return true;
    } else {
        const error = await response.json();
        console.log('User registration failed:', error);
        return false;
    }
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log('User logged in:', data);
        return true;
    } else {
        const error = await response.json();
        console.log('Login failed:', error);
        return false;
    }
};

export const logoutUser = async () => {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Logout failed:', error);
            return false;
        }

        localStorage.removeItem('token');
        console.log('User logged out');
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
};

export const getCurrentUserAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch user');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const logoutUserAPI = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to logout');

        localStorage.removeItem('token');
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};