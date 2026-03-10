import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'

const Navbar = ({ username, onLogout, toggleSidebar }) => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40"
      style={{ backgroundColor: '#14b8a6' }}
    >
      {/* Left side - Menu toggle and title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-teal-700 p-2 rounded-lg transition-colors lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-white text-xl font-bold">Employee MS</h1>
      </div>

      {/* Center - Welcome message (hidden on small screens) */}
      <div className="hidden md:block">
        <p className="text-white text-lg">
          Welcome, <span className="font-semibold">{username || 'Employee'}</span>
        </p>
      </div>

      {/* Right side - Logout button */}
      <div className="flex items-center space-x-4">
        <div className="md:hidden">
          <p className="text-white text-sm">
            Welcome, <span className="font-semibold">{username || 'Employee'}</span>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaSignOutAlt />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Navbar
