import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';

import AppBanner from '../../appBanner/appBanner';
import {topProducts, tshirts, hoodies} from '../../../data/products';
import Spinner from '../../spinner/Spinner';
import './productPage.scss';

const ProductPage = () => {
    const {category} = useParams();
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Current category:', category);
        setLoading(true);
        let products = [];
        if (category === 'topProducts') {
            products = topProducts;
        } else if (category === 'tshirts') {
           products = tshirts;
        } else if (category === 'hoodies') {
            products = hoodies;
        }
        setProductList(products);
        setLoading(false);
    }, [category]);

    if (loading) {
        return <Spinner />;
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
                        <Link to={`/product/${category}/${product.id}`} key={product.id} className="product-card">
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