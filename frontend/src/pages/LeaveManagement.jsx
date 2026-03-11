import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaDownload,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaFileAlt,
  FaUser
} from 'react-icons/fa'

const LeaveManagement = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLeave, setEditingLeave] = useState(null)
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    duration: 'Full Day',
    contactNumber: '',
    emergencyContact: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [profileData, setProfileData] = useState({
    employeeId: user?.employeeId || 'EMP001',
    name: user?.name || 'Employee',
    email: user?.email || 'employee@company.com',
    department: user?.department || 'IT',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadLeaves()
    // Update profile data when user changes
    setProfileData({
      employeeId: user?.employeeId || 'EMP001',
      name: user?.name || 'Employee',
      email: user?.email || 'employee@company.com',
      department: user?.department || 'IT',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }, [user])

  const loadLeaves = () => {
    console.log('=== LOADING LEAVE DATA (SHOW ALL REQUESTS) ===')
    
    // ONLY load from localStorage - same as salary system
    const storedLeaves = localStorage.getItem('leaveRequests')
    const leaves = storedLeaves ? JSON.parse(storedLeaves) : []
    console.log('Loaded leave requests from localStorage:', leaves.length)
    console.log('All leave requests:', leaves)
    
    // SHOW ALL REQUESTS - Don't filter by employeeId
    // This allows employees to see all requests they create, regardless of the ID they enter
    const sortedLeaves = leaves.sort((a, b) => {
      const dateA = new Date(a.appliedDate || a.submittedAt || 0)
      const dateB = new Date(b.appliedDate || b.submittedAt || 0)
      return dateB - dateA
    })
    
    console.log('Total leave data to display:', sortedLeaves.length, 'requests')
    
    // If no data in localStorage, show empty (don't use hardcoded data)
    setLeaves(sortedLeaves)
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('🔵 LEAVE FORM SUBMITTED')
    console.log('Form data:', formData)
    console.log('Editing leave:', editingLeave)
    
    // Validate required fields
    if (!formData.leaveType || !formData.fromDate || !formData.toDate) {
      alert('❌ Please fill in all required fields:\n- Leave Type\n- From Date\n- To Date')
      return
    }
    
    if (editingLeave) {
      console.log('=== UPDATING EXISTING LEAVE REQUEST ===')
      
      try {
        const updatedData = {
          leaveType: formData.leaveType,
          fromDate: formData.fromDate,
          toDate: formData.toDate,
          reason: formData.reason,
          duration: formData.duration,
          contactNumber: formData.contactNumber,
          emergencyContact: formData.emergencyContact
        }
        
        const leaveId = editingLeave._id || editingLeave.id
        console.log('Updating leave with ID:', leaveId)
        
        // Update in localStorage
        const storedLeaves = localStorage.getItem('leaveRequests')
        if (storedLeaves) {
          const leavesArray = JSON.parse(storedLeaves)
          const updatedLeaves = leavesArray.map(l => {
            if (l._id === leaveId || l.id === leaveId) {
              return { ...l, ...updatedData }
            }
            return l
          })
          
          localStorage.setItem('leaveRequests', JSON.stringify(updatedLeaves))
          console.log('✅ Updated leaveRequests in localStorage')
        }
        
        alert('✅ Leave request updated successfully!')
        setShowAddForm(false)
        setEditingLeave(null)
        setFormData({
          leaveType: '',
          fromDate: '',
          toDate: '',
          reason: '',
          duration: 'Full Day',
          contactNumber: '',
          emergencyContact: ''
        })
        
        // Reload data
        loadLeaves()
        
        // Notify admin dashboard
        window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
      } catch (error) {
        console.error('Update failed:', error)
        alert('❌ Failed to update leave request!')
      }
    } else {
      console.log('=== CREATING NEW LEAVE REQUEST ===')
      
      const newLeaveData = {
        id: Date.now(),
        _id: Date.now().toString(),
        employeeId: user?.employeeId || 'EMP001',
        employeeName: user?.name || 'Employee',
        email: user?.email || 'employee@company.com',
        department: user?.department || 'IT',
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        duration: formData.duration || 'Full Day',
        contactNumber: formData.contactNumber || '',
        emergencyContact: formData.emergencyContact || '',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        submittedBy: 'employee',
        submittedAt: new Date().toISOString()
      }
      
      console.log('New leave request data:', newLeaveData)
      
      try {
        // Save directly to localStorage
        const storedLeaves = localStorage.getItem('leaveRequests')
        const leavesArray = storedLeaves ? JSON.parse(storedLeaves) : []
        
        console.log('📦 Current leave requests in localStorage:', leavesArray.length)
        
        leavesArray.push(newLeaveData)
        localStorage.setItem('leaveRequests', JSON.stringify(leavesArray))
        
        console.log('✅ Saved to localStorage:', leavesArray.length, 'total requests')
        console.log('📝 Last saved request:', leavesArray[leavesArray.length - 1])
        
        alert('✅ Leave request submitted successfully!\n\nType: ' + newLeaveData.leaveType + '\nFrom: ' + newLeaveData.fromDate + '\nTo: ' + newLeaveData.toDate + '\n\nAdmin will review your request.')
        
        // Dispatch events to notify admin dashboard
        console.log('📡 Dispatching newLeaveRequest event to admin dashboard...')
        window.dispatchEvent(new CustomEvent('newLeaveRequest', { 
          detail: { request: newLeaveData } 
        }))
        window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
        
        console.log('✅ Events dispatched successfully')
        
        // Reset form
        setFormData({
          leaveType: '',
          fromDate: '',
          toDate: '',
          reason: '',
          duration: 'Full Day',
          contactNumber: '',
          emergencyContact: ''
        })
        setShowAddForm(false)
        setEditingLeave(null)
        
        // Reload data to show the new request
        loadLeaves()
      } catch (error) {
        console.error('❌ Error submitting leave request:', error)
        alert('❌ Failed to submit leave request! Error: ' + error.message)
      }
    }
  }

  const handleEdit = (leave) => {
    setEditingLeave(leave)
    setFormData({
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      reason: leave.reason,
      duration: leave.duration || 'Full Day',
      contactNumber: leave.contactNumber || '',
      emergencyContact: leave.emergencyContact || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    console.log('=== DELETE BUTTON CLICKED ===')
    console.log('Leave to delete:', id)
    
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        // Delete from localStorage
        const storedLeaves = localStorage.getItem('leaveRequests')
        
        if (storedLeaves) {
          const leavesArray = JSON.parse(storedLeaves)
          const updatedLeaves = leavesArray.filter(l => 
            (l.id !== id && l._id !== id)
          )
          localStorage.setItem('leaveRequests', JSON.stringify(updatedLeaves))
          console.log('Deleted from leaveRequests. Remaining:', updatedLeaves.length)
        }
        
        // Update state
        const updatedLeaves = leaves.filter(l => 
          (l.id !== id && l._id !== id)
        )
        setLeaves(updatedLeaves)
        
        alert('✅ Leave request deleted successfully!')
        
        // Notify admin dashboard
        window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
        
        // Reload data
        loadLeaves()
      } catch (error) {
        console.error('Failed to delete leave:', error)
        alert('❌ Failed to delete leave request!')
      }
    }
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    
    try {
      // Validate password if changing
      if (profileData.newPassword || profileData.confirmPassword) {
        if (!profileData.currentPassword) {
          alert('Please enter your current password to change it.')
          return
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          alert('New passwords do not match!')
          return
        }
        if (profileData.newPassword.length < 6) {
          alert('New password must be at least 6 characters long.')
          return
        }
      }
      
      // Prepare updated user data
      const updatedData = {
        employeeId: profileData.employeeId,
        name: profileData.name,
        email: profileData.email,
        department: profileData.department
      }
      
      console.log('=== PROFILE UPDATE ===')
      console.log('Current user:', user)
      console.log('Updated data:', updatedData)
      
      // Update password if provided
      if (profileData.newPassword) {
        // Verify current password (simple check)
        if (user?.password && user.password !== profileData.currentPassword) {
          alert('❌ Current password is incorrect!')
          return
        }
        updatedData.password = profileData.newPassword
      }
      
      // Update user in auth context and localStorage
      if (updateUser) {
        const result = updateUser(updatedData)
        console.log('Updated user via context:', result)
      } else {
        // Fallback if updateUser is not available
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          const updatedUser = { ...userData, ...updatedData }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          console.log('Updated user via localStorage:', updatedUser)
        }
      }
      
      const message = profileData.newPassword 
        ? '✅ Profile and password updated successfully! Please login again with your new credentials.' 
        : '✅ Profile updated successfully!'
      
      alert(message)
      setShowProfileEdit(false)
      
      // Reset password fields
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // If password was changed, logout and redirect to login
      if (profileData.newPassword) {
        setTimeout(() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }, 1000)
      } else {
        // Just reload to show updated info
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('❌ Failed to update profile. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }


  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || leave.status?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const leaveStats = {
    total: leaves.length,
    approved: leaves.filter(l => l.status === 'Approved').length,
    pending: leaves.filter(l => l.status === 'Pending').length,
    rejected: leaves.filter(l => l.status === 'Rejected').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading leave management...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h3 className='text-2xl font-bold text-gray-800'>Leave Management</h3>
            <p className='text-gray-600'>Manage your leave requests and view status</p>
          </div>
          <div className='flex space-x-3'>
            <button 
              onClick={() => navigate('/employee-dashboard')}
              className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => setShowAddForm(true)}
              className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
            >
              <FaPlus className='mr-2' />
              Request Leave
            </button>
          </div>
        </div>

        {/* Employee Profile Card */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg shadow-md border-2 border-teal-300 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-teal-800 flex items-center space-x-2">
              <FaUser />
              <span>My Profile</span>
            </h2>
            <button
              onClick={() => setShowProfileEdit(!showProfileEdit)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-all"
            >
              <FaEdit />
              <span>{showProfileEdit ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
          
          {!showProfileEdit ? (
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {(user?.name || 'E').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-800">{user?.name || 'Employee'}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Employee ID</p>
                  <p className="text-lg font-bold text-gray-800">{user?.employeeId || 'EMP001'}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Department</p>
                  <p className="text-lg font-bold text-gray-800">{user?.department || 'IT'}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                  <p className="text-lg font-bold text-gray-800">{user?.email || 'employee@company.com'}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={profileData.employeeId}
                    onChange={(e) => setProfileData({...profileData, employeeId: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              {/* Password Change Section */}
              <div className="border-t-2 border-gray-200 pt-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave password fields empty if you don't want to change your password.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileEdit(false)
                    setProfileData({
                      employeeId: user?.employeeId || 'EMP001',
                      name: user?.name || 'Employee',
                      email: user?.email || 'employee@company.com',
                      department: user?.department || 'IT',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-600 p-3 rounded-lg text-white">
                <FaFileAlt />
              </div>
              <div>
                <p className="text-gray-700 text-lg font-semibold">Total Leaves</p>
                <p className="text-gray-900 text-2xl font-bold">{leaveStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 p-3 rounded-lg text-white">
                <FaCheckCircle />
              </div>
              <div>
                <p className="text-gray-700 text-lg font-semibold">Approved</p>
                <p className="text-gray-900 text-2xl font-bold">{leaveStats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500 p-3 rounded-lg text-white">
                <FaHourglassHalf />
              </div>
              <div>
                <p className="text-gray-700 text-lg font-semibold">Pending</p>
                <p className="text-gray-900 text-2xl font-bold">{leaveStats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 p-3 rounded-lg text-white">
                <FaTimesCircle />
              </div>
              <div>
                <p className="text-gray-700 text-lg font-semibold">Rejected</p>
                <p className="text-gray-900 text-2xl font-bold">{leaveStats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search by leave type or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center">
            <FaFilter className='mr-2' />
            Filter
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center">
            <FaDownload className='mr-2' />
            Export
          </button>
        </div>

        {/* Leave Table */}
        <div className='bg-gray-50 rounded-lg p-6'>
          <div className='overflow-x-auto'>
            <table className='w-full bg-white rounded-lg overflow-hidden'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Leave Type</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Duration</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>From Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>To Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Reason</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Applied Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>#{leave.id}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{leave.leaveType}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{leave.duration}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{leave.fromDate}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{leave.toDate}</td>
                    <td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate'>{leave.reason}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{leave.appliedDate}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      <div className='flex space-x-2'>
                        <button className='text-blue-600 hover:text-blue-800' title='View'>
                          <FaEye />
                        </button>
                        {leave.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleEdit(leave)}
                              className='text-green-600 hover:text-green-800' 
                              title='Edit'
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(leave.id)}
                              className='text-red-600 hover:text-red-800' 
                              title='Delete'
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Leave Modal */}
        {showAddForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto'>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>
                {editingLeave ? 'Edit Leave Request' : 'Request Leave'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Leave Type</label>
                    <select
                      value={formData.leaveType}
                      onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    >
                      <option value=''>Select Leave Type</option>
                      <option value='Sick Leave'>Sick Leave</option>
                      <option value='Annual Leave'>Annual Leave</option>
                      <option value='Casual Leave'>Casual Leave</option>
                      <option value='Maternity Leave'>Maternity Leave</option>
                      <option value='Paternity Leave'>Paternity Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Duration</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    >
                      <option value='Half Day'>Half Day</option>
                      <option value='Full Day'>Full Day</option>
                      <option value='Multiple Days'>Multiple Days</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>From Date</label>
                    <input
                      type='date'
                      value={formData.fromDate}
                      onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>To Date</label>
                    <input
                      type='date'
                      value={formData.toDate}
                      onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Contact Number</label>
                    <input
                      type='tel'
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      placeholder='Contact during leave'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Emergency Contact</label>
                    <input
                      type='tel'
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      placeholder='Emergency contact'
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Reason</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      rows='4'
                      placeholder='Enter reason for leave'
                      required
                    />
                  </div>
                </div>
                <div className='flex justify-end space-x-3 mt-6'>
                  <button
                    type='button'
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingLeave(null)
                    }}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700'
                  >
                    {editingLeave ? 'Update' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaveManagement
