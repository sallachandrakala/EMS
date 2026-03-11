import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaUser, 
  FaArrowRight
} from "react-icons/fa";
import { employeeData, getCurrentEmployee, getEmployeeLeaveRequests, getEmployeeSalaryRecords } from '../data/employeeData';
import { salaryAPI } from '../services/api';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);

  useEffect(() => {
    const loadEmployeeData = async () => {
      const employeeId = user?.employeeId || 'EMP001';
      const employee = getCurrentEmployee(employeeId);
      setCurrentEmployee(employee);
      
      // Load employee leave requests from local data store
      const employeeLeaves = getEmployeeLeaveRequests(employeeId);
      setLeaveRequests(employeeLeaves);
      
      try {
        // Load employee salary records from API
        const apiSalaries = await salaryAPI.getByEmployeeId(employeeId);
        console.log('Employee salaries from API:', apiSalaries);
        
        // Load employee salary records from local data store
        const localSalaries = getEmployeeSalaryRecords(employeeId);
        console.log('Employee salaries from local store:', localSalaries);
        
        // Combine API and local salary records
        const combinedSalaries = [...apiSalaries, ...localSalaries];
        console.log('Combined employee salaries:', combinedSalaries);
        
        setSalaryRecords(combinedSalaries);
      } catch (error) {
        console.error('Error loading employee salary data from API:', error);
        // Fallback to local data store only
        const localSalaries = getEmployeeSalaryRecords(employeeId);
        setSalaryRecords(localSalaries);
      }
    };
    
    loadEmployeeData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-8">EMS</h2>
          <nav className="space-y-4">
            <button 
              onClick={() => navigate("/employee-dashboard")}
              className="block text-white hover:text-blue-400 transition w-full text-left py-3"
            >
              <div className="flex items-center space-x-3">
                <FaUser className="text-blue-400" />
                <span>My Dashboard</span>
              </div>
            </button>
            <button 
              onClick={() => navigate("/all-employees")}
              className="block text-white hover:text-blue-400 transition w-full text-left py-3"
            >
              <div className="flex items-center space-x-3">
                <FaUser className="text-green-400" />
                <span>All Employees</span>
              </div>
            </button>
            <button 
              onClick={() => navigate("/salary-management")}
              className="block text-white hover:text-blue-400 transition w-full text-left py-3"
            >
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave className="text-yellow-400" />
                <span>Salary</span>
              </div>
            </button>
            <button 
              onClick={() => navigate("/leave-management")}
              className="block text-white hover:text-blue-400 transition w-full text-left py-3"
            >
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-purple-400" />
                <span>Leave</span>
              </div>
            </button>
            <button 
              onClick={() => navigate("/employee-dashboard/profile")}
              className="block text-white hover:text-blue-400 transition w-full text-left py-3"
            >
              <div className="flex items-center space-x-3">
                <FaUser className="text-orange-400" />
                <span>My Profile</span>
              </div>
            </button>
            <button 
              onClick={() => {
                // Clear user session
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="block text-white hover:text-red-400 transition w-full text-left mt-8 pt-4 border-t border-gray-700 py-3"
            >
              <div className="flex items-center space-x-3">
                <FaUser className="text-red-400" />
                <span>Logout</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {currentEmployee?.name || 'Employee'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-500 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaMoneyBillWave className="text-2xl" />
                  <span className="text-sm">Total Salary</span>
                </div>
                <p className="text-3xl font-bold">${currentEmployee?.salary || '12,500'}</p>
                <p className="text-sm mt-2 text-blue-100">+2.5% from last month</p>
              </div>

              <div className="bg-green-500 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaCalendarAlt className="text-2xl" />
                  <span className="text-sm">Leave Balance</span>
                </div>
                <p className="text-3xl font-bold">{currentEmployee?.leaveBalance || '15'} Days</p>
                <p className="text-sm mt-2 text-green-100">Available</p>
              </div>

              <div className="bg-purple-500 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaUser className="text-2xl" />
                  <span className="text-sm">Attendance</span>
                </div>
                <p className="text-3xl font-bold">{currentEmployee?.attendance || '98'}%</p>
                <p className="text-sm mt-2 text-purple-100">Excellent</p>
              </div>

              <div className="bg-orange-500 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaCalendarAlt className="text-2xl" />
                  <span className="text-sm">Pending Tasks</span>
                </div>
                <p className="text-3xl font-bold">{currentEmployee?.pendingTasks || '3'}</p>
                <p className="text-sm mt-2 text-orange-100">Due this week</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate("/salary-management")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-left group shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-white mr-3" />
                      <span className="text-white font-medium">View Salary</span>
                    </div>
                    <FaArrowRight className="text-white opacity-75 group-hover:opacity-100" />
                  </div>
                </button>

                <button 
                  onClick={() => navigate("/leave-management")}
                  className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 text-left group shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-white mr-3" />
                      <span className="text-white font-medium">Request Leave</span>
                    </div>
                    <FaArrowRight className="text-white opacity-75 group-hover:opacity-100" />
                  </div>
                </button>

                <button 
                  onClick={() => navigate("/employee-dashboard/profile")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 text-left group shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaUser className="text-white mr-3" />
                      <span className="text-white font-medium">My Profile</span>
                    </div>
                    <FaArrowRight className="text-white opacity-75 group-hover:opacity-100" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Leave Requests */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Leave Requests</h3>
            <div className="space-y-3">
              {leaveRequests.slice(0, 3).map((leave) => (
                <div key={leave.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{leave.leaveType}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{leave.reason}</p>
                      <p className="text-xs text-gray-500">
                        {leave.fromDate} to {leave.toDate}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/leave-management")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {leaveRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaCalendarAlt className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>No leave requests found</p>
                  <button
                    onClick={() => navigate("/leave-management")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Request Leave
                  </button>
                </div>
              )}
            </div>

          {/* Recent Salary Records */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Salary Records</h3>
            <div className="space-y-3">
              {salaryRecords.slice(0, 3).map((salary) => (
                <div key={salary.id || salary._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">Monthly Salary</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          salary.status === 'Active' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {salary.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        ${salary.basicSalary || '0'} {salary.allowances ? `+ $${salary.allowances}` : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pay Date: {salary.payDate || 'Not specified'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Department: {salary.department || 'Not specified'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/salary-management")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {salaryRecords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>No salary records found</p>
                  <button
                    onClick={() => navigate("/salary-management")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add Salary Record
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default EmployeeDashboard;
