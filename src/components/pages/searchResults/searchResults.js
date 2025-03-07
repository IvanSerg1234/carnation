import React, {useState, useEffect} from 'react';
import {useLocation, Link} from 'react-router-dom';

import AppBanner from '../../appBanner/appBanner';
import {products} from '../../../data/products';
import '../../productList/productList.scss';

const SearchResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const results = products.filter((product) => {
            return product.name.toLowerCase().includes(searchQuery.toLowerCase())
        });
        setFilteredProducts(results);
    }, [searchQuery]);

    return (
        <div>
            <AppBanner />
                <div className="product-page">
                    <section id="top" className="products">
                        <h2>Search Results for "{searchQuery}"</h2>
                        {filteredProducts.length > 0 ? (
                            <div className="product-grid">
                            {filteredProducts.map((product) => {
                                console.log(product.category, product.id);
                                if (!product.name || !product.image) return null;
                                return (
                                    <Link to={`/product/${product.name}`} key={`${product.id}-${product.category}`} className="product-card">
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