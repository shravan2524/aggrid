import React, { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { logOut, setAccessToken, setUserDetailsToLocal } from 'services/authService';
import { Navigate } from 'react-router-dom';
import { fetchUserMeData } from 'services/userAPIService';

export default function AuthLogoutProcessorPage() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    logOut();
    setRedirectTo('/');
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (<Loader />);
}
