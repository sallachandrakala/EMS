import React, { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaSignOutAlt, FaCamera, FaUpload } from 'react-icons/fa'
import { employeeAPI, salaryAPI, leaveAPI, settingsAPI } from '../../services/api.js'

const UserProfile = () => {
  const [userData, setUserData] = useState(null)
  const [userSalaries, setUserSalaries] = useState([])
  const [userLeaves, setUserLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Load user's salary records
      const salaries = await salaryAPI.getAll()
      const userSalaries = salaries.filter(salary => 
        salary.employeeId === currentUser.employeeId || salary.employeeName === currentUser.name
      )
      
      // Load user's leave requests
      const leaves = await leaveAPI.getAll()
      const userLeaves = leaves.filter(leave => 
        leave.employeeId === currentUser.employeeId || leave.employeeName === currentUser.name
      )
      
      setUserData(currentUser)
      setUserSalaries(userSalaries)
      setUserLeaves(userLeaves)
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
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

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary.basicSalary || 0)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-xl text-gray-600'>Loading user profile...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='p-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <div className='w-20 h-20 rounded-full overflow-hidden border-4 border-teal-600 bg-gray-100 flex items-center justify-center'>
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <FaUser className='text-gray-400 text-3xl' />
                )}
              </div>
              <div className='relative'>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="absolute bottom-0 right-0 bg-teal-600 text-white px-3 py-1 rounded-full text-xs hover:bg-teal-700 transition-colors"
                >
                  <FaCamera className="text-xs" />
                </button>
              </div>
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                {userData?.name || 'User Profile'}
              </h1>
              <p className='text-sm text-gray-600'>{userData?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            {imagePreview && (
              <button
                onClick={handleRemoveImage}
                className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'
              >
                <FaUpload />
                <span>Remove Image</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='bg-white rounded-lg shadow-sm mb-8'>
          <div className='flex border-b border-gray-200'>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'salary'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Salary
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'leave'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Leave
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          {activeTab === 'profile' && (
            <div>
              <h2 className='text-xl font-bold text-gray-800 mb-6'>Profile Information</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Employee ID</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.employeeId || 'EMP001'}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.name || 'John Doe'}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.email || 'john@example.com'}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.phone || '+1 234 567 8900'}
                    </div>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Department</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.department || 'IT Department'}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Designation</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.designation || 'Software Developer'}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Date of Birth</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.dateOfBirth || '1990-01-01'}
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Address</label>
                    <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                      {userData?.address || '123 Main St, City, State'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div>
              <h2 className='text-xl font-bold text-gray-800 mb-6'>Salary History</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Pay Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Basic Salary
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Allowances
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Deductions
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Net Salary
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {userSalaries.map((salary, index) => (
                      <tr key={salary._id || index} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {salary.payDate || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatSalary(salary)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          ${salary.allowances || 0}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          ${salary.deductions || 0}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {formatSalary({...salary, basicSalary: salary.netSalary})}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(salary.status)}`}>
                            {salary.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userSalaries.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    No salary records found
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leave' && (
            <div>
              <h2 className='text-xl font-bold text-gray-800 mb-6'>Leave History</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Leave Type
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        From Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        To Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Reason
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {userLeaves.map((leave, index) => (
                      <tr key={leave._id || index} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {leave.leaveType || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {leave.fromDate || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {leave.toDate || 'N/A'}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-900'>
                          {leave.reason || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(leave.status)}`}>
                            {leave.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userLeaves.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    No leave requests found
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className='text-xl font-bold text-gray-800 mb-6'>User Settings</h2>
              <div className='space-y-6'>
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                  <h3 className='text-lg font-medium text-yellow-800 mb-2'>Coming Soon</h3>
                  <p className='text-yellow-700'>
                    User-specific settings and preferences will be available here in the next update. 
                    For now, you can manage your profile information and view your salary and leave history.
                  </p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-medium text-gray-800 mb-3'>Notifications</h3>
                    <div className='space-y-3'>
                      <label className='flex items-center space-x-3'>
                        <input type='checkbox' className='rounded border-gray-300 text-teal-600 focus:ring-teal-500' defaultChecked />
                        <span className='text-sm text-gray-700'>Email Notifications</span>
                      </label>
                      <label className='flex items-center space-x-3'>
                        <input type='checkbox' className='rounded border-gray-300 text-teal-600 focus:ring-teal-500' defaultChecked />
                        <span className='text-sm text-gray-700'>Leave Request Alerts</span>
                      </label>
                      <label className='flex items-center space-x-3'>
                        <input type='checkbox' className='rounded border-gray-300 text-teal-600 focus:ring-teal-500' defaultChecked />
                        <span className='text-sm text-gray-700'>Salary Updates</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className='space-y-4'>
                    <h3 className='text-lg font-medium text-gray-800 mb-3'>Privacy</h3>
                    <div className='space-y-3'>
                      <label className='flex items-center space-x-3'>
                        <input type='checkbox' className='rounded border-gray-300 text-teal-600 focus:ring-teal-500' defaultChecked />
                        <span className='text-sm text-gray-700'>Profile Visibility</span>
                      </label>
                      <label className='flex items-center space-x-3'>
                        <input type='checkbox' className='rounded border-gray-300 text-teal-600 focus:ring-teal-500' />
                        <span className='text-sm text-gray-700'>Data Sharing</span>
                      </label>
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

export default UserProfile
