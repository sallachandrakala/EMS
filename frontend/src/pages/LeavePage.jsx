import React, { useState } from 'react'
import LeaveTable from '../components/LeaveTable'
import { FaPlus, FaTimes } from 'react-icons/fa'

const LeavePage = () => {
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      leaveType: 'Sick Leave',
      fromDate: '15-09-2024',
      toDate: '16-09-2024',
      description: 'Fever',
      appliedDate: '15-09-2024',
      status: 'Rejected'
    },
    {
      id: 2,
      leaveType: 'Annual Leave',
      fromDate: '15-09-2024',
      toDate: '17-09-2024',
      description: 'Annual Leave',
      appliedDate: '15-09-2024',
      status: 'Rejected'
    },
    {
      id: 3,
      leaveType: 'Casual Leave',
      fromDate: '15-09-2024',
      toDate: '17-09-2024',
      description: 'Casual Leave',
      appliedDate: '15-09-2024',
      status: 'Pending'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLeave, setEditingLeave] = useState(null)
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    description: ''
  })

  const handleAddLeave = () => {
    setShowAddForm(true)
    setEditingLeave(null)
    setFormData({
      leaveType: '',
      fromDate: '',
      toDate: '',
      description: ''
    })
  }

  const handleEditLeave = (leave) => {
    setEditingLeave(leave)
    setFormData({
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      description: leave.description
    })
    setShowAddForm(true)
  }

  const handleDeleteLeave = (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      setLeaves(leaves.filter(leave => leave.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingLeave) {
      // Update existing leave
      setLeaves(leaves.map(leave => 
        leave.id === editingLeave.id 
          ? { 
              ...leave, 
              ...formData,
              appliedDate: new Date().toLocaleDateString('en-GB')
            }
          : leave
      ))
    } else {
      // Add new leave
      const newLeave = {
        id: Date.now(),
        ...formData,
        appliedDate: new Date().toLocaleDateString('en-GB'),
        status: 'Pending'
      }
      setLeaves([...leaves, newLeave])
    }

    setShowAddForm(false)
    setFormData({
      leaveType: '',
      fromDate: '',
      toDate: '',
      description: ''
    })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="p-6">
      <LeaveTable 
        leaves={leaves}
        onAddLeave={handleAddLeave}
        onEditLeave={handleEditLeave}
        onDeleteLeave={handleDeleteLeave}
      />

      {/* Add/Edit Leave Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingLeave ? 'Edit Leave' : 'Add Leave'}
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter leave description"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {editingLeave ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeavePage
