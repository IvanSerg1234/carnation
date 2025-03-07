import {FaSearch, FaShoppingCart, FaUser} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {getCurrentUser, logoutUser} from '../../data/auth';

import './appBanner.scss';

const AppBanner = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    }

    return (
        <div className="container">
            <header className="header">
                <Link to="/" className="logo">
                    <img src="/img/carshirts_logo1.png" alt="logo" />
                    CarShirts
                </Link>
                <div className="search-bar">
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" className="search-icon">
                            <FaSearch />
                        </button>
                    </form>
                </div>
                <div className="icons">
                    <Link to="/cart">
                        <FaShoppingCart className="icon" />
                    </Link>
                    {currentUser ? (
                        <>
                            <Link to="/orders">
                                <FaUser className="icon"/>
                            </Link>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </>
                    ) : (
                        <Link to="/login">
                            <FaUser className="icon"/>
                        </Link>
                    )}
                </div>
            </header>
        </div>
    )
}

export default AppBanner;