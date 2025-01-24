import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAddress, selectUserInfo, updateUserInfo } from "../../store/features/user";
import { setLoading } from "../../store/features/common";
import { deleteAddressAPI, updateUserDetailsAPI } from "../../api/userInfo";

const Profile = () => {
  const userInfo = useSelector(selectUserInfo);
  const [editing, setEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(userInfo?.username || "");
  const [editedEmail, setEditedEmail] = useState(userInfo?.email || "");
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(setLoading(true));
    const updatedData = {
      username: editedUsername,
      email: editedEmail,
    };

    updateUserDetailsAPI(updatedData)
      .then((updatedUser) => {
        dispatch(updateUserInfo(updatedUser));
        setEditing(false);
      })
      .catch((err) => {
        console.error("Error updating user details:", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        {!editing ? (
          <>
            <p className="text-xl font-semibold">Nazwa użytkownika: {userInfo?.username}</p>
            <p className="text-xl font-semibold">Email: {userInfo?.email}</p>
            <button
              className="text-blue-900 underline mt-4"
              onClick={() => setEditing(true)}
            >
              Edytuj
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Nazwa użytkownika:
              </label>
              <input
                type="text"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                className="border rounded p-2 w-64"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email:</label>
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="border rounded p-2 w-64"
              />
            </div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Zapisz
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditing(false)}
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
