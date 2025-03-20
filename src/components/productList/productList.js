import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import './productList.scss';

const BASE_URL = 'http://localhost:3000';

const ProductList = ({ category }) => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        
        const url = category === 'topProducts'
            ? `${BASE_URL}/products`
            : `${BASE_URL}/products/category/${category}`;

        const fetchProducts = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProductList(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);
    
    if (loading) {
        return <Spinner />;
    }

    return (
        <section className="products">
            <h2>{category === 'topProducts' ? 'Top Products' : category === 'hoodies' ? 'Hoodies' : 'T-shirts'}</h2>
            <div className="product-grid">
                {productList.slice(0, 4).map((product) => {
                    return (
                        <Link to={`/product/${product.name}`} key={product.id} className="product-card">
                            <img src={product.image || '/placeholder.jpg'} alt={product.name} />
                            <p className="product-name">{product.name}</p>
                            <p className="product-price">{product.price}</p>
                        </Link>
                    );
                })}
            </div>
            <div className="button">
                <Link to={`/category/${category}`} className="view-all">View all</Link>
            </div>
        </section>
    );
};

export default ProductList;