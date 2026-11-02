import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PhoneOtpModal } from './components/auth/PhoneOtpModal';
import { OrderBookingModal } from './components/customer/OrderBookingModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

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
  const location = useLocation();

  // If URL has ?auth=login, open auth modal
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auth') === 'login') {
      setAuthModalOpen(true);
    }
  }, [location.search]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF3DD] text-[#553322]">
      {/* Show Public Navbar & Footer only on non-admin routes */}
      {!isAdminRoute && (
        <Navbar
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onOpenOrderModal={() => setOrderModalOpen(true)}
        />
      )}

      {/* Main Content Viewport */}
      <div className="flex-1">
        <Routes>
          {/* Public Storefront Routes */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenOrderModal={() => setOrderModalOpen(true)}
                onOpenAuthModal={() => setAuthModalOpen(true)}
              />
            }
          />
          <Route
            path="/about"
            element={<AboutPage onOpenOrderModal={() => setOrderModalOpen(true)} />}
          />
          <Route
            path="/our-poornalu"
            element={<OurPoornaluPage onOpenOrderModal={() => setOrderModalOpen(true)} />}
          />
          <Route path="/contact" element={<ContactPage />} />

          {/* Customer Authenticated Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboardPage onOpenOrderModal={() => setOrderModalOpen(true)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={<Navigate to="/customer/dashboard" replace />}
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="pricing" element={<AdminProductsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Public Footer */}
      {!isAdminRoute && <Footer />}

      {/* Global Modals */}
      <PhoneOtpModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          // If customer initiated order before login, optionally open order modal
        }}
      />

      <OrderBookingModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
};
