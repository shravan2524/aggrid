import React, { Suspense } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from 'react-router-dom';
import Loader from './components/Loader';
import NotFoundPage from './pages/404NotFoundPage';

const CustomerLayout = React.lazy(() => import('parts/layout/CustomerLayout'));

const CustomerHomeIndexPage = React.lazy(() => import('./pages/customer/za/HomeZAPage'));
const ReconciliationIndexPage = React.lazy(() => import('./pages/customer/reconciliation/ReconciliationPage'));
const AdminIndexPage = React.lazy(() => import('./pages/customer/admin/AdminPage'));
const NotificationsIndexPage = React.lazy(() => import('./pages/customer/notifications/NotificationsPage'));
const ProfileIndexPage = React.lazy(() => import('./pages/customer/profile/ProfilePage'));

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Supposed public routes .... */}
        <Route path="/">
          <Route index element={<Navigate to="/customer/dashboard" />} />
        </Route>

        {/* Supposed protected customer routes .... */}
        <Route path="/customer" element={(<Suspense fallback={<Loader />}><CustomerLayout /></Suspense>)}>
          <Route index element={<Navigate to="/customer/dashboard" />} />

          <Route path="dashboard" element={(<Suspense fallback={<Loader />}><CustomerHomeIndexPage /></Suspense>)} />
          <Route path="reconciliation" element={(<Suspense fallback={<Loader />}><ReconciliationIndexPage /></Suspense>)} />
          <Route path="admin" element={(<Suspense fallback={<Loader />}><AdminIndexPage /></Suspense>)} />
          <Route path="notifications" element={(<Suspense fallback={<Loader />}><NotificationsIndexPage /></Suspense>)} />
          <Route path="profile" element={(<Suspense fallback={<Loader />}><ProfileIndexPage /></Suspense>)} />

        </Route>

        {/* shared 4o4 page .... */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
