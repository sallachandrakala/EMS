import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaBuilding, FaCalendarAlt, FaCogs, FaMoneyBillWave, FaTachometerAlt, FaUsers } from 'react-icons/fa'

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64">
      <div className="bg-teal-600 h-16 flex flex-col items-center justify-center">
        <h3 className="text-2xl font-bold">Employee MS</h3>
      </div>
      
      <div className="flex-1 px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2">
            <FaUsers className="text-2xl" />
          </div>
          <p className="text-lg font-medium">Welcome Admin</p>
        </div>

        <nav className="space-y-2">
          <NavLink 
            to="/admin-dashboard" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin-dashboard/employees" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaUsers />
            <span>Employee</span>
          </NavLink>

          <NavLink 
            to="/admin-dashboard/departments" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaBuilding />
            <span>Department</span>
          </NavLink>

          <NavLink 
            to="/admin-dashboard/leave" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaCalendarAlt />
            <span>Leave</span>
          </NavLink>

          <NavLink 
            to="/admin-dashboard/salary" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaMoneyBillWave />
            <span>Salary</span>
          </NavLink>

          <NavLink 
            to="/admin-dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <FaCogs />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default AdminSidebar