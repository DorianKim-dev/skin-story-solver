import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-glass">
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;