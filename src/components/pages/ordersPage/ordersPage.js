import React from 'react';
import {getCurrentUser} from '../../../data/auth';
import {getOrders} from '../../../data/orders';
import AppBanner from '../../appBanner/appBanner';

import './ordersPage.scss';

const Orders = () => {
    const user = getCurrentUser();
    const orders = getOrders().filter(order => order.email === user.email);

    return (
        <div className="container">
            <AppBanner/>
            <div className="orders">
                <h2>Your Orders</h2>
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