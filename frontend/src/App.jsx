import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import SalaryManagement from "./pages/SalaryManagement";
import LeaveManagement from "./pages/LeaveManagement";
import AllEmployeesDashboard from "./pages/AllEmployeesDashboard";
import SalaryCards from "./componets/dashboard/SalaryCards";
import { useAuth } from "./context/authContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RequireRole = ({ role, children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role)
    return (
      <Navigate
        to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"}
        replace
      />
    );
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard/*"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/all-employees"
          element={
            <RequireAuth>
              <AllEmployeesDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <RequireAuth>
              <EmployeeDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/salary-management"
          element={
            <RequireAuth>
              <SalaryManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/salary-dashboard"
          element={
            <RequireAuth>
              <SalaryCards />
            </RequireAuth>
          }
        />
        <Route
          path="/admin-dashboard/salary"
          element={
            <RequireAuth>
              <SalaryCards />
            </RequireAuth>
          }
        />
        <Route
          path="/leave-management"
          element={
            <RequireAuth>
              <LeaveManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/employee-dashboard/profile"
          element={
            <RequireAuth>
              <EmployeeProfile />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;