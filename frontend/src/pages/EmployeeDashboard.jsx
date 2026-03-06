import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Employee Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="mt-4">
        {user ? (
          <p>
            Welcome, <span className="font-medium">{user.name}</span>
          </p>
        ) : (
          <p className="text-gray-600">Not logged in.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

