import React from 'react';
import { Navigate } from 'react-router-dom';

import Loader from './Loader';
import { useIsUserAuth } from '../app/hooks';

type ProtectedRouteProps = {
  children: React.ReactElement,
  redirect?: string,
} & typeof defaultProps;

const defaultProps = {
  redirect: '/',
};

function ProtectedRoute({ children, redirect }: ProtectedRouteProps) {
  const isAuth: boolean | null = useIsUserAuth();

  if (!isAuth) {
    return <Navigate to={redirect} replace />;
  }

  if (isAuth) {
    return children;
  }

  return (<Loader />);
}

ProtectedRoute.defaultProps = defaultProps;
export default ProtectedRoute;
