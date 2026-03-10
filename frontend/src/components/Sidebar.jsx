import React from 'react'
import { FaHome, FaUser, FaCalendarAlt, FaMoneyBillWave, FaCog } from 'react-icons/fa'

const Sidebar = ({ activeSection, setActiveSection, isCollapsed, navigateToSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'profile', label: 'My Profile', icon: FaUser },
    { id: 'leave', label: 'Leave', icon: FaCalendarAlt },
    { id: 'salary', label: 'Salary', icon: FaMoneyBillWave },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ]

  return (
    <div 
      className={`fixed left-0 top-0 h-screen transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ backgroundColor: '#1e293b' }}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 
          className={`text-white font-bold transition-all duration-300 ${
            isCollapsed ? 'text-lg text-center' : 'text-2xl'
          }`}
        >
          {isCollapsed ? 'EMS' : 'Employee MS'}
        </h2>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigateToSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
