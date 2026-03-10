import React, { useState, useEffect } from 'react'
import { 
  FaUser, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaCog, 
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaBuilding,
  FaFileAlt,
  FaChartBar,
  FaBell,
  FaCamera,
  FaUpload,
  FaTimes
} from 'react-icons/fa'
import { employeeAPI, salaryAPI, leaveAPI, departmentAPI } from '../../services/api.js'

const MainDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
    loadDashboardStats()
  }, [])

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserData(user)
  }

  const loadDashboardStats = async () => {
    try {
      const [employees, departments, salaries, leaves] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        salaryAPI.getAll(),
        leaveAPI.getAll()
      ])

      const totalSalary = salaries.reduce((sum, salary) => sum + (salary.basicSalary || 0), 0)
      const leaveStats = leaves.reduce((acc, leave) => {
        acc[leave.status.toLowerCase()] = (acc[leave.status.toLowerCase()] || 0) + 1
        return acc
      }, {})

      setStats({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        totalSalary: totalSalary,
        pendingLeaves: leaveStats.pending || 0,
        approvedLeaves: leaveStats.approved || 0,
        rejectedLeaves: leaveStats.rejected || 0
      })
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setProfileImage(reader.result)
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Please select an image file (JPG, PNG, etc.)')
      }
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setImagePreview(null)
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: FaHome },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'employees', label: 'Employees', icon: FaUsers },
    { id: 'departments', label: 'Departments', icon: FaBuilding },
    { id: 'salary', label: 'Salary', icon: FaMoneyBillWave },
    { id: 'leave', label: 'Leave', icon: FaCalendarAlt },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
                  </div>
                  <FaUsers className="text-3xl text-teal-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Departments</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalDepartments}</p>
                  </div>
                  <FaBuilding className="text-3xl text-yellow-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Salary</p>
                    <p className="text-2xl font-bold text-gray-800">${stats.totalSalary.toLocaleString()}</p>
                  </div>
                  <FaMoneyBillWave className="text-3xl text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pendingLeaves}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-xl font-bold text-green-600">{stats.approvedLeaves}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-xl font-bold text-red-600">{stats.rejectedLeaves}</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-teal-600 bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <FaUser className="text-gray-400 text-4xl" />
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => document.querySelector('input[type="file"]').click()}
                      className="absolute bottom-0 right-0 bg-teal-600 text-white px-3 py-2 rounded-full text-sm hover:bg-teal-700 transition-colors"
                    >
                      <FaCamera />
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{userData?.name || 'User'}</h3>
                  <p className="text-gray-600 mb-2">{userData?.email || 'user@example.com'}</p>
                  <span className="inline-block px-3 py-1 text-sm bg-teal-100 text-teal-800 rounded-full">
                    {userData?.role || 'Employee'}
                  </span>
                  {imagePreview && (
                    <button
                      onClick={handleRemoveImage}
                      className="mt-3 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <FaTimes />
                      <span>Remove Image</span>
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
                    {userData?.department || 'IT Department'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {userData?.phone || '+1 234 567 8900'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {userData?.designation || 'Software Developer'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'salary':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Salary Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Salary management interface will be loaded here...</p>
            </div>
          </div>
        )
      
      case 'leave':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Leave management interface will be loaded here...</p>
            </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Notifications</span>
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Leave Requests</span>
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Salary Updates</span>
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600" />
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{activeSection}</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">This section is under development...</p>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center shadow-lg">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <FaUser className="text-teal-600 text-3xl" />
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="absolute -bottom-2 -right-2 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaCamera className="text-sm" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData?.name || 'User'}</h1>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{userData?.email || 'user@example.com'}</span>
                  <span className="inline-block px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full font-medium">
                    {userData?.role || 'Employee'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Last Login</p>
                <p className="text-sm text-gray-700 font-medium">{new Date().toLocaleString()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <FaUser className="text-teal-600 text-xl" />
                  )}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="absolute bottom-0 right-0 bg-teal-600 text-white px-2 py-1 rounded-full text-xs hover:bg-teal-700 transition-colors"
                  >
                    <FaCamera />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{userData?.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{userData?.role || 'Employee'}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
