import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Home from './components/pages/homePage/Home';
import ProductPage from './components/pages/productPage/productPage';
import ProductDetail from './components/pages/productDetail/productDetail';
import SearchResults from './components/pages/searchResults/searchResults';
import Cart from './components/pages/cartPage/cartPage';
import Checkout from './components/pages/checkoutPage/checkoutPage';
import Register from './components/pages/registerPage/registerPage';
import Login from './components/pages/loginPage/loginPage';
import Orders from './components/pages/ordersPage/ordersPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<ProductPage />} />
        <Route path="/product/:productName" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;
