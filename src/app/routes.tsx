import { Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import Loader from 'components/Loader';
import NotFoundPage from 'pages/404NotFoundPage';
import WithSubMenu from '../components/WithSubMenu';

const CustomerLayout = React.lazy(() => import('parts/layout/CustomerLayout'));
const PublicLayout = React.lazy(() => import('parts/layout/PublicLayout'));
const ProtectedRoute = React.lazy(() => import('components/ProtectedRoute'));

const CustomerHomeIndexPage = React.lazy(() => import('pages/customer/za/HomeZAPage'));
const ReconciliationIndexPage = React.lazy(() => import('pages/customer/reconciliation/ReconciliationPage'));
const Reconciliation2AIndexPage = React.lazy(() => import('pages/customer/reconciliation/2a/Reconciliation2APage'));
const ReconciliationQrIndexPage = React.lazy(() => import('pages/customer/reconciliation/qr/ReconciliationQrPage'));
const ReconciliationPrIndexPage = React.lazy(() => import('pages/customer/reconciliation/pr/ReconciliationPrPage'));
const AdminIndexPage = React.lazy(() => import('pages/customer/admin/AdminPage'));
const NotificationsIndexPage = React.lazy(() => import('pages/customer/notifications/NotificationsPage'));
const ProfileIndexPage = React.lazy(() => import('pages/customer/profile/ProfilePage'));
const CompaniesIndexPage = React.lazy(() => import('pages/customer/admin/companies/CompaniesPage'));
const FilesIndexPage = React.lazy(() => import('pages/customer/admin/files/FilesPage'));
const CommentsIndexPage = React.lazy(() => import('pages/customer/admin/comments/CommentsPage'));
const WorkspacesIndexPage = React.lazy(() => import('pages/customer/workspaces/WorkspacesPage'));
const SignInIndexPage = React.lazy(() => import('pages/public/auth/SignInPage'));
const AuthHandlerProcessorIndexPage = React.lazy(() => import('pages/public/auth/AuthHandlerProcessorPage'));
const AuthLogoutProcessorIndexPage = React.lazy(() => import('pages/public/auth/AuthLogoutProcessorPage'));
const QRHelper = React.lazy(() => import('pages/public/qr-helper/Import'));

const RolesPage = React.lazy(() => import('pages/customer/admin/roles/Page'));
const UsersPage = React.lazy(() => import('pages/customer/admin/users/Page'));

const routes: any = [

  // Auth handler
  {
    element: (<Suspense fallback={<Loader />}><PublicLayout /></Suspense>),
    path: 'auth',
  },
  {
    path: '/auth/handler',
    element: <Suspense fallback={<Loader />}><AuthHandlerProcessorIndexPage /></Suspense>,
  },
  {
    path: '/auth/logout',
    element: <Suspense fallback={<Loader />}><AuthLogoutProcessorIndexPage /></Suspense>,
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

  {
    path: '/qr-helper',
    element: (<Suspense fallback={<Loader />}><QRHelper /></Suspense>),
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
            element: <WithSubMenu subMenuItems={[
              {
                path: '/customer/reconciliation',
                text: 'Reconciliation',
              },
              {
                path: '/customer/reconciliation/2a',
                text: '2A',
              },
              {
                path: '/customer/reconciliation/qr',
                text: 'QR',
              },
              {
                path: '/customer/reconciliation/pr',
                text: 'PR',
              },
            ]}
            />,
            children: [
              {
                path: '',
                element: <Suspense fallback={<Loader />}><ReconciliationIndexPage /></Suspense>,
              },
              {
                path: '2a',
                element: <Suspense fallback={<Loader />}><Reconciliation2AIndexPage /></Suspense>,
              },
              {
                path: 'qr',
                element: <Suspense fallback={<Loader />}><ReconciliationQrIndexPage /></Suspense>,
              },
              {
                path: 'pr',
                element: <Suspense fallback={<Loader />}><ReconciliationPrIndexPage /></Suspense>,
              },
            ],
          },
          {
            path: 'admin',
            element: <WithSubMenu subMenuItems={[
              {
                path: '/customer/admin/companies',
                text: 'Companies',
                icon: 'fa-solid fa-building',
              },
              {
                path: '/customer/admin/files',
                text: 'Files',
                icon: 'fa-solid fa-file-arrow-up',
              },
              {
                path: '/customer/admin/comments',
                text: 'Comments',
                icon: 'fa-solid fa-file-arrow-up',
              },
              {
                path: '/customer/admin/roles',
                text: 'Roles',
                icon: 'fa-solid fa-flag',
              },
              {
                path: '/customer/admin/users',
                text: 'Users',
                icon: 'fa-solid fa-users',
              },
            ]}
            />,
            children: [
              {
                path: '',
                element: <Suspense fallback={<Loader />}><AdminIndexPage /></Suspense>,
              },
              {
                path: 'companies',
                element: <Suspense fallback={<Loader />}><CompaniesIndexPage /></Suspense>,
              },
              {
                path: 'files',
                element: <Suspense fallback={<Loader />}><FilesIndexPage /></Suspense>,
              },
              {
                path: 'comments',
                element: <Suspense fallback={<Loader />}><CommentsIndexPage /></Suspense>,
              },
              {
                path: 'roles',
                element: <Suspense fallback={<Loader />}><RolesPage /></Suspense>,
              },
              {
                path: 'users',
                element: <Suspense fallback={<Loader />}><UsersPage /></Suspense>,
              },
            ],
          },
          {
            path: 'workspaces',
            element: <Suspense fallback={<Loader />}><WorkspacesIndexPage /></Suspense>,
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
