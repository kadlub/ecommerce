import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid } from '../../utils/jwt-helper';

const ProtectedRoute = ({ children, roles = [] }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.userState?.userInfo);

  useEffect(() => {
    console.log("ProtectedRoute User Data:", user);

    if (!isTokenValid()) {
      console.warn("Token jest nieprawidłowy lub wygasł. Przekierowanie na stronę logowania...");
      navigate('/v1/login');
      return;
    }

    if (!user || Object.keys(user).length === 0) {
      console.warn("Dane użytkownika jeszcze nie załadowane. Oczekiwanie...");
      return; // Nie rób nic, jeśli dane użytkownika nie zostały jeszcze załadowane
    }

    if (roles.length > 0) {
      const userRoles = user.roles || [];
      console.log("User roles:", userRoles, "Required roles:", roles);

      if (!roles.some(role => userRoles.includes(role))) {
        console.warn(`Użytkownik nie ma wymaganej roli: ${roles}. Przekierowanie na stronę główną...`);
        navigate('/');
      }
    }
  }, [navigate, roles, user]);

  return <>{children}</>;
};

export default ProtectedRoute;
