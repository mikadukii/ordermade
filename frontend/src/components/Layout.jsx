// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-Green-50">
      
      <div className="flex-1 ml-64"> {/* Adjust the margin to accommodate the sidebar */}
        <main className="p-8">
          <Outlet /> {/* This will render the child routes */}
        </main>
      </div>
    </div>
  );
};

export default Layout;