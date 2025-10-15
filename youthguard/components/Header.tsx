import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserIcon, LogoutIcon, MessageIcon } from './icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
                </svg>
              <span className="font-heading font-bold text-xl text-text-primary">YouthGuard</span>
            </NavLink>
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
              <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
              <NavLink to="/jobs" className={navLinkClass}>Job Board</NavLink>
              <NavLink to="/progress" className={navLinkClass}>Progress</NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/messages" className="relative p-2 text-text-secondary hover:text-primary">
              <MessageIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                3
              </span>
            </NavLink>
            <span className="text-sm font-medium text-text-primary hidden md:inline">
              Welcome, {user?.firstName}
            </span>
            <div className="relative group">
              <button className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
                <UserIcon className="h-5 w-5" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto">
                <NavLink to="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100">My Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogoutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;