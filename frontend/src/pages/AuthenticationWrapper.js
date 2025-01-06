import React, { useEffect } from 'react';
import Navigation from '../components/Navigation/Navigation';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../api/userInfo';
import { loadUserInfo } from '../store/features/user';

const AuthenticationWrapper = () => {
  const user = useSelector((state) => state?.userState?.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Sprawdzanie danych użytkownika...");
        const userInfo = await fetchUserInfo();
        console.log("Dane użytkownika załadowane:", userInfo);
        dispatch(loadUserInfo(userInfo));
      } catch (err) {
        console.error("Błąd podczas ładowania danych użytkownika:", err);
        navigate('/v1/login'); // Przekierowanie na stronę logowania w razie błędu
      }
    };

    // Załaduj dane użytkownika tylko, jeśli ich brak
    if (!user || Object.keys(user).length === 0) {
      loadUser();
    }
  }, [dispatch, navigate, user]);

  return (
    <div>
      <Navigation variant="auth" />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full flex justify-center py-4">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
