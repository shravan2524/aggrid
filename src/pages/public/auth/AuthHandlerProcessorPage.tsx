import React, { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import { setAccessToken, setUserDetailsToLocal } from 'services/authService';
import { Navigate } from 'react-router-dom';
import { fetchUserMeData } from 'services/userAPIService';
import { toast } from 'react-hot-toast';

export default function AuthHandlerProcessorPage() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    fetchUserMeData().then((data) => {
      setRedirectTo('/customer');
      setUserDetailsToLocal(data);
      setAccessToken('ACCESS_TOKEN_HERE');
    }).catch(() => {
      toast.error("You don't have access to this resources.");
      setRedirectTo('/auth/logout');
    });
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (<Loader />);
}
