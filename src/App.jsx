// src/App.jsx
// BRANCH: feat/supabase-client (Gabriel B. Antonino — M3)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/routing/ProtectedRoute.jsx';
import { AppShell } from './components/layout/AppShell.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import AuthCallback from './pages/auth/AuthCallback.jsx';

import CustomerList from './pages/customers/CustomerList.jsx';
import CustomerDetail from './pages/customers/CustomerDetail.jsx';
import Reports from './pages/reports/Reports.jsx';
import Admin from './pages/admin/Admin.jsx';
import DeletedItems from './pages/deleted/DeletedItems.jsx';

import { ROUTES } from './utils/constants.js';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to={ROUTES.CUSTOMERS} replace />} />
              <Route path={ROUTES.CUSTOMERS} element={<CustomerList />} />
              <Route path={ROUTES.CUSTOMER_DETAIL} element={<CustomerDetail />} />
              <Route path={ROUTES.REPORTS} element={<Reports />} />
              <Route path={ROUTES.ADMIN} element={<Admin />} />
              <Route path={ROUTES.DELETED_ITEMS} element={<DeletedItems />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.CUSTOMERS} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
