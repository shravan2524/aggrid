import React from 'react';
import { useIsUserAuth } from '../app/hooks';

type ShowOnAuthProps = {
  children: React.ReactElement,
};
export default function ShowOnAuth({ children }:ShowOnAuthProps) {
  const isUserAuth = useIsUserAuth();

  if (!isUserAuth) {
    return null;
  }

  return children;
}
