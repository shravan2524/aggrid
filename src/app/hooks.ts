import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from 'state/store';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useIsUserAuth = (): boolean | null => {
  const isUserAuth = isAuthenticated();
  const [isAuth, setIsAuth] = useState<boolean | null>(isUserAuth);

  const location = useLocation();

  useEffect(() => {
    setIsAuth(isUserAuth);
  }, [location]);

  return isAuth;
};
