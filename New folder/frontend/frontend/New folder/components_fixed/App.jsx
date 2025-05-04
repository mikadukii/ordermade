import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import RequestForms from './pages/requestForms';
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx'; // Correct import for Dashboard
import CreateServices from './pages/admin/CreateServices';
import EditServices from './pages/admin/EditServices';
import AddPortfolio from './pages/admin/AddPortfolio';
import EditPortfolio from './pages/admin/EditPortfolio';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import './index.css';  // or './global.css' if you're using that

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin" 
      element={
        <AdminRoute>
          <AdminLayout /> {/* Use AdminLayout here */}
        </AdminRoute>
      } 
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} /> {/* Use AdminDashboard here */}
        <Route path="create-services" element={<CreateServices />} />
        <Route path="edit-services" element={<EditServices />} />
        <Route path="add-portfolio" element={<AddPortfolio />} />
        <Route path="edit-portfolio" element={<EditPortfolio />} />
      </Route>

      {/* Protected Routes */}
      <Route 
        path ="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<HomePage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="request-forms" element={<RequestForms />} />

        <Route 
          index
          element={
            role === 'admin' 
            ? <Navigate to="/admin/admindashboard" replace /> 
            : <Navigate to="/home" replace />
          }
        />

      {/* Redirect to home after login */}
        <Route index element={<Navigate to="/home" replace />} />
      </Route>

      {/* Default redirect */}
      <Route 
        path="*"
        element={token ? (
          role === 'admin' ? <Navigate to = "/admin/admindashboard" replace />
          : <Navigate to = "/home" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      }
      />
    </Routes>
  );
}

export default App;


{/* To do:
    remove admin route first should redirect to login let's say it was designer dashboard
    dashboard consisting of adding services and portfolio
    
  
  */}