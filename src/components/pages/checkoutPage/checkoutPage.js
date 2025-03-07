import React, {useState} from 'react';
import AppBanner from '../../appBanner/appBanner';
import {getCart, clearCart} from '../../../data/cart';
import {addOrder} from '../../../data/orders';

import './checkoutPage.scss';

const Checkout = () => {
    const cartItems = getCart();
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handlePayment = (e) => {
        e.preventDefault();

        const order = {
            name,
            country,
            city,
            address,
            phone,
            email,
            items: cartItems,
            date: new Date().toISOString()
        };

        addOrder(order);
        clearCart();
        
        setMessage('Thank You! Order placed successfully!');
        setOrderPlaced(true);

        setName('');
        setCountry('');
        setCity('');
        setAddress('');
        setEmail('');
    };

    const handleInputChange = (setter) => (e) => {
        e.preventDefault(); // предотвращаем стандартное поведение
        setter(e.target.value);
    };

    const handlePhoneChange = (e) => {
        e.preventDefault();
        const value = e.target.value.replace(/\D/g, '');
        setPhone(value);
    };


    return (
        <div className="container">
            <AppBanner/>
            <div className="checkout">
                <h2>Checkout</h2>
                {orderPlaced ? (
                    <div className="order-message">{message}</div>
                ) : (
                    <>
                        <div className="checkout-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="checkout-item">
                                <img src={item.image} alt={item.name} />
                                <div className="item-details">
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-price">{item.price}</p>
                                    <p className="item quantity">Quantity: {item.quantity}</p>
                                    <p className="item-size">Size: {item.size}</p>
                                    <p className="item-color">Color: {item.color}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                        <form 
                            className="checkout-form"
                            onSubmit={handlePayment}
                        >
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input 
                                    type="text"
                                    id="name"
                                    value={name}
                                    placeholder="Enter your name"
                                    onChange={handleInputChange(setName)}
                                    required
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input 
                                    type="text"
                                    id="country"
                                    value={country}
                                    placeholder="Enter your country"
                                    onChange={handleInputChange(setCountry)}
                                    required
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input 
                                    type="text"
                                    id="city"
                                    value={city}
                                    placeholder="Enter your city"
                                    onChange={handleInputChange(setCity)}
                                    required
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input 
                                    type="text"
                                    id="address"
                                    value={address}
                                    placeholder="Enter your address"
                                    onChange={handleInputChange(setAddress)}
                                    required
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input 
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    placeholder="Enter your phone"
                                    onChange={handlePhoneChange}
                                    required
                                    />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Email</label>
                                <input 
                                    type="email"
                                    id="email"
                                    value={email}
                                    placeholder="Enter your email"
                                    onChange={handleInputChange(setEmail)}
                                    required
                                    />
                            </div>
                            <button type="submit" className="button view-all">Pay Now</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default Checkout;