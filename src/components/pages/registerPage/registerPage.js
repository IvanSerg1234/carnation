import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AppBanner from '../../appBanner/appBanner';
import './registerPage.scss';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setErrorMessage(data.error || 'Failed to register');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="container">
            <AppBanner/>
            <div className="register-page">
                <h2>Registration</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@gmail.com"
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
                            placeholder="Enter your password"
                            required
                            />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                            />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="button view-all">Register</button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;