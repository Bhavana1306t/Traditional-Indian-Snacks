
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PhoneOtpModal } from './components/auth/PhoneOtpModal';
import { OrderBookingModal } from './components/customer/OrderBookingModal';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

import { useAuth } from './context/AuthContext';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { OurPoornaluPage } from './pages/OurPoornaluPage';
import { ContactPage } from './pages/ContactPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false);

  const { user, isLoading } = useAuth();

  const location = useLocation();

  // Open order modal for logged-in users.
  // Ask guests to log in first.
  const handleOpenOrderModal = () => {
    if (isLoading) return;

    if (user) {
      setOrderModalOpen(true);
    } else {
      setPendingOrder(true);
      setAuthModalOpen(true);
    }
  };

  // Open login modal when URL contains ?auth=login
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('auth') === 'login') {
      setAuthModalOpen(true);
    }
  }, [location.search]);

  // After successful login or registration,
  // continue the pending order.
  const handleAuthSuccess = () => {
    setAuthModalOpen(false);

    if (pendingOrder) {
      setPendingOrder(false);
      setOrderModalOpen(true);
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF3DD] text-[#553322]">

      {/* Public Navbar */}
      {!isAdminRoute && (
        <Navbar
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onOpenOrderModal={handleOpenOrderModal}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        <Routes>

          {/* Public Storefront Routes */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenOrderModal={handleOpenOrderModal}
                onOpenAuthModal={() => setAuthModalOpen(true)}
              />
            }
          />

          <Route
            path="/about"
            element={
              <AboutPage
                onOpenOrderModal={handleOpenOrderModal}
              />
            }
          />

          <Route
            path="/our-poornalu"
            element={
              <OurPoornaluPage
                onOpenOrderModal={handleOpenOrderModal}
              />
            }
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboardPage
                  onOpenOrderModal={handleOpenOrderModal}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer"
            element={
              <Navigate
                to="/customer/dashboard"
                replace
              />
            }
          />

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={<AdminLoginPage />}
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<AdminDashboardPage />}
            />

            <Route
              path="orders"
              element={<AdminOrdersPage />}
            />

            <Route
              path="customers"
              element={<AdminCustomersPage />}
            />

            <Route
              path="products"
              element={<AdminProductsPage />}
            />

            <Route
              path="pricing"
              element={<AdminProductsPage />}
            />

            <Route
              path="settings"
              element={<AdminSettingsPage />}
            />
          </Route>

          {/* Unknown Routes */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </div>

      {/* Footer */}
      {!isAdminRoute && <Footer />}

      {/* Authentication Modal */}
      <PhoneOtpModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Order Booking Modal */}
      <OrderBookingModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />

    </div>
  );
};
