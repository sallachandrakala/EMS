import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaMoneyBillWave, FaCalendarAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'

const EmployeeSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64">
      <div className="bg-blue-600 h-16 flex flex-col items-center justify-center">
        <h3 className="text-2xl font-bold">Employee MS</h3>
      </div>
      
      <div className="flex-1 px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2">
            <FaUser className="text-2xl" />
          </div>
          <p className="text-lg font-medium">Welcome Employee</p>
        </div>

        <nav className="space-y-2">
          <NavLink 
            to="/employee-dashboard" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/salary-management" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaMoneyBillWave />
            <span>Salary</span>
          </NavLink>
          
          <NavLink 
            to="/leave-management" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaCalendarAlt />
            <span>Leave</span>
          </NavLink>
          
          <NavLink 
            to="/employee-dashboard/profile" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaUser />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }
          }}
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default EmployeeSidebar
