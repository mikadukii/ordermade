import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formsData, setFormsData] = useState({
        name: '',
        email: '',
        password: '',
        bustSize: '',
        waistSize: '',
        hipSize: ''    
    });
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', formsData);

            if (response.data.success) {
                setMessage({
                    type: 'success',
                    content: `Registration successful!\nEmail: ${response.data.user.email}\nPassword: ${formsData.password}\nPlease save these credentials for login.`
                    });
                
                sessionStorage.setItem('tempCredentials', JSON.stringify({
                    email: formsData.email,
                    password: formsData.password,
                }));

                setTimeout(() => {
                    navigate('/login');
                }, 5000); // Clear message after 5 seconds
            }
        } catch (error) {
            setMessage({
                type: 'error',
                content: error.response?.data?.message || 'Registration failed'
            });
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
            <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome to Ordermade</h1>
                    <p className="text-gray-600 text-lg mt-2">Create your account to get started</p>
                </div>

                {message.content && (
                    <Alert type={message.type} message={message.content} />
                )}

                <form onSubmit={handleSubmit} className="space-y-8" data-testid="register-form">
                    {/* Personal Information */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="username"
                                data-testid="username"
                                value={formsData.name}
                                onChange={(e) => setFormsData({ ...formsData, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                data-testid="email"
                                value={formsData.email}
                                onChange={(e) => setFormsData({ ...formsData, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                data-testid="password"
                                value={formsData.password}
                                onChange={(e) => setFormsData({ ...formsData, password: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Body measurements section */}
                        <div>
                            <label htmlFor="bustSize" className="block text-sm font-medium text-gray-700">Bust Size</label>
                            <input
                                type="text"
                                id="bustSize"
                                data-testid="bustSize"
                                value={formsData.bustSize}
                                onChange={(e) => setFormsData({ ...formsData, bustSize: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your bust size"
                            />
                        </div>

                        <div>
                            <label htmlFor="waistSize" className="block text-sm font-medium text-gray-700">Waist Size</label>
                            <input
                                type="text"
                                id="waistSize"
                                data-testid="waistSize"
                                value={formsData.waistSize}
                                onChange={(e) => setFormsData({ ...formsData, waistSize: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your waist size"
                            />
                        </div>

                        <div>
                            <label htmlFor="hipSize" className="block text-sm font-medium text-gray-700">Hip Size</label>
                            <input
                                type="text"
                                id="hipSize"
                                data-testid="hipSize"
                                value={formsData.hipSize}
                                onChange={(e) => setFormsData({ ...formsData, hipSize: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your hip size"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                            data-testid="register-submit"
                        >
                            Register
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account? 
                        <Link to="/login" className="text-indigo-500 hover:underline font-medium" data-testid="login-link">
                            Click here to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;