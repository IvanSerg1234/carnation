import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AppBanner from '../../appBanner/appBanner';

import './cartPage.scss';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('http://localhost:3000/cart', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const cartData = await response.json();
                    setCartItems(cartData);
                } else {
                    console.error('Failed to fetch cart data');
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, [token]);

    const handleRemove = async (productId, size, color) => {
        try {
            const response = await fetch('http://localhost:3000/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, size, color }),
            });
            if (response.ok) {
                setCartItems(prevCartItems => prevCartItems.filter(item => !(item.productId === productId && item.size === size && item.color === color)));
            } else {
                console.error('Failed to remove item from cart');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleQuantityChange = async (productId, size, color, type) => {
        const updatedQuantity = type === 'increase' ? 1 : -1;
        const updatedItem = cartItems.find(item => item.productId === productId && item.size === size && item.color === color);

        if (updatedItem) {
            const newQuantity = updatedItem.quantity + updatedQuantity;

            if (newQuantity < 1) return;

            try {
                const response = await fetch('http://localhost:3000/cart/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ productId, size, color, quantity: newQuantity }),
                });

                if (response.ok) {
                    setCartItems(prevCartItems => prevCartItems.map(item => {
                        if (item.productId === productId && item.size === size && item.color === color) {
                            return { ...item, quantity: newQuantity };
                        }
                        return item;
                    }));
                } else {
                    console.error('Failed to update item quantity');
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        }
    };

    return (
        <div className="container">
            <AppBanner />
            <div className="cart">
                <h2>Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.product.image} alt={item.product.name} />
                                <div className="item-details">
                                    <p className="item-name">{item.product.name}</p>
                                    <p className="item-price">{item.product.price}</p>
                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                    <p className="item-size">Size: {item.size}</p>
                                    <p className="item-color">Color: {item.color}</p>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(
                                                item.productId, item.size, item.color, 'decrease'
                                            )}
                                        >
                                            <FaMinus />
                                        </button>
                                        <button
                                            onClick={() => handleQuantityChange(
                                                item.productId, item.size, item.color, 'increase'
                                            )}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <button
                                        className="remove-button"
                                        onClick={() => handleRemove(item.productId, item.size, item.color)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {cartItems.length > 0 && (
                    <div className="checkout-button">
                        <Link to="/checkout" className="button view-all">Buy Now</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;