import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FaMoneyBillWave } from "react-icons/fa";

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
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/salary-management")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
          >
            <FaMoneyBillWave className="mr-2" />
            Salary Management
          </button>
          <button
            onClick={handleLogout}
            className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
          >
            Logout
          </button>
        </div>
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

