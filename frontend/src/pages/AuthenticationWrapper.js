import React, { useEffect } from 'react';
import Navigation from '../components/Navigation/Navigation';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';
import { fetchUserData } from '../../node_modules/redux/src/actions';
import { fetchUserInfo } from '../api/userInfo';

const AuthenticationWrapper = () => {
  const isLoading = useSelector((state) => state?.commonState?.loading);
  const user = useSelector((state) => state?.userState?.userInfo); // Użyj userInfo zamiast user
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        console.log("AuthenticationWrapper User Info:", userInfo); // Logowanie danych
        dispatch({ type: 'SET_USER', payload: userInfo });
      } catch (err) {
        console.error('Error fetching user info:', err);
        navigate('/v1/login'); // Przekierowanie na stronę logowania w razie błędu
      }
    };

    if (!user) {
      loadUserInfo();
    }
  }, [dispatch, navigate, user]);

  return (
    <div>
      <Navigation variant="auth" />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full flex justify-center py-4">
          <div className="w-full max-w-md">
            {isLoading ? <Spinner /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
