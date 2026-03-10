import React, { useState, useEffect } from 'react'
import { FaUser, FaMoneyBillWave, FaCalendarAlt, FaCog, FaSignOutAlt, FaHome, FaCamera, FaTimes, FaPlus, FaClock, FaCheckCircle } from 'react-icons/fa'
import { employeeAPI, salaryAPI, leaveAPI } from '../../services/api.js'

const UserDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [profileImage, setProfileImage] = useState(null)
  const [stats, setStats] = useState({ userSalary: 0, userLeaves: 0 })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserData(user)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className='w-full h-full object-cover' />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-2xl" />
                  </div>
                )}
              </div>
              <input
                id="header-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <button
                onClick={() => document.getElementById('header-upload').click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full text-xs hover:bg-blue-700"
              >
                <FaCamera />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-bold">{userData?.name || 'User'}</h1>
              <p className="text-sm text-gray-600">{userData?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className='w-full h-full object-cover' />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold">{userData?.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{userData?.role || 'Employee'}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: FaHome },
                { id: 'profile', label: 'Profile', icon: FaUser },
                { id: 'salary', label: 'Salary', icon: FaMoneyBillWave },
                { id: 'leave', label: 'Leave', icon: FaCalendarAlt },
                { id: 'settings', label: 'Settings', icon: FaCog }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    activeSection === item.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">My Salary</p>
                      <p className="text-2xl font-bold">${stats.userSalary.toLocaleString()}</p>
                    </div>
                    <FaMoneyBillWave className="text-3xl text-blue-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">My Leaves</p>
                      <p className="text-2xl font-bold">{stats.userLeaves}</p>
                    </div>
                    <FaCalendarAlt className="text-3xl text-green-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className='w-full h-full object-cover' />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="text-blue-600 text-5xl" />
                        </div>
                      )}
                    </div>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <button
                      onClick={() => document.getElementById('profile-upload').click()}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white px-3 py-2 rounded-full text-sm hover:bg-blue-700"
                    >
                      <FaCamera />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{userData?.name || 'User'}</h3>
                    <p className="text-gray-600 mb-3">{userData?.email || 'user@example.com'}</p>
                    <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {userData?.role || 'Employee'}
                    </span>
                    {profileImage && (
                      <button
                        onClick={() => setProfileImage(null)}
                        className="ml-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        <FaTimes className="inline mr-1" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      {userData?.employeeId || 'EMP001'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      {userData?.department || 'IT'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'salary' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Salary Management</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Salary Records</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    <FaPlus className="inline mr-2" />
                    Add Salary
                  </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  No salary records found. Click "Add Salary" to add your first record.
                </div>
              </div>
            </div>
          )}

          {activeSection === 'leave' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Leave Management</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Leave Requests</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    <FaPlus className="inline mr-2" />
                    Request Leave
                  </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  No leave requests found. Click "Request Leave" to submit your first request.
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Email Notifications</span>
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Leave Request Alerts</span>
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Account</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Change Password
                      </button>
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
