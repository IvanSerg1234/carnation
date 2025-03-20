import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBanner from '../../appBanner/appBanner';

import './ordersPage.scss';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3000/orders', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="container">
            <AppBanner />
            <div className="orders">
                <h2>Your Orders</h2>
                {error && <div className="error-message">{error}</div>}
                {orders.length === 0 ? (
                    <p>You have no orders</p>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => (
                            <div key={index} className="order-item">
                                <h3>Order {index + 1}</h3>
                                <p>Date: {new Date(order.date).toLocaleString()}</p>
                                <div className="order-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item-details">
                                            <img src={item.image} alt={item.name} />
                                            <div>
                                                <p>{item.name}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Size: {item.size}</p>
                                                <p>Color: {item.color}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;