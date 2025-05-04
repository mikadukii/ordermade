import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Alert from '../components/Alert.jsx'; // Ensure the correct path to the Alert component

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const tempCredentials = sessionStorage.getItem('tempCredentials');
        if (tempCredentials) {
            const credentials = JSON.parse(tempCredentials);
            setFormData(credentials);
            sessionStorage.removeItem('tempCredentials');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', formData);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.role);

                if (response.data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    const intendedPath = localStorage.getItem('intendedPath') || '/home';
                    localStorage.removeItem('intendedPath');
                    navigate(intendedPath);
                }
            }
        } catch (error) {
            setMessage({
                type: 'error',
                content: error.response?.data?.message || 'Login failed'
            });
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-green-500" data-testid="login-page">
            <div className="relative z-10 max-w-md mx-auto w-full">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900" data-testid="login-title">
                            Welcome back to Ordermade
                        </h1>
                    </div>

                    {message.content && (
                        <Alert type={message.type} message={message.content} />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                placeholder="Enter your email"
                                data-testid="email-input"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                    transition-all duration-200"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                placeholder="Enter your password"
                                data-testid="login-password-input"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                    transition-all duration-200"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            data-testid="login-submit"
                            className="w-full py-2.5 bg-green-500 text-white font-semibold rounded-lg 
                                hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 
                                focus:ring-offset-2 transition-all duration-200"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <p className="text-sm text-gray-600">
                            Don't have an account? 
                            <Link to="/register" className="text-green-500 hover:underline" 
                                data-testid="register-link">
                                Registration Here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center text-gray-500 text-xs mt-4">
                    Ordermade - fashion based application for customized experience and connect with fashion designers<br />
                    this website still in work in progress
                </div>
            </div>
        </div>
    );
};

export default Login;
