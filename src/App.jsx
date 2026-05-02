// feat/routing-skeleton — M1: Christian Adlawan
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Pages
import LoginPage         from './pages/auth/LoginPage';
import RegisterPage      from './pages/auth/RegisterPage';
import AuthCallbackPage  from './pages/auth/AuthCallbackPage';
import DashboardPage     from './pages/dashboard/DashboardPage';
import CustomerListPage  from './pages/customers/CustomerListPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import ProductCataloguePage from './pages/products/ProductCataloguePage';
import ReportsPage       from './pages/reports/ReportsPage';
import AdminPage         from './pages/admin/AdminPage';
import DeletedItemsPage  from './pages/deleted/DeletedItemsPage';

import { ROLES, ROUTES } from './utils/constants';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserRightsProvider>
          <Routes>
            {/* Public */}
            <Route path={ROUTES.LOGIN}         element={<LoginPage />} />
            <Route path={ROUTES.REGISTER}      element={<RegisterPage />} />
            <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />

          {/* Protected — authenticated users */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path={ROUTES.DASHBOARD}              element={<DashboardPage />} />
            <Route path={ROUTES.CUSTOMERS}              element={<CustomerListPage />} />
            <Route path="/customers/:custno"             element={<CustomerDetailPage />} />
            <Route path={ROUTES.PRODUCTS}               element={<ProductCataloguePage />} />
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
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
        </UserRightsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
