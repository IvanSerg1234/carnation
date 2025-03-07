import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {loginUser} from '../../../data/auth';
import AppBanner from '../../appBanner/appBanner';

import './loginPage.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (loginUser(email, password)) {
            navigate('/orders');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="container">
            <AppBanner/>
            <div className="login">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                    </div>
                    <button type="submit" className="button view-all">Log in</button>
                </form>
            </div>
        </div>
    );
};

export default Login;