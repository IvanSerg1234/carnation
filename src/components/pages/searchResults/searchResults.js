import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AppBanner from '../../appBanner/appBanner';
import '../../productList/productList.scss';

const SearchResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/search?q=${searchQuery}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setFilteredProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (searchQuery) {
            fetchFilteredProducts();
        }
    }, [searchQuery]);

    return (
        <div>
            <AppBanner />
            <div className="product-page">
                <section id="top" className="products">
                    <h2>Search Results for "{searchQuery}"</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="product-grid">
                            {filteredProducts.map((product) => {
                                if (!product.name || !product.image) return null;
                                return (
                                    <Link to={`/product/${product.name}`} key={product.id} className="product-card">
                                        <img src={product.image} alt={product.name} />
                                        <p className="product-name">{product.name}</p>
                                        <p className="product-price">{product.price}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No products found.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default SearchResults;