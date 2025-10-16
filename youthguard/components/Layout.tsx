import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isOpen={true} toggleSidebar={() => {}} />
      <div className="flex flex-col flex-grow">
        <div className="fade-in">
          <Header />
        </div>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 slide-up ml-64">
          {children}
        </main>
        <footer className="bg-white shadow-sm py-4 sm:py-6 mt-8 transition-all duration-300 hover:shadow-md ml-64 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-xs sm:text-sm dark:text-gray-400">
            &copy; {new Date().getFullYear()} YouthGuard. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;