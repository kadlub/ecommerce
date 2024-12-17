import React from 'react';
import Navigation from '../components/Navigation/Navigation';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';

const AuthenticationWrapper = () => {
  const isLoading = useSelector((state) => state?.commonState?.loading);

  return (
    <div>
      <Navigation variant="auth" />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full flex justify-center py-4">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
        {isLoading && <Spinner />}
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
