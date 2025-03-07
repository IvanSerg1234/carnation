import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";

import AppBanner from "../../appBanner/appBanner";
import Spinner from "../../spinner/Spinner";
import {getProductByName} from "../../../data/products";
import {addToCart} from "../../../data/cart";

import './productDetail.scss';

const ProductDetail = () => {
    const {productName} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        const selectedProduct = getProductByName(productName);

        if (selectedProduct) {
            setProduct(selectedProduct);
            setSelectedImage(selectedProduct.image);
        } else {
            console.error("Product not found");
            setProduct(null); // Or set some default state
        }
        setLoading(false);
    }, [productName]);  

    if (loading) {
        return <Spinner />;
    }

    if (!product) {
        return <p>Loading...</p>;
    }

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === 'increase' ? prev + 1 : prev > 1 ? prev - 1 : 1));
    }

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            size: selectedSize,
            color: selectedColor
        }
        addToCart(cartItem);
        setMessage('Product added to cart');
        setTimeout(() => setMessage(''), 2000);
    };

    const handleBuyNow = () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            size: selectedSize,
            color: selectedColor
        }
        addToCart(cartItem);
        navigate('/checkout');
    }

    return (
        <div>
            <AppBanner/>
                <div className="product-detail">
                <div className="product-images">
                    <img src={selectedImage} alt={product.name} className="main-image" />
                    <div className="image-container">
                        {product.images && product.images.map((img, index) => (
                            <img
                                key={index}
                                className="image-thumbnail"
                                src={img}
                                alt={`${product.name} view ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="price">{product.price}</p>
                    <p className="tax">Tax included.</p>

                    <div className="option">
                        <label>Color</label>
                        <div className="button-container">
                            {product.colors && product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedColor(color)}
                                    className={selectedColor === color ? 'selected' : ''}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="option">
                        <label>Size</label>
                        <div className="button-container">
                            {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                                <button
                                    key={size}
                                    className={selectedSize === size ? "selected" : ""}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="quantity">
                        <button onClick={() => handleQuantityChange("decrease")}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => handleQuantityChange("increase")}>+</button>
                    </div>

                    <div className="buttons">
                        <button 
                            className="add-to-cart"
                            onClick={handleAddToCart}
                            >
                                Add to cart
                            </button>
                        <button 
                            className="buy-now"
                            onClick={handleBuyNow}
                            >
                                Buy it now
                            </button>
                        {message && <p className="cart-message">{message}</p>}
                    </div>

                    <div className="size-table">
                        <h3>Size table</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>EU</th><th>S</th><th>M</th><th>L</th><th>XL</th><th>2XL</th><th>3XL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Length</td><td>38</td><td>40</td><td>42</td><td>44</td><td>46</td><td>46</td>
                                </tr>
                                <tr>
                                    <td>Chest</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td>
                                </tr>
                                <tr>
                                    <td>Sleeve</td><td>7</td><td>7.5</td><td>8</td><td>8.5</td><td>9</td><td>9.5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;