import React from 'react';
import { useIsUserAuth } from '../app/hooks';

type HideOnAuthProps = {
  children: React.ReactElement,
};
export default function HideOnAuth({ children }:HideOnAuthProps) {
  const isUserAuth = useIsUserAuth();

  if (isUserAuth) {
    return null;
  }

  return children;
}
