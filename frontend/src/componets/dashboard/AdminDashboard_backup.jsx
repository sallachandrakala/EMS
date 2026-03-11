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
  FaCheck
} from 'react-icons/fa'
import { employeeAPI, salaryAPI, leaveAPI, departmentAPI } from '../../services/api.js'
import { getAllSalaryRequests, updateSalaryRequestStatus, getEmployeeSalaryRecords, updateSalaryRecord, deleteSalaryRecord, getAllSalaryRecords } from '../../data/employeeData'

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
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
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [salaries, setSalaries] = useState([])
  const [allSalaries, setAllSalaries] = useState([])
  const [leaves, setLeaves] = useState([])
  const [salaryRequests, setSalaryRequests] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    employeeId: '',
    department: '',
    phone: '',
    designation: '',
    dateOfBirth: '',
    address: ''
  })

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'users', label: 'User Management', icon: FaUserShield },
    { id: 'employees', label: 'Employees', icon: FaUsers },
    { id: 'departments', label: 'Departments', icon: FaBuilding },
    { id: 'salary', label: 'Salary', icon: FaMoneyBillWave },
    { id: 'leave', label: 'Leave', icon: FaCalendarAlt },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ]

  useEffect(() => {
    loadUserData()
    loadDashboardData()
  }, [])

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserData(user)
  }

  const handleApproveRequest = (requestId) => {
    console.log('Approving request:', requestId)
    if (window.confirm('Are you sure you want to approve this salary request?')) {
      console.log('Calling updateSalaryRequestStatus...')
      const updatedRequest = updateSalaryRequestStatus(requestId, 'Approved', 'Approved by admin')
      console.log('Updated request:', updatedRequest)
      
      if (updatedRequest) {
        // Reload salary requests
        const updatedRequests = getAllSalaryRequests()
        setSalaryRequests(updatedRequests)
        
        // Also reload salary records to show the new approved salary
        const updatedSalaryRecords = salaryRecords
        console.log('Updated salary records:', updatedSalaryRecords)
        
        alert('Salary request approved successfully!')
      } else {
        console.log('Failed to update request')
        alert('Failed to approve salary request!')
      }
    }
  }

  const handleRejectRequest = (requestId) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      const updatedRequest = updateSalaryRequestStatus(requestId, 'Rejected', reason)
      if (updatedRequest) {
        // Reload salary requests
        const updatedRequests = getAllSalaryRequests()
        setSalaryRequests(updatedRequests)
        alert('Salary request rejected successfully!')
      }
    }
  }

  const handleEditSalary = (salary) => {
    console.log('Edit button clicked for salary:', salary)
    
    // For now, let's show the salary details and a simple edit form
    const newBasicSalary = prompt(`Edit salary for ${salary.employeeName}:`, salary.basicSalary)
    
    if (newBasicSalary !== null && newBasicSalary !== '') {
      const updatedSalaryData = {
        ...salary,
        basicSalary: parseFloat(newBasicSalary),
        netSalary: parseFloat(newBasicSalary) + parseFloat(salary.allowances || 0) - parseFloat(salary.deductions || 0)
      }
      
      // Update via API
      salaryAPI.update(salary.id || salary._id, updatedSalaryData).then(() => {
        // Update local state
        const updatedSalaries = salaries.map(s => 
          (s.id === salary.id || s._id === salary._id) ? updatedSalaryData : s
        )
        setSalaries(updatedSalaries)
        alert(`Salary record for ${salary.employeeName} updated successfully!`)
      }).catch(error => {
        console.error('Error updating salary:', error)
        alert('Failed to update salary record. Please try again.')
      })
    }
  }

  const handleDeleteSalary = async (salary, index) => {
    console.log('=== DELETE START ===')
    console.log('Salary data:', salary)
    console.log('Index:', index)
    console.log('Salary ID:', salary.id || salary._id)
    console.log('Salary ID length:', (salary.id || salary._id)?.length)
    console.log('Is MongoDB ObjectId format:', (salary.id || salary._id)?.length === 24 && /^[0-9a-fA-F]{24}$/.test(salary.id || salary._id))
    
    if (window.confirm(`Are you sure you want to delete salary record for ${salary.employeeName || salary.name}?`)) {
      try {
        const salaryId = salary.id || salary._id
        const isValidObjectId = salaryId?.length === 24 && /^[0-9a-fA-F]{24}$/.test(salaryId)
        
        if (isValidObjectId) {
          console.log('Valid MongoDB ObjectId, attempting server API deletion...')
          const apiDeleted = await salaryAPI.delete(salaryId)
          console.log('Server API deletion result:', apiDeleted)
          
          if (apiDeleted) {
            console.log('Successfully deleted from server API')
            
            // Also delete from local data store
            const localDeleted = deleteSalaryRecord(salaryId)
            console.log('Local data store deletion result:', localDeleted)
            
            // Update local state by removing the item
            const newSalaries = salaries.filter((s, i) => i !== index)
            
            console.log('Original salaries length:', salaries.length)
            console.log('New salaries length:', newSalaries.length)
            
            // Update state
            setSalaries(newSalaries)
            
            setTimeout(() => {
              console.log('After state update - salaries count:', salaries.length)
            }, 100)
            
            alert(`Successfully deleted salary record for ${salary.employeeName || salary.name}`)
            
            console.log('=== DELETE SUCCESS ===')
          } else {
            console.log('Server API deletion failed, trying local data store only...')
            
            // Fallback: try local data store deletion
            const localDeleted = deleteSalaryRecord(salaryId)
            
            if (localDeleted) {
              console.log('Successfully deleted from local data store')
              
              // Update local state
              const newSalaries = salaries.filter((s, i) => i !== index)
              setSalaries(newSalaries)
              
              setTimeout(() => {
                console.log('Fallback - After state update - salaries count:', salaries.length)
              }, 100)
              
              alert(`Salary record deleted locally for ${salary.employeeName || salary.name}`)
              
              console.log('=== DELETE FALLBACK SUCCESS ===')
            } else {
              console.log('Both server API and local deletion failed')
              alert('Failed to delete salary record from both server and local storage')
            }
          }
        } else {
          console.log('Invalid MongoDB ObjectId format, deleting locally only...')
          
          // For local records (non-ObjectId format), delete locally only
          const localDeleted = deleteSalaryRecord(salaryId)
          const newSalaries = salaries.filter((s, i) => i !== index)
          setSalaries(newSalaries)
          
          alert(`Local salary record deleted for ${salary.employeeName || salary.name}`)
          
          console.log('=== LOCAL DELETE SUCCESS ===')
        }
      } catch (error) {
        console.error('Delete error:', error)
        
        // Final fallback: just update local state
        console.log('API error, updating local state only...')
        const newSalaries = [...salaries]
        newSalaries.splice(index, 1)
        setSalaries(newSalaries)
        
        setTimeout(() => {
          console.log('Final fallback - After state update - salaries count:', salaries.length)
        }, 100)
        
        alert(`Salary record deleted locally (server error: ${error.message})`)
        
        console.log('=== DELETE FINAL FALLBACK SUCCESS ===')
      }
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log('=== LOADING DASHBOARD DATA ===')
      
      const [employeesData, departmentsData, salariesData, leavesData] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        salaryAPI.getAll(),
        leaveAPI.getAll()
      ])

      // Load salary requests from data store
      const salaryRequestsData = getAllSalaryRequests()
      
      console.log('=== SALARY REQUESTS DEBUG ===')
      console.log('getAllSalaryRequests() returned:', salaryRequestsData)
      console.log('Salary requests array length:', salaryRequestsData.length)
      if (salaryRequestsData.length > 0) {
        console.log('First salary request:', salaryRequestsData[0])
      }
      
      // Get all salary records from data store (as backup)
      const allSalaryRecords = getAllSalaryRecords()

      console.log('=== DATA LOADED ===')
      console.log('Employees:', employeesData.length)
      console.log('Departments:', departmentsData.length)
      console.log('Salaries from API:', salariesData.length)
      console.log('All salary records from data store:', allSalaryRecords.length)
      console.log('Leaves:', leavesData.length)
      console.log('Salary requests:', salaryRequestsData.length)

      setEmployees(employeesData)
      setDepartments(departmentsData)
      // Use API data as primary source now that server is running
      setSalaries(salariesData)
      setLeaves(leavesData)
      setSalaryRequests(salaryRequestsData)

      console.log('=== STATE UPDATED ===')
      console.log('Salaries state set:', salariesData.length, 'records')
      
      // Combine API salaries with local data store for complete view
      const localSalaryRecords = getAllSalaryRecords()
      console.log('Local salary records from data store:', localSalaryRecords.length)
      
      // Create combined data for salary records section
      const combinedSalaries = [...salariesData, ...localSalaryRecords]
      console.log('Combined salaries for display:', combinedSalaries.length)
      
      // Store combined data for the salary records section
      setAllSalaries(combinedSalaries)

      // Use the actual salaries data for stats calculation
      const totalSalary = salariesData.reduce((sum, salary) => sum + (salary.basicSalary || 0), 0)
      const leaveStats = leavesData.reduce((acc, leave) => {
        acc[leave.status.toLowerCase()] = (acc[leave.status.toLowerCase()] || 0) + 1
        return acc
      }, {})

      setStats({
        totalEmployees: employeesData.length,
        totalDepartments: departmentsData.length,
        totalSalary: totalSalary,
        pendingLeaves: leaveStats.pending || 0,
        approvedLeaves: leaveStats.approved || 0,
        rejectedLeaves: leaveStats.rejected || 0
      })

      console.log('=== STATS CALCULATED ===')
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

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      await employeeAPI.create(userForm)
      alert('User created successfully!')
      setShowAddUser(false)
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employeeId: '',
        department: '',
        phone: '',
        designation: '',
        dateOfBirth: '',
        address: ''
      })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user')
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      await employeeAPI.update(selectedUser._id, userForm)
      alert('User updated successfully!')
      setShowEditUser(false)
      setSelectedUser(null)
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employeeId: '',
        department: '',
        phone: '',
        designation: '',
        dateOfBirth: '',
        address: ''
      })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await employeeAPI.delete(userId)
        alert('User deleted successfully!')
        loadDashboardData()
      } catch (error) {
        console.error('Failed to delete user:', error)
        alert('Failed to delete user')
      }
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
      phone: user.phone,
      designation: user.designation,
      dateOfBirth: user.dateOfBirth,
      address: user.address
    })
    setShowEditUser(true)
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            
            {/* Admin Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Employees</p>
                    <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                  </div>
                  <FaUsers className="text-3xl text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Salary</p>
                    <p className="text-2xl font-bold">${stats.totalSalary.toLocaleString()}</p>
                  </div>
                  <FaMoneyBillWave className="text-3xl text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Departments</p>
                    <p className="text-2xl font-bold">{stats.totalDepartments}</p>
                  </div>
                  <FaBuilding className="text-3xl text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pending Leaves</p>
                    <p className="text-2xl font-bold">{stats.pendingLeaves}</p>
                  </div>
                  <FaCalendarAlt className="text-3xl text-orange-200" />
                </div>
              </div>
            </div>

            {/* Leave Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingLeaves}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approvedLeaves}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejectedLeaves}</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">New user registered</span>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Leave request approved</span>
                  </div>
                  <span className="text-sm text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Salary records updated</span>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FaPlus />
                <span>Create User</span>
              </button>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
                  </div>
                  <FaUsers className="text-3xl text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Admin Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {employees.filter(emp => emp.role === 'admin').length}
                    </p>
                  </div>
                  <FaUserShield className="text-3xl text-red-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Employee Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {employees.filter(emp => emp.role === 'employee').length}
                    </p>
                  </div>
                  <FaUser className="text-3xl text-blue-600" />
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">All Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.employeeId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditUser(employee)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(employee._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found. Click "Create User" to add your first user.
                  </div>
                )}
              </div>
            </div>

            {/* Create User Modal */}
            {showAddUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h3>
                  <form onSubmit={handleCreateUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={userForm.name}
                          onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={userForm.email}
                          onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                        <select
                          required
                          value={userForm.role}
                          onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={userForm.employeeId}
                          onChange={(e) => setUserForm({...userForm, employeeId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={userForm.department}
                          onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                          type="text"
                          value={userForm.designation}
                          onChange={(e) => setUserForm({...userForm, designation: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={userForm.dateOfBirth}
                          onChange={(e) => setUserForm({...userForm, dateOfBirth: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={userForm.address}
                          onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddUser(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit User Modal */}
            {showEditUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h3>
                  <form onSubmit={handleUpdateUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={userForm.name}
                          onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={userForm.email}
                          onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                        <select
                          required
                          value={userForm.role}
                          onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={userForm.employeeId}
                          onChange={(e) => setUserForm({...userForm, employeeId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={userForm.department}
                          onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                          type="text"
                          value={userForm.designation}
                          onChange={(e) => setUserForm({...userForm, designation: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={userForm.dateOfBirth}
                          onChange={(e) => setUserForm({...userForm, dateOfBirth: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={userForm.address}
                          onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditUser(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )

      case 'employees':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Employee Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Employee management interface will be loaded here...</p>
            </div>
          </div>
        )

      case 'departments':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Department Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Department management interface will be loaded here...</p>
            </div>
          </div>
        )

      case 'salary':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Salary Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Salary management interface will be loaded here...</p>
            </div>
          </div>
        )

      case 'leave':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Leave Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Leave management interface will be loaded here...</p>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">System Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Email Notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">User Registration</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Auto Backup</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'salary':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Salary Management</h2>
            
            {/* Salary Requests Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Pending Salary Requests</h3>
                <button
                  onClick={() => {
                    console.log('=== MANUAL REFRESH CLICKED ===')
                    const refreshedRequests = getAllSalaryRequests()
                    console.log('Refreshed salary requests:', refreshedRequests)
                    setSalaryRequests(refreshedRequests)
                    alert(`Refreshed! Found ${refreshedRequests.length} total requests`)
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Refresh Requests
                </button>
              </div>
              
              {salaryRequests.filter(req => req.status === 'Pending').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>No pending salary requests</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salaryRequests.filter(req => req.status === 'Pending').map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUser className="text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{request.employeeName}</div>
                                <div className="text-sm text-gray-500">{request.employeeId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">${parseFloat(request.basicSalary).toLocaleString()}</div>
                              <div className="text-xs text-gray-500">Net: ${parseFloat(request.netSalary).toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.effectiveDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.requestedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* All Requests Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">All Salary Requests</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-yellow-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {salaryRequests.filter(req => req.status === 'Pending').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaCheck className="text-green-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Approved</p>
                      <p className="text-2xl font-bold text-green-700">
                        {salaryRequests.filter(req => req.status === 'Approved').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaTimes className="text-red-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm text-red-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-700">
                        {salaryRequests.filter(req => req.status === 'Rejected').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Records Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Salary Records</h3>
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-500">
                    API: {salaries.length} | Local: {getAllSalaryRecords().length} | Total: {allSalaries.length}
                  </span>
                  <button
                    onClick={() => {
                      console.log('=== REFRESH SALARY RECORDS ===')
                      const localRecords = getAllSalaryRecords()
                      const combined = [...salaries, ...localRecords]
                      setAllSalaries(combined)
                      alert(`Refreshed! API: ${salaries.length}, Local: ${localRecords.length}, Total: ${combined.length}`)
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              
              {allSalaries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>No salary records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allSalaries.map((salary, index) => {
                        return (
                        <tr key={salary.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Salary</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.employeeId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.employeeName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.basicSalary || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.allowances || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.deductions || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${parseFloat(salary.netSalary || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.payDate || salary.effectiveDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              salary.status === 'Active' ? 'bg-green-100 text-green-800' :
                              salary.status === 'Processed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {salary.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">admin</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  console.log('=== EDIT CLICKED ==='); 
                                  handleEditSalary(salary);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 border border-blue-300 rounded bg-blue-50"
                                title="Edit"
                                style={{cursor: 'pointer', zIndex: 10}}
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => {
                                  console.log('=== DELETE CLICKED ===');
                                  console.log('Salary data:', salary);
                                  console.log('Index:', index);
                                  handleDeleteSalary(salary, index);
                                }}
                                className="text-red-600 hover:text-red-800 p-2 border border-red-300 rounded bg-red-50"
                                title="Delete"
                                style={{cursor: 'pointer', zIndex: 10, position: 'relative'}}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      })
                    })</tbody>
                  </table>
                </div>
              )}
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
        <div className="text-xl text-gray-600">Loading admin dashboard...</div>
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
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-lg">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <FaUser className="text-purple-600 text-3xl" />
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
                  className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaCamera className="text-sm" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData?.name || 'Admin'}</h1>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{userData?.email || 'admin@company.com'}</span>
                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                    {userData?.role || 'Admin'}
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
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <FaUser className="text-purple-600 text-xl" />
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
                    className="absolute bottom-0 right-0 bg-purple-600 text-white px-2 py-1 rounded-full text-xs hover:bg-purple-700 transition-colors"
                  >
                    <FaCamera />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{userData?.name || 'Admin'}</h3>
                <p className="text-sm text-gray-600">{userData?.role || 'Admin'}</p>
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
                        ? 'bg-purple-600 text-white'
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

export default AdminDashboard
