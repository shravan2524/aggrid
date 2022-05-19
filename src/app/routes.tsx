import { Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import Loader from 'components/Loader';
import NotFoundPage from 'pages/404NotFoundPage';

const CustomerLayout = React.lazy(() => import('parts/layout/CustomerLayout'));
const PublicLayout = React.lazy(() => import('parts/layout/PublicLayout'));
const ProtectedRoute = React.lazy(() => import('components/ProtectedRoute'));

const CustomerHomeIndexPage = React.lazy(() => import('pages/customer/za/HomeZAPage'));
const ReconciliationIndexPage = React.lazy(() => import('pages/customer/reconciliation/ReconciliationPage'));
const AdminIndexPage = React.lazy(() => import('pages/customer/admin/AdminPage'));
const NotificationsIndexPage = React.lazy(() => import('pages/customer/notifications/NotificationsPage'));
const ProfileIndexPage = React.lazy(() => import('pages/customer/profile/ProfilePage'));
const SignInIndexPage = React.lazy(() => import('pages/public/auth/SignInPage'));
const AuthHandlerProcessorIndexPage = React.lazy(() => import('pages/public/auth/AuthHandlerProcessorPage'));
const AuthLogoutProcessorIndexPage = React.lazy(() => import('pages/public/auth/AuthLogoutProcessorPage'));

const routes: any = [

  // Auth handler
  {
    element: (<Suspense fallback={<Loader />}><PublicLayout /></Suspense>),
    path: 'auth',
    children: [
      {
        path: 'handler',
        element: <Suspense fallback={<Loader />}><AuthHandlerProcessorIndexPage /></Suspense>,
      },

      {
        path: 'logout',
        element: <Suspense fallback={<Loader />}><AuthLogoutProcessorIndexPage /></Suspense>,
      },

    ],
  },

  // Supposed public routes ....
  {
    element: (<Suspense fallback={<Loader />}><PublicLayout /></Suspense>),
    children: [
      {
        path: '/',
        element: <Suspense fallback={<Loader />}><SignInIndexPage /></Suspense>,
      },
    ],
  },

  // Supposed protected customer routes ....
  {
    element: <Suspense fallback={<Loader />}><ProtectedRoute><CustomerLayout /></ProtectedRoute></Suspense>,
    children: [
      {
        path: 'customer',
        children: [
          {
            path: '',
            element: <Navigate to="/customer/dashboard" />,
          },
          {
            path: 'dashboard',
            element: <Suspense fallback={<Loader />}><CustomerHomeIndexPage /></Suspense>,
          },
          {
            path: 'reconciliation',
            element: <Suspense fallback={<Loader />}><ReconciliationIndexPage /></Suspense>,
          },
          {
            path: 'admin',
            element: <Suspense fallback={<Loader />}><AdminIndexPage /></Suspense>,
          },
          {
            path: 'notifications',
            element: <Suspense fallback={<Loader />}><NotificationsIndexPage /></Suspense>,
          },
          {
            path: 'profile',
            element: <Suspense fallback={<Loader />}><ProfileIndexPage /></Suspense>,
          },
        ],
      },
    ],
  },

  // shared 4o4 page ....
  {
    element: (<NotFoundPage />),
    path: '*',
  },

];

export default routes;
