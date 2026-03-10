import React, { useState } from 'react'
import {
  MdDashboard,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaCog,
  FaMoneyBillWave
} from 'react-icons/fa'

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  userData, 
  imagePreview, 
  handleImageUpload, 
  handleLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { id: 'profile', label: 'My Profile', icon: FaUsers },
    { id: 'leave', label: 'Leave', icon: FaBuilding },
    { id: 'salary', label: 'Salary', icon: FaCalendarAlt },
    { id: 'settings', label: 'Setting', icon: FaCog }
  ]

  return (
    <div className="flex">
      {/* Sidebar Container */}
      <div 
        className="fixed left-0 top-0 w-60 h-screen bg-gray-900 shadow-xl z-50"
        style={{ backgroundColor: '#1f2a3a' }}
      >
        {/* Header Section */}
        <div 
          className="p-6 border-b border-gray-700"
          style={{ backgroundColor: '#1c8f86' }}
        >
          <h2 
            className="text-white text-2xl font-bold text-center"
            style={{ fontFamily: 'cursive' }}
          >
            Employee MS
          </h2>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <FaUsers className="text-teal-600 text-3xl" />
                )}
              </div>
              <div className="relative">
                <input
                  id="sidebar-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('sidebar-image-upload').click()}
                  className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full text-xs transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012 2 0 002-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2m0 2a2 2 0 01-2 2 00-2-2" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg">{userData?.name || 'Employee'}</h3>
              <p className="text-gray-400 text-sm">{userData?.role || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Management</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveSection('salary')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeSection === 'salary'
                  ? 'text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              style={{
                backgroundColor: activeSection === 'salary' ? '#1c8f86' : 'transparent'
              }}
            >
              <FaMoneyBillWave className="text-xl" />
              <span className="font-medium">Salary Management</span>
            </button>
            <button
              onClick={() => setActiveSection('leave')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeSection === 'leave'
                  ? 'text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              style={{
                backgroundColor: activeSection === 'leave' ? '#1c8f86' : 'transparent'
              }}
            >
              <FaCalendarAlt className="text-xl" />
              <span className="font-medium">Leave Management</span>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg transform scale-105'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#1c8f86' : 'transparent'
                  }}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4H3a2 2 0 01-2 2v6a2 2 0 002 2h3m-6 0h6a2 2 0 002-2v-6a2 2 0 00-2-2H3m0 0l4 4" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}


export default Sidebar
