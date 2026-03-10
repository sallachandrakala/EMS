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
  FaFileAlt
} from 'react-icons/fa'
import { leaveAPI } from '../services/api'

const LeaveManagement = () => {
  const { user } = useAuth()
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

  useEffect(() => {
    loadLeaves()
  }, [])

  const loadLeaves = async () => {
    try {
      setLoading(true)
      const response = await leaveAPI.getAll()
      // Filter leaves for current user
      const userLeaves = response.data.filter(leave => 
        leave.employeeId === user?.employeeId || 
        leave.employeeName === user?.name ||
        leave.email === user?.email
      )
      setLeaves(userLeaves)
    } catch (error) {
      console.error('Failed to load leaves:', error)
      // Fallback to mock data if API fails
      setLeaves([
        {
          id: 1,
          leaveType: 'Sick Leave',
          fromDate: '2024-09-15',
          toDate: '2024-09-16',
          reason: 'Fever and headache',
          duration: 'Full Day',
          status: 'Pending',
          appliedDate: '2024-09-15',
          contactNumber: '+1234567890',
          emergencyContact: '+0987654321'
        },
        {
          id: 2,
          leaveType: 'Annual Leave',
          fromDate: '2024-09-10',
          toDate: '2024-09-12',
          reason: 'Family vacation',
          duration: 'Multiple Days',
          status: 'Approved',
          appliedDate: '2024-09-08',
          contactNumber: '+1234567890',
          emergencyContact: '+0987654321'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const leaveData = {
        ...formData,
        employeeId: user?.employeeId || 'EMP001',
        employeeName: user?.name || 'Employee',
        email: user?.email || 'employee@company.com',
        department: user?.department || 'IT',
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      }

      if (editingLeave) {
        await leaveAPI.update(editingLeave.id, leaveData)
        alert('Leave request updated successfully!')
      } else {
        await leaveAPI.create(leaveData)
        alert('Leave request submitted successfully!')
      }

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
      loadLeaves()
    } catch (error) {
      console.error('Failed to submit leave:', error)
      alert('Failed to submit leave request')
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        await leaveAPI.delete(id)
        alert('Leave request deleted successfully!')
        loadLeaves()
      } catch (error) {
        console.error('Failed to delete leave:', error)
        alert('Failed to delete leave request')
      }
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="text-green-600" />
      case 'rejected':
        return <FaTimesCircle className="text-red-600" />
      case 'pending':
        return <FaHourglassHalf className="text-yellow-600" />
      default:
        return <FaFileAlt className="text-gray-600" />
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
