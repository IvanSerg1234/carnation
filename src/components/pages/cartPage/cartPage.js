import React, {useState} from 'react';
import {FaTrash, FaPlus, FaMinus} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import AppBanner from '../../appBanner/appBanner';
import {getCart, removeFromCart, updateQuantity} from '../../../data/cart';

import './cartPage.scss';

const Cart = () => {
    const [cartItems, setCartItems] = useState(getCart());

    const handleRemove = (productId, size, color) => {
        removeFromCart(productId, size, color);
        setCartItems(getCart());
    }

    const handleQuantityChange = (productId, size, color, type) => {
        setCartItems(prevCartItems => {
            return prevCartItems.map(item => {
                if (item.id === productId && item.size === size && item.color === color) {
                    const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    updateQuantity(productId, size, color, newQuantity);
                    return {...item, quantity: newQuantity};
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    return (
        
        <div className="container">
            <AppBanner/>
                <div className="cart">
                <h2>Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.image} alt={item.name} />
                                <div className="item-details">
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-price">{item.price}</p>
                                    <p className="item quantity">Quantity: {item.quantity}</p>
                                    <p className="item-size">Size: {item.size}</p>
                                    <p className="item-color">Color: {item.color}</p>
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => handleQuantityChange(
                                                item.id, item.size, item.color, 'decrease'
                                                )}
                                        >
                                            <FaMinus/>
                                        </button>
                                        <button 
                                            onClick={() => handleQuantityChange(
                                                item.id, item.size, item.color, 'increase'
                                                )}
                                        >
                                            <FaPlus/>
                                        </button>
                                    </div>
                                    
                                    <button
                                            className="remove-button"
                                            onClick={() => handleRemove(item.id, item.size, item.color)}
                                        >
                                            <FaTrash/>
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