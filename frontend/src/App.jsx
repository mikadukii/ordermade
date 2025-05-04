import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import MyOrders from './pages/MyOrders.jsx';
import HomePage from './pages/HomePage.jsx';
import OrderServices from './pages/OrderServices.jsx'; // ✅ NEW
import './index.css';

const App = () => {
  const isRegistered = !!localStorage.getItem('token'); // safer boolean

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="services" element={<Services />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="homePage" element={<HomePage />} />
      <Route path="my-orders" element={<MyOrders />} />

      {/* ✅ Add this route for ordering services */}
      <Route
        path="order-services/:id"
        element={
          <ProtectedRoute>
            <OrderServices />
          </ProtectedRoute>
        }
      />

      {/* Redirect to homePage */}
      <Route index element={<Navigate to="/homePage" replace />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to={isRegistered ? "/profile" : "/login"} replace />} />
    </Routes>
  );
};

export default App;
