import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const { currentUser, logout } = useAuth((state) => state);

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // logout
  const onLogout = async () => {
    await logout();
    navigate("/signin");
  };

  // fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:4000/adminApi/emails", {
        withCredentials: true,
      });

      // backend sends USERS
      setUsers(res.data.USERS || []);

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // block/unblock
  const handleToggleBlock = async (email, isCurrentlyActive) => {
    try {
      await axios.put(
        "http://localhost:4000/adminApi/userStatus",
        {
          email,
          isUserActive: !isCurrentlyActive,
        },
        {
          withCredentials: true,
        },
      );

      // refresh users
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status.");
    }
  };

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-gray-600">
        Loading users...
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-6 md:p-10">
      {/* HEADER */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* avatar */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase() || "A"}
            </div>
          )}

          {/* text */}
          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back, Admin</p>

            <h2 className="text-2xl font-bold text-[#1d1d1f]">
              {currentUser?.firstName || "Admin"}
            </h2>
          </div>
        </div>

        {/* logout */}
        <button
          onClick={onLogout}
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* title */}
      <h1 className="text-4xl font-bold text-[#1d1d1f] mb-2">
        Admin Dashboard
      </h1>

      <p className="text-[#6e6e73] mb-10">Manage registered users.</p>

      {/* empty state */}
      {users.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">
          No users found.
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e8e8ed]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              {/* table header */}
              <thead className="bg-[#f5f5f7] border-b border-[#d2d2d7]/50 text-sm font-semibold text-[#1d1d1f]">
                <tr>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>

              {/* body */}
              <tbody className="divide-y divide-[#d2d2d7]/30 text-sm text-[#1d1d1f]">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-[#fafafa] transition-colors"
                  >
                    {/* name */}
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="avatar"
                          className="w-9 h-9 rounded-full border border-[#d2d2d7] object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold text-xs">
                          {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </td>

                    {/* email */}
                    <td className="px-6 py-4 text-[#6e6e73] font-medium">
                      {user.email}
                    </td>

                    {/* status */}
                    <td className="px-6 py-4">
                      {user.isUserActive !== false ? (
                        <span className="text-[#248a3d] bg-[#34c759]/10 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide">
                          Active
                        </span>
                      ) : (
                        <span className="text-[#cc2f26] bg-[#ff3b30]/10 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide">
                          Blocked
                        </span>
                      )}
                    </td>

                    {/* action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleToggleBlock(
                            user.email,
                            user.isUserActive !== false,
                          )
                        }
                        className={
                          user.isUserActive !== false
                            ? "bg-[#ff3b30] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#d62c23] transition-colors cursor-pointer text-xs"
                            : "bg-[#34c759] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#248a3d] transition-colors cursor-pointer text-xs"
                        }
                      >
                        {user.isUserActive !== false ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
