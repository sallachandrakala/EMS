import React, { useState, useEffect } from 'react'
import { FaSignOutAlt, FaPlus, FaTimes, FaSearch, FaEdit, FaTrash, FaCalendarAlt, FaUser, FaClock } from 'react-icons/fa'
import { leaveAPI } from '../../services/api.js'

const Leave = () => {
  const [showAddPage, setShowAddPage] = useState(false)
  const [showEditPage, setShowEditPage] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    email: '',
    department: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadLeaves()
  }, [])

  const loadLeaves = async () => {
    try {
      setLoading(true)
      console.log('=== LOADING LEAVES FROM SERVER ===')
      
      // Try to load from server API first
      try {
        const serverLeaves = await leaveAPI.getAll()
        console.log('✅ Loaded leaves from server:', serverLeaves.length)
        setLeaves(serverLeaves)
      } catch (serverError) {
        console.error('❌ Server load failed:', serverError)
        console.log('Falling back to localStorage...')
        
        // Fallback to localStorage
        const storedLeaves = localStorage.getItem('leaveRequests')
        const leavesData = storedLeaves ? JSON.parse(storedLeaves) : []
        
        console.log('Loaded leaves from localStorage:', leavesData.length)
        setLeaves(leavesData)
      }
    } catch (error) {
      console.error('Failed to load leaves:', error)
      setLeaves([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.employeeId || !formData.employeeName || !formData.leaveType || !formData.fromDate || !formData.toDate) {
      alert('❌ Please fill in all required fields')
      return
    }

    try {
      const leaveData = {
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        email: formData.email,
        department: formData.department,
        leaveType: formData.leaveType,
        fromDate: new Date(formData.fromDate),
        toDate: new Date(formData.toDate),
        reason: formData.reason,
        status: formData.status || 'Pending',
        appliedDate: formData.appliedDate,
        submittedBy: 'employee',
        submittedAt: new Date().toISOString()
      }

      console.log('📋 Submitting leave request:', leaveData)
      
      if (selectedLeave) {
        // Update existing leave
        try {
          console.log('🔄 Updating leave via server API...')
          const leaveId = selectedLeave._id || selectedLeave.id
          const updatedLeave = await leaveAPI.update(leaveId, leaveData)
          console.log('✅ Server response:', updatedLeave)
          
          // Update local state
          setLeaves(prev => 
            prev.map(leave => 
              (leave._id === selectedLeave._id || leave.id === selectedLeave.id)
                ? { ...leave, ...leaveData }
                : leave
            )
          )
          
          console.log('✅ Leave updated successfully via server API')
          alert('✅ Leave request updated successfully!')
          
        } catch (serverError) {
          console.error('❌ Server update failed:', serverError)
          console.log('Falling back to localStorage...')
          
          // Fallback to localStorage
          const storedLeaves = localStorage.getItem('leaveRequests')
          let leavesArray = storedLeaves ? JSON.parse(storedLeaves) : []
          
          leavesArray = leavesArray.map(leave => 
            (leave._id === selectedLeave._id || leave.id === selectedLeave.id)
              ? { ...leave, ...leaveData }
              : leave
          )
          
          localStorage.setItem('leaveRequests', JSON.stringify(leavesArray))
          setLeaves(leavesArray)
          
          console.log('✅ Leave updated locally (server unavailable)')
          alert('✅ Leave request updated locally!')
        }
      } else {
        // Add new leave
        try {
          console.log('🔄 Creating leave via server API...')
          const newLeave = await leaveAPI.create(leaveData)
          console.log('✅ Server response:', newLeave)
          
          // Update local state
          setLeaves(prev => [...prev, newLeave])
          
          console.log('✅ Leave created successfully via server API')
          alert('✅ Leave request submitted successfully!')
          
        } catch (serverError) {
          console.error('❌ Server creation failed:', serverError)
          console.log('Falling back to localStorage...')
          
          // Fallback to localStorage
          const storedLeaves = localStorage.getItem('leaveRequests')
          let leavesArray = storedLeaves ? JSON.parse(storedLeaves) : []
          
          const newLeaveData = {
            ...leaveData,
            id: Date.now(),
            _id: Date.now().toString()
          }
          
          leavesArray.push(newLeaveData)
          localStorage.setItem('leaveRequests', JSON.stringify(leavesArray))
          setLeaves(leavesArray)
          
          console.log('✅ Leave created locally (server unavailable)')
          alert('✅ Leave request submitted locally!')
        }
      }
      
      // Dispatch event to notify admin dashboard
      window.dispatchEvent(new CustomEvent('newLeaveRequest'))
      window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
      
      // Reload and close
      loadLeaves()
      closeAddPage()
    } catch (error) {
      console.error('Failed to submit leave request:', error)
      alert('❌ Failed to submit leave request. Please try again.')
    }
  }

  const handleEdit = (leave) => {
    setSelectedLeave(leave)
    setFormData({
      employeeId: leave.employeeId,
      employeeName: leave.employeeName,
      email: leave.email,
      department: leave.department,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      reason: leave.reason,
      status: leave.status,
      appliedDate: leave.appliedDate
    })
    setShowEditPage(true)
  }

  const handleDelete = async (leave) => {
    if (window.confirm(`Are you sure you want to delete this leave request for ${leave.employeeName}?`)) {
      try {
        console.log('🔄 Deleting leave request:', leave)
        
        // Try to delete via server API first
        try {
          console.log('🔄 Deleting leave via server API...')
          const leaveId = leave._id || leave.id
          await leaveAPI.delete(leaveId)
          console.log('✅ Deleted from server')
          
          // Update local state
          setLeaves(prev => prev.filter(l => l._id !== leaveId && l.id !== leaveId))
          
          console.log('✅ Leave deleted successfully via server API')
          alert('✅ Leave request deleted successfully!')
          
          // Reload data from server
          loadLeaves()
          
        } catch (serverError) {
          console.error('❌ Server delete failed:', serverError)
          console.log('Falling back to localStorage...')
          
          // Fallback to localStorage
          const storedLeaves = localStorage.getItem('leaveRequests')
          if (storedLeaves) {
            const leavesArray = JSON.parse(storedLeaves)
            const updatedLeaves = leavesArray.filter(l => 
              l._id !== (leave._id || leave.id) && l.id !== (leave._id || leave.id)
            )
            localStorage.setItem('leaveRequests', JSON.stringify(updatedLeaves))
            console.log('✅ Deleted from localStorage')
          }
          
          // Update state
          setLeaves(prev => prev.filter(l => l._id !== (leave._id || leave.id) && l.id !== (leave._id || leave.id)))
          
          console.log('✅ Leave deleted locally (server unavailable)')
          alert('✅ Leave request deleted locally!')
        }
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
        
      } catch (error) {
        console.error('Failed to delete leave request:', error)
        alert('❌ Failed to delete leave request. Please try again.')
      }
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login page
      window.location.href = '/login'
    }
  }

  const closeAddPage = () => {
    setShowAddPage(false)
    setShowEditPage(false)
    setSelectedLeave(null)
    setFormData({
      employeeId: '',
      employeeName: '',
      email: '',
      department: '',
      leaveType: '',
      fromDate: '',
      toDate: '',
      reason: '',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    })
  }

  const filteredLeaves = leaves.filter(leave =>
    leave.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (showAddPage || showEditPage) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='p-8 bg-white pt-4'>
          <div className='flex justify-between items-center mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>
                {selectedLeave ? 'Edit Leave Request' : 'Add New Leave'}
              </h1>
              <p className='text-gray-600 mt-1'>
                {selectedLeave ? 'Update leave request details' : 'Submit a new leave request'}
              </p>
            </div>
            <button
              onClick={closeAddPage}
              className='flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Personal Information Section */}
              <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
                  <FaUser className='mr-2 text-teal-600' />
                  Employee Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Employee ID <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={formData.employeeId}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      placeholder='Enter employee ID'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Full Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={formData.employeeName}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      placeholder='Enter full name'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      placeholder='Enter email address'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    >
                      <option value=''>Select Department</option>
                      <option value='IT'>IT</option>
                      <option value='HR'>HR</option>
                      <option value='Finance'>Finance</option>
                      <option value='Marketing'>Marketing</option>
                      <option value='Operations'>Operations</option>
                      <option value='Sales'>Sales</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Leave Details Section */}
              <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
                  <FaCalendarAlt className='mr-2 text-teal-600' />
                  Leave Details
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Leave Type <span className='text-red-500'>*</span>
                    </label>
                    <select
                      value={formData.leaveType}
                      onChange={(e) => setFormData(prev => ({ ...prev, leaveType: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    >
                      <option value=''>Select Leave Type</option>
                      <option value='Sick Leave'>Sick Leave</option>
                      <option value='Annual Leave'>Annual Leave</option>
                      <option value='Personal Leave'>Personal Leave</option>
                      <option value='Maternity Leave'>Maternity Leave</option>
                      <option value='Paternity Leave'>Paternity Leave</option>
                      <option value='Emergency Leave'>Emergency Leave</option>
                      <option value='Study Leave'>Study Leave</option>
                      <option value='Unpaid Leave'>Unpaid Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    >
                      <option value='Pending'>Pending</option>
                      <option value='Approved'>Approved</option>
                      <option value='Rejected'>Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      From Date <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='date'
                      value={formData.fromDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      To Date <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='date'
                      value={formData.toDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    />
                  </div>
                </div>

                <div className='mt-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Reason for Leave
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    rows='4'
                    placeholder='Enter reason for leave request'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={closeAddPage}
                  className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors'
                >
                  {selectedLeave ? 'Update Leave Request' : 'Submit Leave Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='p-8 bg-white pt-4'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Leave Management</h1>
        </div>
        <div className='flex flex-col items-center mb-8'>
          <div className='flex items-center justify-center space-x-4 mb-4'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search by employee name or ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-64'
              />
              <FaSearch className='absolute left-3 top-3 text-gray-400' />
            </div>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => setShowAddPage(true)}
                className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
              >
                <FaPlus />
                <span>Add Leave</span>
              </button>
              <button
                onClick={handleLogout}
                className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-800'>Leave Requests</h2>
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <FaClock className='text-teal-600' />
                <span>Total: {filteredLeaves.length} requests</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='text-gray-500'>Loading leave requests...</div>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-gray-500 mb-4'>No leave requests found</div>
              <button
                onClick={() => setShowAddPage(true)}
                className='inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
              >
                <FaPlus />
                <span>Add First Leave Request</span>
              </button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200 bg-gray-50'>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Employee ID</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Department</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Leave Type</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>From Date</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>To Date</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredLeaves.map((leave) => (
                    <tr key={leave._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {leave.employeeId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {leave.employeeName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {leave.department}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {leave.leaveType}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(leave.toDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleEdit(leave)}
                            className='text-teal-600 hover:text-teal-900'
                            title='Edit'
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(leave)}
                            className='text-red-600 hover:text-red-900'
                            title='Delete'
                          >
                            <FaTrash />
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
      </div>
    </div>
  )
}

export default Leave
