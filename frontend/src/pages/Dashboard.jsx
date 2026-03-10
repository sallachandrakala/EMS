import React from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa'

const Dashboard = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, New York, NY',
    department: 'IT',
    position: 'Software Developer',
    joinDate: '01-01-2023'
  }

  const stats = [
    { label: 'Total Leaves', value: '12', icon: FaCalendar, color: 'bg-blue-500' },
    { label: 'Pending Requests', value: '3', icon: FaCalendar, color: 'bg-yellow-500' },
    { label: 'Approved Leaves', value: '8', icon: FaCalendar, color: 'bg-green-500' },
    { label: 'Rejected Leaves', value: '1', icon: FaCalendar, color: 'bg-red-500' }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-800">{user.phone}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-800">{user.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaCalendar className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Join Date</p>
                <p className="font-medium text-gray-800">{user.joinDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-800">{user.department}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.hash = '#/leave'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <FaCalendarAlt className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Manage Leaves</h3>
                <p className="text-sm text-gray-600">View and manage leave requests</p>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">View Salary</h3>
                <p className="text-sm text-gray-600">Check your salary details</p>
              </div>
            </div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaUser className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Update Profile</h3>
                <p className="text-sm text-gray-600">Edit your profile information</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Leave Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Leave Management</h2>
          <button 
            onClick={() => window.location.hash = '#/leave'}
            className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FaCalendarAlt />
            <span>Manage All Leaves</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Leaves</p>
                <p className="text-2xl font-bold text-blue-800">12</p>
              </div>
              <FaCalendarAlt className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">3</p>
              </div>
              <FaCalendarAlt className="text-yellow-600 text-2xl" />
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-800">8</p>
              </div>
              <FaCalendarAlt className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Leave Requests</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-800">Sick Leave</p>
                  <p className="text-sm text-gray-600">15-09-2024 to 16-09-2024</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-800">Annual Leave</p>
                  <p className="text-sm text-gray-600">10-09-2024 to 12-09-2024</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Approved</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-800">Casual Leave</p>
                  <p className="text-sm text-gray-600">05-09-2024 to 05-09-2024</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Rejected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
