import React, { useCallback, useState } from 'react';
import GoogleSignIn from '../../components/Buttons/GoogleSignIn';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { loginAPI } from '../../api/authentication';
import { saveToken } from '../../utils/jwt-helper';

const Login = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');
      dispatch(setLoading(true));
      loginAPI(values)
        .then((res) => {
          if (res?.token) {
            saveToken(res?.token);
            navigate('/');
          } else {
            setError('Something went wrong!');
          }
        })
        .catch((err) => {
          setError('Invalid Credentials!');
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, navigate, values]
  );

  const handleOnChange = useCallback((e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target?.value,
    }));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full mt-[-30vh]">
      <div className="px-8 w-full max-w-md">
        <p className="text-3xl font-bold pb-4 pt-4 text-center">Zaloguj się</p>
        <GoogleSignIn />
        <p className="text-gray-500 items-center text-center w-full py-2">Lub</p>
        <div className="pt-4">
          <form onSubmit={onSubmit}>
            <input
              type="username"
              name="username"
              value={values?.username}
              onChange={handleOnChange}
              placeholder="Nazwa użytkownika"
              className="h-[48px] w-full border p-2 border-gray-400 mb-4"
              required
            />
            <input
              type="password"
              name="password"
              value={values?.password}
              onChange={handleOnChange}
              placeholder="Hasło"
              className="h-[48px] w-full border p-2 border-gray-400 mb-4"
              required
              autoComplete="new-password"
            />
            <Link
              to="/forgot-password"
              className="text-right w-full float-right underline pt-2 text-gray-500 hover:text-black"
            >
              Zapomniałeś hasła?
            </Link>
            <button className="border w-full rounded-lg h-[48px] mb-4 bg-black text-white mt-4 hover:opacity-80">
              Zaloguj się
            </button>
          </form>
        </div>
        {error && <p className="text-lg text-red-700 text-center">{error}</p>}
        <Link to="/v1/register" className="underline text-gray-500 hover:text-black text-center">
          Nie masz konta? Zarejestruj się!
        </Link>
      </div>
    </div>
  );
};

export default Login;
