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
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaUserShield,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa'
import Sidebar from '../componets/dashboard/Sidebar.jsx'

const Employee3Dashboard = () => {
  const [userData, setUserData] = useState({
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    employeeId: 'EMP003',
    role: 'Employee',
    department: 'Finance',
    phone: '+1 234 567 8903',
    designation: 'Financial Analyst',
    dateOfBirth: '1985-08-10',
    address: '789 Oak St, New York, NY'
  })
  const [activeSection, setActiveSection] = useState('dashboard')
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    userSalary: 0,
    userLeaves: 0
  })
  const [loading, setLoading] = useState(true)
  const [userSalaries, setUserSalaries] = useState([])
  const [userLeaves, setUserLeaves] = useState([])
  const [showAddSalary, setShowAddSalary] = useState(false)
  const [showAddLeave, setShowAddLeave] = useState(false)
  const [salaryForm, setSalaryForm] = useState({
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: ''
  })
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'salary', label: 'Salary', icon: FaMoneyBillWave },
    { id: 'leave', label: 'Leave', icon: FaCalendarAlt },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [employeesData, departmentsData, salariesData, leavesData] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        salaryAPI.getAll(),
        leaveAPI.getAll()
      ])

      const totalSalary = salariesData.reduce((sum, salary) => sum + (salary.basicSalary || 0), 0)
      const leaveStats = leavesData.reduce((acc, leave) => {
        acc[leave.status.toLowerCase()] = (acc[leave.status.toLowerCase()] || 0) + 1
        return acc
      }, {})

      // Filter data for current user
      const userSalaryData = salariesData.filter(salary => 
        salary.employeeId === 'EMP003' || salary.employeeName === 'Mike Johnson'
      )
      const userLeaveData = leavesData.filter(leave => 
        leave.employeeId === 'EMP003' || leave.employeeName === 'Mike Johnson'
      )

      setUserSalaries(userSalaryData)
      setUserLeaves(userLeaveData)

      setStats({
        totalEmployees: employeesData.length,
        totalDepartments: departmentsData.length,
        totalSalary: totalSalary,
        pendingLeaves: leaveStats.pending || 0,
        approvedLeaves: leaveStats.approved || 0,
        rejectedLeaves: leaveStats.rejected || 0,
        userSalary: userSalaryData.reduce((sum, salary) => sum + (salary.basicSalary || 0), 0),
        userLeaves: userLeaveData.length
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
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

  const handleSalarySubmit = async (e) => {
    e.preventDefault()
    try {
      const salaryData = {
        ...salaryForm,
        netSalary: (parseFloat(salaryForm.basicSalary) || 0) + (parseFloat(salaryForm.allowances) || 0) - (parseFloat(salaryForm.deductions) || 0),
        effectiveDate: salaryForm.payDate || new Date().toISOString().split('T')[0], // Add required effectiveDate
        status: 'Active'
      }
      
      await salaryAPI.create(salaryData)
      alert('Salary record added successfully!')
      setShowAddSalary(false)
      setSalaryForm({
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        basicSalary: '',
        allowances: '',
        deductions: '',
        payDate: ''
      })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to add salary:', error)
      alert('Failed to add salary record')
    }
  }

  const handleLeaveSubmit = async (e) => {
    e.preventDefault()
    try {
      const leaveData = {
        ...leaveForm,
        email: 'mike.johnson@company.com',
        department: 'Finance',
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      }
      
      await leaveAPI.create(leaveData)
      alert('Leave request submitted successfully!')
      setShowAddLeave(false)
      setLeaveForm({
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: ''
      })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to submit leave:', error)
      alert('Failed to submit leave request')
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
            
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">My Salary</p>
                    <p className="text-2xl font-bold">${stats.userSalary.toLocaleString()}</p>
                  </div>
                  <FaMoneyBillWave className="text-3xl text-orange-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">My Leaves</p>
                    <p className="text-2xl font-bold">{stats.userLeaves}</p>
                  </div>
                  <FaCalendarAlt className="text-3xl text-red-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-100">Total Employees</p>
                    <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                  </div>
                  <FaUsers className="text-3xl text-teal-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100">Departments</p>
                    <p className="text-2xl font-bold">{stats.totalDepartments}</p>
                  </div>
                  <FaBuilding className="text-3xl text-cyan-200" />
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Salary record updated</span>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Leave request submitted</span>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">Profile updated</span>
                  </div>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <FaUser className="text-orange-600 text-5xl" />
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
                      className="absolute bottom-0 right-0 bg-orange-600 text-white px-3 py-2 rounded-full text-sm hover:bg-orange-700 transition-colors"
                    >
                      <FaCamera />
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">{userData.name}</h3>
                  <p className="text-gray-600 mb-3">{userData.email}</p>
                  <span className="inline-block px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full font-medium">
                    {userData.role}
                  </span>
                  {imagePreview && (
                    <button
                      onClick={handleRemoveImage}
                      className="ml-3 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
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
                    {userData.employeeId}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {userData.department}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {userData.phone}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {userData.designation}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {userData.dateOfBirth}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {userData.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'salary':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Salary Management</h2>
              <button
                onClick={() => setShowAddSalary(true)}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FaPlus />
                <span>Add Salary</span>
              </button>
            </div>

            {/* Salary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Salary</p>
                    <p className="text-2xl font-bold text-gray-800">${stats.userSalary.toLocaleString()}</p>
                  </div>
                  <FaMoneyBillWave className="text-3xl text-orange-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Records</p>
                    <p className="text-2xl font-bold text-gray-800">{userSalaries.length}</p>
                  </div>
                  <FaFileAlt className="text-3xl text-orange-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ${userSalaries.length > 0 ? Math.round(stats.userSalary / userSalaries.length).toLocaleString() : 0}
                    </p>
                  </div>
                  <FaChartBar className="text-3xl text-orange-600" />
                </div>
              </div>
            </div>

            {/* Salary Records Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Salary Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userSalaries.map((salary, index) => (
                      <tr key={salary._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {salary.payDate || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${salary.basicSalary || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${salary.allowances || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${salary.deductions || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${salary.netSalary || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {salary.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userSalaries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No salary records found. Click "Add Salary" to add your first record.
                  </div>
                )}
              </div>
            </div>

            {/* Add Salary Modal */}
            {showAddSalary && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Salary Record</h3>
                  <form onSubmit={handleSalarySubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                        <input
                          type="number"
                          required
                          value={salaryForm.basicSalary}
                          onChange={(e) => setSalaryForm({...salaryForm, basicSalary: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                        <input
                          type="number"
                          value={salaryForm.allowances}
                          onChange={(e) => setSalaryForm({...salaryForm, allowances: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                        <input
                          type="number"
                          value={salaryForm.deductions}
                          onChange={(e) => setSalaryForm({...salaryForm, deductions: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pay Date</label>
                        <input
                          type="date"
                          required
                          value={salaryForm.payDate}
                          onChange={(e) => setSalaryForm({...salaryForm, payDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddSalary(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                      >
                        Add Salary
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )

      case 'leave':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Leave Management</h2>
              <button
                onClick={() => setShowAddLeave(true)}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FaPlus />
                <span>Request Leave</span>
              </button>
            </div>

            {/* Leave Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Leaves</p>
                    <p className="text-2xl font-bold text-gray-800">{userLeaves.length}</p>
                  </div>
                  <FaCalendarAlt className="text-3xl text-orange-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {userLeaves.filter(l => l.status === 'Pending').length}
                    </p>
                  </div>
                  <FaClock className="text-3xl text-yellow-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {userLeaves.filter(l => l.status === 'Approved').length}
                    </p>
                  </div>
                  <FaCheckCircle className="text-3xl text-green-600" />
                </div>
              </div>
            </div>

            {/* Leave Requests Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Requests</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userLeaves.map((leave, index) => (
                      <tr key={leave._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.leaveType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.fromDate || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.toDate || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {leave.reason || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userLeaves.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No leave requests found. Click "Request Leave" to submit your first request.
                  </div>
                )}
              </div>
            </div>

            {/* Add Leave Modal */}
            {showAddLeave && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Request Leave</h3>
                  <form onSubmit={handleLeaveSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <select
                          required
                          value={leaveForm.leaveType}
                          onChange={(e) => setLeaveForm({...leaveForm, leaveType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Leave Type</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Annual Leave">Annual Leave</option>
                          <option value="Personal Leave">Personal Leave</option>
                          <option value="Maternity Leave">Maternity Leave</option>
                          <option value="Paternity Leave">Paternity Leave</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                          type="date"
                          required
                          value={leaveForm.fromDate}
                          onChange={(e) => setLeaveForm({...leaveForm, fromDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                          type="date"
                          required
                          value={leaveForm.toDate}
                          onChange={(e) => setLeaveForm({...leaveForm, toDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea
                          required
                          value={leaveForm.reason}
                          onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddLeave(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Email Notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Leave Request Alerts</span>
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Salary Updates</span>
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">System Announcements</span>
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Profile Visibility</span>
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Data Sharing</span>
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Analytics Tracking</span>
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Account</h3>
                  <div className="space-y-4">
                    <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                      Change Password
                    </button>
                    <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                      Export Data
                    </button>
                    <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{activeSection}</h2>
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
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-orange-600 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center shadow-lg">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <FaUser className="text-orange-600 text-3xl" />
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
                  className="absolute -bottom-2 -right-2 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaCamera className="text-sm" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{userData.email}</span>
                  <span className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
                    {userData.role}
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
        {/* Modern Sidebar Component */}
        <Sidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userData={userData}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
          handleLogout={handleLogout}
          themeColor="orange"
        />

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

export default Employee3Dashboard
