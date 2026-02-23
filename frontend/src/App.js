import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';


// Home page
import Home from './pages/Home';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer pages
import Products from './pages/customer/Products';
import BookService from './pages/customer/BookService';
import BookingHistory from './pages/customer/BookingHistory';
import Enquiry from './pages/customer/Enquiry';
import Cart from './pages/customer/Cart';


// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProducts from './pages/owner/OwnerProducts';
import OwnerBookings from './pages/owner/OwnerBookings';
import OwnerEnquiries from './pages/owner/OwnerEnquiries';
import OwnerOrders from './pages/owner/OwnerOrders';
import OwnerBilling from './pages/owner/OwnerBilling';



// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBookings from './pages/admin/AdminBookings';
import AdminEnquiries from './pages/admin/AdminEnquiries';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/customer/products" element={<ProtectedRoute roles={['customer']}><Products /></ProtectedRoute>} />
            <Route path="/customer/book" element={<ProtectedRoute roles={['customer']}><BookService /></ProtectedRoute>} />
            <Route path="/customer/history" element={<ProtectedRoute roles={['customer']}><BookingHistory /></ProtectedRoute>} />
            <Route path="/customer/enquiry" element={<ProtectedRoute roles={['customer']}><Enquiry /></ProtectedRoute>} />
            <Route path="/customer/cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />

            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/owner/products" element={<ProtectedRoute roles={['owner']}><OwnerProducts /></ProtectedRoute>} />
            <Route path="/owner/bookings" element={<ProtectedRoute roles={['owner']}><OwnerBookings /></ProtectedRoute>} />
            <Route path="/owner/orders" element={<ProtectedRoute roles={['owner']}><OwnerOrders /></ProtectedRoute>} />
            <Route path="/owner/billing" element={<ProtectedRoute roles={['owner']}><OwnerBilling /></ProtectedRoute>} />
            <Route path="/owner/enquiries" element={<ProtectedRoute roles={['owner']}><OwnerEnquiries /></ProtectedRoute>} />

            {/* Admin Routes */}

            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/enquiries" element={<ProtectedRoute roles={['admin']}><AdminEnquiries /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;
