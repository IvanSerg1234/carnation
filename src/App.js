import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Home from './components/pages/homePage/Home';
import ProductPage from './components/pages/productPage/productPage';
import ProductDetail from './components/pages/productDetail/productDetail';
import SearchResults from './components/pages/searchResults/searchResults';
import Cart from './components/pages/cartPage/cartPage';
import Checkout from './components/pages/checkoutPage/checkoutPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productPage/:category" element={<ProductPage />} />
        <Route path="/product/:category/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
