import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid } from '../../utils/jwt-helper';

const ProtectedRoute = ({ children, roles = [] }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userState.userInfo);

  useEffect(() => {
    console.log("ProtectedRoute User Data:", user); // Logowanie danych użytkownika

    if (!user || Object.keys(user).length === 0) {
      console.warn("User data not loaded yet. Waiting...");
      return;
    }

    if (!isTokenValid()) {
      console.error('Token is invalid or expired. Redirecting to login...');
      navigate('/v1/login');
    } else if (roles.length > 0) {
      const userRole = user?.roles?.[0] ?? null; // Pobieramy pierwszą rolę
      console.log("ProtectedRoute User Role:", userRole);

      if (!roles.includes(userRole)) {
        console.warn(`User role "${userRole}" does not have access. Redirecting...`);
        navigate('/');
      }
    }
  }, [navigate, roles, user]);

  if (!user || Object.keys(user).length === 0) {
    return <div>Loading...</div>; // Obsługa ładowania
  }

  return <>{children}</>;
};

export default ProtectedRoute;
