import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 'male',
        location: {
            state: '',
            city: ''
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Handle nested location fields
        if (name.startsWith('location.')) {
            const locationField = name.split('.')[1];
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    [locationField]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Format date of birth if provided
        const userData = {
            ...formData,
            dateOfBirth: formData.dateOfBirth || new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]
        };
        
        const success = await register(userData);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                     <svg className="h-12 w-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
                    </svg>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold font-heading text-text-primary">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-blue-700">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">First Name</label>
                                <input 
                                    name="firstName" 
                                    type="text" 
                                    required 
                                    value={formData.firstName}
                                    onChange={handleChange} 
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Last Name</label>
                                <input 
                                    name="lastName" 
                                    type="text" 
                                    required 
                                    value={formData.lastName}
                                    onChange={handleChange} 
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Email address</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                value={formData.email}
                                onChange={handleChange} 
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Phone Number</label>
                            <input 
                                name="phoneNumber" 
                                type="tel" 
                                required 
                                value={formData.phoneNumber}
                                onChange={handleChange} 
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Date of Birth</label>
                                <input 
                                    name="dateOfBirth" 
                                    type="date" 
                                    value={formData.dateOfBirth}
                                    onChange={handleChange} 
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Gender</label>
                                <select 
                                    name="gender" 
                                    value={formData.gender}
                                    onChange={handleChange} 
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">State</label>
                                <input 
                                    name="location.state" 
                                    type="text" 
                                    required 
                                    value={formData.location.state}
                                    onChange={handleChange} 
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">City</label>
                                <input 
                                    name="location.city" 
                                    type="text" 
                                    required 
                                    value={formData.location.city}
                                    onChange={handleChange} 
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                required 
                                value={formData.password}
                                onChange={handleChange} 
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                            />
                        </div>
                        
                        <div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;