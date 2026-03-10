import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Dashboard from '../../pages/Dashboard'
import LeavePage from '../../pages/LeavePage'
import { FaUser, FaCalendarAlt, FaMoneyBillWave, FaCog } from 'react-icons/fa'

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    employeeId: 'EMP001'
  })

  useEffect(() => {
    // Load user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.name) {
      setUserData(user)
    }

    // Handle hash navigation
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#/leave') {
        setActiveSection('leave')
      } else if (hash === '#/dashboard') {
        setActiveSection('dashboard')
      } else if (hash === '#/profile') {
        setActiveSection('profile')
      } else if (hash === '#/salary') {
        setActiveSection('salary')
      } else if (hash === '#/settings') {
        setActiveSection('settings')
      }
    }

    // Initial hash check
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const navigateToSection = (section) => {
    setActiveSection(section)
    window.location.hash = `#/${section}`
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'leave':
        return <LeavePage />
      case 'profile':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
              <div className="text-center text-gray-600">
                <p>Profile page content will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'salary':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Salary</h1>
              <div className="text-center text-gray-600">
                <p>Salary page content will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
              <div className="text-center text-gray-600">
                <p>Settings page content will be implemented here.</p>
              </div>
            </div>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        navigateToSection={navigateToSection}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Navbar */}
        <Navbar 
          username={userData.name}
          onLogout={handleLogout}
          toggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto mt-16">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
