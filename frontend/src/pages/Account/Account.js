import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { fetchUserDetails, updateUserDetailsAPI } from "../../api/userInfo";
import { loadUserInfo, selectIsUserAdmin, selectUserInfo, updateUserInfo } from "../../store/features/user";

const Account = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const isUserAdmin = useSelector(selectIsUserAdmin);
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserDetails()
      .then((res) => {
        dispatch(loadUserInfo(res));
        setEditedUsername(res?.username);
        setEditedEmail(res?.email);
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  // Domyślnie przekieruj na "Moje Przedmioty" jeśli użytkownik jest na "/account-details"
  if (location.pathname === "/account-details") {
    return <Navigate to="/account-details/products" />;
  }

  const handleSave = () => {
    dispatch(setLoading(true));
    const updatedData = {
      username: editedUsername,
      email: editedEmail,
    };

    updateUserDetailsAPI(updatedData)
      .then((updatedUser) => {
        dispatch(updateUserInfo(updatedUser));
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating user details:", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/v1/login";
  };

  return (
    <div className="p-8">
      {isUserAdmin && (
        <div className="text-right mb-4">
          <Link to={"/admin"} className="text-lg text-blue-900 underline">
            Panel Zarządzania
          </Link>
        </div>
      )}

      {userInfo?.email && (
        <div className="flex justify-between items-center mb-8">
          {/* Powitanie */}
          <div className="text-center flex-1" style={{ marginLeft: '390px' }}>
            <p className="text-3xl font-bold">Cześć, {userInfo?.username}</p>
          </div>

          {/* Dane użytkownika i przyciski */}
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Nazwa użytkownika:</span> {userInfo?.username}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Adres e-mail:</span> {userInfo?.email}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {!isEditing ? (
                <>
                  <button
                    className="flex items-center px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300"
                    onClick={() => setIsEditing(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M4 20h4l10.293-10.293a1 1 0 000-1.414l-3.536-3.536a1 1 0 00-1.414 0L4 16v4z"
                      />
                    </svg>
                    Edytuj dane
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white py-2 px-4 rounded-lg shadow-md"
                    style={{ backgroundColor: '#123456' }}
                  >
                    Wyloguj
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="block text-sm font-bold">Nazwa użytkownika</label>
                    <input
                      type="text"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold">Email</label>
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleSave}
                      className="text-white py-2 px-4 rounded-lg shadow-md"
                      style={{ backgroundColor: "#123456" }}
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Poziome menu */}
      <nav className="flex justify-center space-x-12 border-b pb-4 mb-8">
        <NavLink
          to={"/account-details/orders"}
          className={({ isActive }) =>
            isActive
              ? "text-xl font-bold border-b-4 border-black pb-2 text-black"
              : "text-xl pb-2 text-gray-500 hover:text-black"
          }
        >
          Moje Zamówienia
        </NavLink>
        <NavLink
          to={"/account-details/products"}
          className={({ isActive }) =>
            isActive
              ? "text-xl font-bold border-b-4 border-black pb-2 text-black"
              : "text-xl pb-2 text-gray-500 hover:text-black"
          }
        >
          Moje Oferty
        </NavLink>
        <NavLink
          to={"/account-details/reviews"}
          className={({ isActive }) =>
            isActive
              ? "text-xl font-bold border-b-4 border-black pb-2 text-black"
              : "text-xl pb-2 text-gray-500 hover:text-black"
          }
        >
          Opinie
        </NavLink>
      </nav>

      {/* Zawartość */}
      <div className="px-4 w-full rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
