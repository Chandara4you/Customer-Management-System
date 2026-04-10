// feat/routing-skeleton — M1: Christian Adlawan
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Pages
import LoginPage         from './pages/auth/LoginPage';
import RegisterPage      from './pages/auth/RegisterPage';
import AuthCallbackPage  from './pages/auth/AuthCallbackPage';
import CustomerListPage  from './pages/customers/CustomerListPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import ReportsPage       from './pages/reports/ReportsPage';
import AdminPage         from './pages/admin/AdminPage';
import DeletedItemsPage  from './pages/deleted/DeletedItemsPage';

import { ROLES, ROUTES } from './utils/constants';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path={ROUTES.LOGIN}         element={<LoginPage />} />
          <Route path={ROUTES.REGISTER}      element={<RegisterPage />} />
          <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />

          {/* Protected — authenticated users */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path={ROUTES.CUSTOMERS}              element={<CustomerListPage />} />
            <Route path="/customers/:custno"             element={<CustomerDetailPage />} />
            <Route path={ROUTES.REPORTS}                element={<ReportsPage />} />

            {/* ADMIN + SUPERADMIN only */}
            <Route path={ROUTES.DELETED}
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
                  <DeletedItemsPage />
                </ProtectedRoute>
              }
            />

            {/* SUPERADMIN only */}
            <Route path={ROUTES.ADMIN}
              element={
                <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.CUSTOMERS} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
