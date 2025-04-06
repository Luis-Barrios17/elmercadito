import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/auth/Login'); // Redirige al login si no hay token
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;