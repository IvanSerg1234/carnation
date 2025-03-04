import React from 'react';

import AppBanner from '../../appBanner/appBanner';
import ProductList from '../../productList/productList';

import './Home.scss';

const Home = () => {

    return (
        <div className="container">
            <AppBanner />
            <section className="hero">
                <img src="/img/body_car.jpg" alt="Hero" className="hero-image" />
                <div className="hero-text">Appreciate the uniqueness, <br /> It lives within you.</div>
            </section>

            <ProductList category="topProducts" />
            <ProductList category="tshirts" />
            <ProductList category="hoodies" />
        </div>

    )
}

export default Home;