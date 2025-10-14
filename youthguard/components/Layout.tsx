
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white shadow-sm py-4 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} YouthGuard. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
