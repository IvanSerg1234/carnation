import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import {topProducts, tshirts, hoodies} from '../../data/products';
import Spinner from '../spinner/Spinner';
import './productList.scss';

const ProductList = ({category}) => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (category === 'topProducts') {
            setProductList(topProducts);
        } else if (category === 'tshirts') {
            setProductList(tshirts);
        } else if (category === 'hoodies') {
            setProductList(hoodies);
        }
        setLoading(false);
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
                            <Link to={`/product/${category}/${product.id}`} key={product.id} className="product-card">
                                <img src={product.image} alt={product.name} />
                                <p className="product-name">{product.name}</p>
                                <p className="product-price">{product.price}</p>
                            </Link>
                        );
                    })}
                </div>
                <div className="button">
                    <Link to={`/productPage/${category}`} className="view-all">View all</Link>
                </div>
            </section>
    )
};

export default ProductList;