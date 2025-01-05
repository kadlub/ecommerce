import React, { useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { fetchUserDetails } from "../../api/userInfo";
import { loadUserInfo, selectIsUserAdmin, selectUserInfo } from "../../store/features/user";

const Account = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const isUserAdmin = useSelector(selectIsUserAdmin);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserDetails()
      .then((res) => {
        dispatch(loadUserInfo(res));
      })
      .catch((err) => { })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return (
    <div className="p-8">
      {isUserAdmin && (
        <div className="text-right">
          <Link to={"/admin"} className="text-lg text-blue-900 underline">
            Manage Admin
          </Link>
        </div>
      )}
      {userInfo?.email && (
        <>
          <p className="text-3xl font-bold mb-4">Hello, {userInfo?.firstName}</p>
          <p className="text-lg text-gray-600 mb-8">Welcome to your account</p>

          {/* Poziome menu z większymi zakładkami */}
          <nav className="flex justify-center space-x-12 border-b pb-4 mb-8">
            <NavLink
              to={"/account-details/profile"}
              className={({ isActive }) =>
                isActive
                  ? "text-xl font-bold border-b-4 border-black pb-2 text-black"
                  : "text-xl pb-2 text-gray-500 hover:text-black"
              }
            >
              Profile
            </NavLink>
            <NavLink
              to={"/account-details/orders"}
              className={({ isActive }) =>
                isActive
                  ? "text-xl font-bold border-b-4 border-black pb-2 text-black"
                  : "text-xl pb-2 text-gray-500 hover:text-black"
              }
            >
              Orders
            </NavLink>
            <NavLink
              to={"/account-details/products"}
              className={({ isActive }) =>
                isActive
                  ? "text-xl font-bold border-b-4 border-black pb-2 text-black"
                  : "text-xl pb-2 text-gray-500 hover:text-black"
              }
            >
              Products
            </NavLink>
            <NavLink
              to={"/account-details/settings"}
              className={({ isActive }) =>
                isActive
                  ? "text-xl font-bold border-b-4 border-black pb-2 text-black"
                  : "text-xl pb-2 text-gray-500 hover:text-black"
              }
            >
              Settings
            </NavLink>
          </nav>

          {/* Zawartość */}
          <div className="px-4 w-full rounded-lg">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
