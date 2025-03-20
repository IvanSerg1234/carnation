import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import AppBanner from '../../appBanner/appBanner';
import Spinner from '../../spinner/Spinner';
import './productPage.scss';

const ProductPage = () => {
    const { category } = useParams();
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');

        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/category/${category}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProductList(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    if (loading) {
        return <Spinner />;
    }
    
    if (error) {
        return <div className="error-message">{error}</div>
    }

    return (
        <div className="product-page">
            <AppBanner />
            <section id="top" className="products">
                <h2>
                    {category === 'topProducts' ? 'Top Products' : 
                    category === 'hoodies' ? 'Hoodies' : 
                    category === 'tshirts' ? 'T-shirts' : 'Category Not Found'}
                </h2>
                <div className="product-grid">
                    {productList.map((product) => {
                        return (
                            <Link to={`/product/${product.name}`} key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} />
                                <p className="product-name">{product.name}</p>
                                <p className="product-price">{product.price}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    )
};

export default ProductPage;