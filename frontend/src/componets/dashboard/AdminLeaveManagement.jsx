import React, { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaTrash, FaSync, FaCalendarAlt } from 'react-icons/fa'
import AdminSidebar from './AdminSidebar'
import { leaveAPI } from '../../services/api'

const AdminLeaveManagement = () => {
  const [leaves, setLeaves] = useState([])
  const [currentFilter, setCurrentFilter] = useState('all')
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLeaves()
    
    // Listen for new leave requests
    const handleNewLeave = () => {
      console.log('📨 Admin received new leave request')
      loadLeaves()
    }
    
    const handleLeaveUpdate = () => {
      console.log('🔄 Admin received leave update')
      loadLeaves()
    }
    
    window.addEventListener('newLeaveRequest', handleNewLeave)
    window.addEventListener('leaveDataUpdated', handleLeaveUpdate)
    
    return () => {
      window.removeEventListener('newLeaveRequest', handleNewLeave)
      window.removeEventListener('leaveDataUpdated', handleLeaveUpdate)
    }
  }, [])

  useEffect(() => {
    // Update filtered data when filter changes
    if (currentFilter === 'all') {
      setFilteredData(leaves)
    } else if (currentFilter === 'pending') {
      setFilteredData(leaves.filter(l => l.status === 'Pending'))
    } else if (currentFilter === 'approved') {
      setFilteredData(leaves.filter(l => l.status === 'Approved'))
    } else if (currentFilter === 'rejected') {
      setFilteredData(leaves.filter(l => l.status === 'Rejected'))
    }
  }, [currentFilter, leaves])

  const loadLeaves = async () => {
    try {
      setLoading(true)
      console.log('=== ADMIN LOADING LEAVES FROM SERVER ===')
      
      const leavesData = await leaveAPI.getAll()
      
      console.log('✅ Loaded leaves from server:', leavesData.length)
      setLeaves(leavesData)
    } catch (error) {
      console.error('❌ Failed to load leaves from server:', error)
      setLeaves([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (leave) => {
    try {
      console.log('Approving leave:', leave)
      
      const updatedLeave = await leaveAPI.update(leave._id, {
        status: 'Approved',
        approvedAt: new Date().toISOString()
      })
      
      setLeaves(prev => prev.map(l => 
        l._id === leave._id ? updatedLeave : l
      ))
      
      window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
      
      alert(`✅ Leave request for ${leave.employeeName} approved!`)
    } catch (error) {
      console.error('Failed to approve leave:', error)
      alert('❌ Failed to approve leave request')
    }
  }

  const handleReject = async (leave) => {
    if (window.confirm(`Reject leave request for ${leave.employeeName}?`)) {
      try {
        console.log('Rejecting leave:', leave)
        
        const updatedLeave = await leaveAPI.update(leave._id, {
          status: 'Rejected',
          rejectedAt: new Date().toISOString()
        })
        
        setLeaves(prev => prev.map(l => 
          l._id === leave._id ? updatedLeave : l
        ))
        
        window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
        
        alert(`❌ Leave request for ${leave.employeeName} rejected.`)
      } catch (error) {
        console.error('Failed to reject leave:', error)
        alert('❌ Failed to reject leave request')
      }
    }
  }

  const handleDelete = async (leave) => {
    if (window.confirm(`Delete leave request for ${leave.employeeName}?`)) {
      try {
        console.log('Deleting leave:', leave)
        
        await leaveAPI.delete(leave._id)
        
        setLeaves(prev => prev.filter(l => l._id !== leave._id))
        
        window.dispatchEvent(new CustomEvent('leaveDataUpdated'))
        
        alert(`🗑️ Leave request for ${leave.employeeName} deleted.`)
      } catch (error) {
        console.error('Failed to delete leave:', error)
        alert('❌ Failed to delete leave request')
      }
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <AdminSidebar />
      
      <div className='flex-1 ml-64'>
        <div className='p-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
                  <FaCalendarAlt className='mr-3 text-teal-600' />
                  Leave Management
                </h2>
                <button
                  onClick={loadLeaves}
                  className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2'
                >
                  <FaSync />
                  <span>Refresh</span>
                </button>
              </div>
              
              {/* Filter Buttons */}
              <div className='flex flex-wrap gap-2 mt-4'>
                <button
                  onClick={() => setCurrentFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentFilter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All ({leaves.length})
                </button>
                <button
                  onClick={() => setCurrentFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentFilter === 'pending'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pending ({leaves.filter(l => l.status === 'Pending').length})
                </button>
                <button
                  onClick={() => setCurrentFilter('approved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentFilter === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Approved ({leaves.filter(l => l.status === 'Approved').length})
                </button>
                <button
                  onClick={() => setCurrentFilter('rejected')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentFilter === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Rejected ({leaves.filter(l => l.status === 'Rejected').length})
                </button>
              </div>
            </div>

            {/* Leave Requests Table */}
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <h3 className='text-xl font-bold text-gray-800 mb-4'>Leave Requests</h3>
              
              {loading ? (
                <div className='text-center py-8'>Loading...</div>
              ) : filteredData.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                  No leave requests found
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Employee ID</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Name</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Department</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Leave Type</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>From</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>To</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {filteredData.map((leave) => (
                        <tr key={leave._id || leave.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 text-sm text-gray-900'>{leave.employeeId}</td>
                          <td className='px-6 py-4 text-sm text-gray-900'>{leave.employeeName}</td>
                          <td className='px-6 py-4 text-sm text-gray-900'>{leave.department}</td>
                          <td className='px-6 py-4 text-sm text-gray-900'>{leave.leaveType}</td>
                          <td className='px-6 py-4 text-sm text-gray-900'>{leave.fromDate}</td>
                          <td className='px-6 py-4 text-sm text-gray-900'>{leave.toDate}</td>
                          <td className='px-6 py-4 text-sm'>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 text-sm'>
                            <div className='flex flex-wrap gap-2'>
                              {leave.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(leave)}
                                    className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1'
                                  >
                                    <FaCheck />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    onClick={() => handleReject(leave)}
                                    className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1'
                                  >
                                    <FaTimes />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(leave)}
                                className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1'
                              >
                                <FaTrash />
                                <span>Delete</span>
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
      </div>
    </div>
  )
}

export default AdminLeaveManagement
