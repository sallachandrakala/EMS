import React, { useState } from 'react'
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
  FaCamera
} from 'react-icons/fa'

const Sidebar = ({ 
  activeSection, 
  setActiveSection, 
  userData, 
  imagePreview, 
  handleImageUpload, 
  handleLogout,
  themeColor = 'teal'
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'profile', label: 'My Profile', icon: FaUser },
    { id: 'leave', label: 'Leave', icon: FaCalendarAlt },
    { id: 'salary', label: 'Salary', icon: FaMoneyBillWave },
    { id: 'settings', label: 'Setting', icon: FaCog }
  ]

  const themeClasses = {
    teal: {
      bg: 'bg-teal-600',
      hover: 'hover:bg-teal-700',
      border: 'border-teal-600',
      gradient: 'from-teal-50 to-teal-100',
      text: 'text-teal-600',
      badge: 'bg-teal-100 text-teal-800'
    },
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      border: 'border-blue-600',
      gradient: 'from-blue-50 to-blue-100',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800'
    },
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      border: 'border-green-600',
      gradient: 'from-green-50 to-green-100',
      text: 'text-green-600',
      badge: 'bg-green-100 text-green-800'
    },
    orange: {
      bg: 'bg-orange-600',
      hover: 'hover:bg-orange-700',
      border: 'border-orange-600',
      gradient: 'from-orange-50 to-orange-100',
      text: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800'
    },
    pink: {
      bg: 'bg-pink-600',
      hover: 'hover:bg-pink-700',
      border: 'border-pink-600',
      gradient: 'from-pink-50 to-pink-100',
      text: 'text-pink-600',
      badge: 'bg-pink-100 text-pink-800'
    }
  }

  const currentTheme = themeClasses[themeColor] || themeClasses.teal

  return (
    <div className="w-64 bg-gray-800 h-screen sticky top-0 shadow-xl">
      <div className="p-6">
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${currentTheme.border} bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center`}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile" 
                  className='w-full h-full object-cover'
                />
              ) : (
                <FaUser className={`${currentTheme.text} text-xl`} />
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
                className={`absolute bottom-0 right-0 ${currentTheme.bg} ${currentTheme.hover} text-white px-2 py-1 rounded-full text-xs transition-colors`}
              >
                <FaCamera />
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white">{userData?.name || 'User'}</h3>
            <p className="text-sm text-gray-300">{userData?.role || 'Employee'}</p>
          </div>
        </div>
        
        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? `${currentTheme.bg} text-white shadow-md transform scale-105`
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
