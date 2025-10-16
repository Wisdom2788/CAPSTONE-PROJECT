import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  HomeIcon, 
  BookIcon, 
  BriefcaseIcon, 
  ChartIcon, 
  MessageIcon, 
  UserIcon, 
  LogoutIcon,
  SunIcon,
  MoonIcon
} from './icons';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void; // Make it optional since it's not used anymore
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '#', icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/courses', icon: <BookIcon className="h-5 w-5" />, label: 'Courses' },
    { to: '/jobs', icon: <BriefcaseIcon className="h-5 w-5" />, label: 'Job Board' },
    { to: '/progress', icon: <ChartIcon className="h-5 w-5" />, label: 'Progress' },
    { to: '/messages', icon: <MessageIcon className="h-5 w-5" />, label: 'Messages' },
    { to: '/profile', icon: <UserIcon className="h-5 w-5" />, label: 'Profile' },
  ];

  return (
    <>
      {/* Sidebar - always visible */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out h-screen translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">YG</span>
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">YouthGuard</span>
            </div>
            {/* Remove mobile close button since sidebar is always visible */}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:bg-gray-100 hover:text-primary'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Dark mode toggle and user info */}
          <div className="p-4 border-t">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-between w-full px-4 py-3 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="darkModeToggle"
                  id="darkModeToggle"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </button>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{user?.firstName}</p>
                  <p className="text-xs text-text-secondary">{user?.userType}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-text-secondary hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
              >
                <LogoutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;