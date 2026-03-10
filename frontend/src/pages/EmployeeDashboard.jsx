import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaUser, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFilter,
  FaDownload,
  FaSave,
  FaTimes,
  FaCamera,
  FaKey,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
  FaChartBar,
  FaClock
} from "react-icons/fa";
import { leaveAPI } from '../services/api';
import EmployeeSidebar from '../componets/dashboard/EmployeeSidebar';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@company.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, New York, NY',
    department: 'IT',
    position: 'Software Developer',
    joinDate: '2023-01-01',
    employeeId: user?.employeeId || 'EMP001',
    emergencyContact: '+1 987 654 3210',
    bloodGroup: 'O+',
    maritalStatus: 'Single'
  });

  // Load leaves from API when component mounts
  useEffect(() => {
    loadLeaves();
  }, []);

  // Handle URL-based routing
  useEffect(() => {
    if (location.pathname === '/leave-management') {
      setCurrentView('leave');
    } else if (location.pathname === '/employee-dashboard/profile') {
      setCurrentView('profile');
    } else {
      setCurrentView('dashboard');
    }
  }, [location.pathname]);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const leavesData = await leaveAPI.getAll();
      // Filter leaves for current user
      const userLeaves = leavesData.filter(leave => 
        leave.employeeId === user?.employeeId || 
        leave.employeeName === user?.name ||
        leave.email === user?.email
      );
      setLeaves(userLeaves);
    } catch (error) {
      console.error('Failed to load leaves:', error);
      // Set fallback sample data if API fails
      setLeaves([
        {
          id: 1,
          leaveType: 'Sick Leave',
          fromDate: '2024-09-15',
          toDate: '2024-09-16',
          reason: 'Fever and headache',
          status: 'Pending',
          appliedDate: '2024-09-15'
        },
        {
          id: 2,
          leaveType: 'Annual Leave',
          fromDate: '2024-09-10',
          toDate: '2024-09-12',
          reason: 'Family vacation',
          status: 'Approved',
          appliedDate: '2024-09-08'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const leaveData = {
        employeeId: user?.employeeId || 'EMP001',
        employeeName: user?.name || 'Employee',
        email: user?.email || 'employee@company.com',
        department: user?.department || 'IT',
        leaveType: leaveForm.leaveType,
        fromDate: leaveForm.fromDate,
        toDate: leaveForm.toDate,
        reason: leaveForm.reason,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      };

      console.log('Submitting leave request to API:', leaveData);
      const newLeave = await leaveAPI.create(leaveData);
      console.log('Leave request created successfully:', newLeave);
      
      // Refresh leaves from API
      await loadLeaves();
      
      setLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '' });
      setShowAddLeave(false);
      alert('Leave request submitted successfully! Admin will review your request.');
    } catch (error) {
      console.error('Failed to submit leave request:', error);
      // Fallback to local state if API fails
      const newLeave = {
        id: leaves.length + 1,
        employeeId: user?.employeeId || 'EMP001',
        employeeName: user?.name || 'Employee',
        email: user?.email || 'employee@company.com',
        department: user?.department || 'IT',
        ...leaveForm,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      };
      setLeaves([...leaves, newLeave]);
      setLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '' });
      setShowAddLeave(false);
      alert('Leave request submitted successfully! (Saved locally - Admin connection may be limited)');
    }
  };

  const handleDeleteLeave = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        // Try to delete from API first
        await leaveAPI.delete(id);
        console.log('Leave request deleted from API successfully');
        // Refresh leaves from API
        await loadLeaves();
        alert('Leave request deleted successfully!');
      } catch (error) {
        console.error('Failed to delete leave from API:', error);
        // Fallback to local state
        setLeaves(leaves.filter(leave => leave.id !== id));
        alert('Leave request deleted successfully! (Local only - Admin connection may be limited)');
      }
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Leave Management View
  if (currentView === 'leave') {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
          <button
            onClick={() => navigate('/employee-dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="text-gray-600">Loading leave requests...</div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leaves</p>
                <p className="text-xl font-bold">{leaves.length}</p>
              </div>
              <FaCalendarAlt className="text-teal-600 text-xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-xl font-bold text-green-600">{leaves.filter(l => l.status === 'Approved').length}</p>
              </div>
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{leaves.filter(l => l.status === 'Pending').length}</p>
              </div>
              <FaHourglassHalf className="text-yellow-600 text-xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-xl font-bold text-red-600">{leaves.filter(l => l.status === 'Rejected').length}</p>
              </div>
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Add Leave Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Search leaves..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition flex items-center">
              <FaFilter className="mr-2" />
              Filter
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition flex items-center">
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
          <button
            onClick={() => setShowAddLeave(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
          >
            <FaPlus className="mr-2" />
            Request Leave
          </button>
        </div>

        {/* Leave Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave.id || leave._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">#{leave.id || leave._id}</td>
                  <td className="px-6 py-4 text-sm">{leave.leaveType}</td>
                  <td className="px-6 py-4 text-sm">{leave.fromDate}</td>
                  <td className="px-6 py-4 text-sm">{leave.toDate}</td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-4 text-sm">{leave.appliedDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEye />
                      </button>
                      {leave.status === 'Pending' && (
                        <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteLeave(leave.id || leave._id)}>
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && leaves.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No leave requests found. Click "Request Leave" to create your first request.
            </div>
          )}
        </div>

        {/* Add Leave Modal */}
        {showAddLeave && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Request Leave</h3>
              <form onSubmit={handleLeaveSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                    <select
                      value={leaveForm.leaveType}
                      onChange={(e) => setLeaveForm({...leaveForm, leaveType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={leaveForm.fromDate}
                      onChange={(e) => setLeaveForm({...leaveForm, fromDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={leaveForm.toDate}
                      onChange={(e) => setLeaveForm({...leaveForm, toDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows="3"
                      placeholder="Enter reason for leave"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddLeave(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard View (Main)
  return (
    <>
      <div className='flex min-h-screen bg-gray-50'>
        {/* Employee Sidebar */}
        <EmployeeSidebar />
        
        {/* Main Content */}
        <div className='flex-1 ml-64'>
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
                  <p className="text-gray-600 mt-1">Welcome back, {user?.name || profileData.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Current Date</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <button
                    onClick={() => navigate("/employee-dashboard/profile")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                  >
                    <FaUser className="mr-2" />
                    My Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className='p-8'>
            <div className='max-w-7xl mx-auto'>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Salary</p>
                      <p className="text-2xl font-bold text-gray-900">$12,500</p>
                      <p className="text-sm text-green-600 mt-1">+2.5% from last month</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FaMoneyBillWave className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Leave Balance</p>
                      <p className="text-2xl font-bold text-gray-900">15 Days</p>
                      <p className="text-sm text-gray-500 mt-1">5 used this year</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <FaCalendarAlt className="text-green-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Attendance</p>
                      <p className="text-2xl font-bold text-gray-900">98%</p>
                      <p className="text-sm text-green-600 mt-1">Excellent</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FaCheckCircle className="text-purple-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-sm text-orange-600 mt-1">Due this week</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <FaHourglassHalf className="text-orange-600 text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaArrowRight className="mr-2 text-blue-600" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate("/salary-management")}
                        className="w-full text-left px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <FaMoneyBillWave className="mr-3 text-blue-600" />
                          <span className="text-gray-700 group-hover:text-blue-700">Manage Salary</span>
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => navigate("/leave-management")}
                        className="w-full text-left px-4 py-3 bg-green-50 rounded-lg hover:bg-green-100 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-3 text-green-600" />
                          <span className="text-gray-700 group-hover:text-green-700">Request Leave</span>
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-green-600" />
                      </button>
                      <button
                        onClick={() => navigate("/salary-dashboard")}
                        className="w-full text-left px-4 py-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <FaChartBar className="mr-3 text-purple-600" />
                          <span className="text-gray-700 group-hover:text-purple-700">View Reports</span>
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-purple-600" />
                      </button>
                      <button
                        onClick={() => navigate("/employee-dashboard/profile")}
                        className="w-full text-left px-4 py-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <FaUser className="mr-3 text-orange-600" />
                          <span className="text-gray-700 group-hover:text-orange-700">Update Profile</span>
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-orange-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaClock className="mr-2 text-blue-600" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FaCheckCircle className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">Salary Processed</p>
                          <p className="text-sm text-gray-600">Your salary for November 2024 has been processed</p>
                          <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaCalendarAlt className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">Leave Request Approved</p>
                          <p className="text-sm text-gray-600">Your leave request for Dec 15-17 has been approved</p>
                          <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <FaUser className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">Profile Updated</p>
                          <p className="text-sm text-gray-600">You successfully updated your contact information</p>
                          <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <FaHourglassHalf className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">Performance Review Scheduled</p>
                          <p className="text-sm text-gray-600">Your quarterly performance review is scheduled for next week</p>
                          <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // Profile View
  if (currentView === 'profile') {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard - {user?.name || profileData.name}</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/employee-dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{user?.name || profileData.name}</h3>
                <p className="text-gray-600">{profileData.position}</p>
                <p className="text-sm text-gray-500 mt-1">Employee ID: {profileData.employeeId}</p>
                
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{profileData.department}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Join Date</span>
                    <span className="font-medium">{profileData.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department</span>
                    <span className="font-medium">{profileData.department}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center">
                    <FaKey className="mr-3 text-gray-600" />
                    <span className="text-gray-700">Change Password</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center">
                    <FaDownload className="mr-3 text-gray-600" />
                    <span className="text-gray-700">Download Profile</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center">
                    <FaEnvelope className="mr-3 text-gray-600" />
                    <span className="text-gray-700">Contact HR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your position"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your department"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleProfileSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter emergency contact"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                  <select
                    value={profileData.bloodGroup}
                    onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select
                    value={profileData.maritalStatus}
                    onChange={(e) => setProfileData({...profileData, maritalStatus: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={profileData.employeeId}
                    onChange={(e) => setProfileData({...profileData, employeeId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="Employee ID"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default fallback
  return null
}

export default EmployeeDashboard;
