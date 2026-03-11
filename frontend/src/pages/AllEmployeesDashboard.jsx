import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaUser, 
  FaCheckCircle,
  FaHourglassHalf,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaSync
} from 'react-icons/fa'
import { employeeData, getEmployeeLeaveRequests, getEmployeeSalaryRecords } from '../data/employeeData'
import { updateAllEmployees, updateEmployee, bulkUpdateEmployees } from '../data/employeeUpdates'

const AllEmployeesDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [allEmployees, setAllEmployees] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    setAllEmployees(employeeData)
    // Default to first employee
    setSelectedEmployee(employeeData[0])
  }, [])

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee)
    setEditMode(false)
    setEditForm({})
  }

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setEditForm(employee)
    setEditMode(true)
  }

  const handleSaveEmployee = () => {
    if (selectedEmployee) {
      const updatedEmployee = updateEmployee(selectedEmployee.employeeId, editForm)
      const updatedList = allEmployees.map(emp => 
        emp.employeeId === selectedEmployee.employeeId ? updatedEmployee : emp
      )
      setAllEmployees(updatedList)
      setSelectedEmployee(updatedEmployee)
      setEditMode(false)
      setEditForm({})
      
      // Show success message
      alert(`Employee ${updatedEmployee.name} updated successfully!`)
    }
  }

  const handleBulkUpdate = () => {
    // Example bulk update - increase all salaries by 5%
    const bulkUpdates = allEmployees.map(employee => ({
      employeeId: employee.employeeId,
      data: {
        ...employee,
        salary: Math.round(employee.salary * 1.05)
      }
    }))
    
    const updatedEmployees = bulkUpdateEmployees(bulkUpdates)
    setAllEmployees(updatedEmployees)
    
    // Update selected employee if it's in the list
    if (selectedEmployee) {
      const updatedSelected = updatedEmployees.find(emp => emp.employeeId === selectedEmployee.employeeId)
      setSelectedEmployee(updatedSelected)
    }
    
    alert('All employees updated successfully!')
  }

  const handleViewProfile = (employee) => {
    // Store selected employee data for profile page
    localStorage.setItem('selectedEmployeeProfile', JSON.stringify(employee))
    navigate('/employee-dashboard/profile')
  }

  const handleViewSalary = (employee) => {
    // Store selected employee data for salary page
    localStorage.setItem('selectedEmployeeSalary', JSON.stringify(employee))
    localStorage.setItem('fromAllEmployeesDashboard', 'true') // Set flag for salary access
    navigate('/salary-management')
  }

  const handleViewLeave = (employee) => {
    // Store selected employee data for leave page
    localStorage.setItem('selectedEmployeeLeave', JSON.stringify(employee))
    navigate('/leave-management')
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Employee Sidebar */}
      <div className='w-64 bg-gray-900 text-white p-4 fixed h-full'>
        <h2 className='text-xl font-bold mb-6'>All Employees</h2>
        <div className='space-y-2'>
          {allEmployees.map(employee => (
            <button
              key={employee.id}
              onClick={() => handleEmployeeSelect(employee)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedEmployee?.id === employee.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className='flex items-center justify-between'>
                <span>{employee.name}</span>
                <span className='text-xs opacity-75'>{employee.employeeId}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className='mt-8 pt-8 border-t border-gray-700'>
          <h3 className='text-sm font-semibold mb-4 text-gray-400'>Employee Actions</h3>
          <div className='space-y-2'>
            {selectedEmployee && (
              <button
                onClick={() => handleEditEmployee(selectedEmployee)}
                className='w-full text-left px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors flex items-center'
              >
                <FaEdit className='mr-2' />
                {editMode ? 'Cancel Edit' : 'Edit Employee'}
              </button>
            )}
            {editMode && (
              <button
                onClick={handleSaveEmployee}
                className='w-full text-left px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center'
              >
                <FaSave className='mr-2' />
                Save Changes
              </button>
            )}
            <button
              onClick={handleBulkUpdate}
              className='w-full text-left px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center'
            >
              <FaSync className='mr-2' />
              Update All Salaries (+5%)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 ml-64'>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Employees Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  {selectedEmployee ? `Viewing: ${selectedEmployee.name} - ${selectedEmployee.employeeId}` : 'Select an employee'}
                  {editMode && ` (Editing Mode)`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {editMode && selectedEmployee && (
            <div className="bg-blue-50 border-b border-blue-200 px-8 py-4">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Edit Employee: {selectedEmployee.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name || selectedEmployee.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email || selectedEmployee.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || selectedEmployee.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={editForm.department || selectedEmployee.department}
                      onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={editForm.position || selectedEmployee.position}
                      onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    <input
                      type="number"
                      value={editForm.salary || selectedEmployee.salary}
                      onChange={(e) => setEditForm({...editForm, salary: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Balance</label>
                    <input
                      type="number"
                      value={editForm.leaveBalance || selectedEmployee.leaveBalance}
                      onChange={(e) => setEditForm({...editForm, leaveBalance: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendance</label>
                    <input
                      type="number"
                      value={editForm.attendance || selectedEmployee.attendance}
                      onChange={(e) => setEditForm({...editForm, attendance: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEmployee}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Content */}
          <div className='p-8'>
            <div className='max-w-7xl mx-auto'>
              {selectedEmployee ? (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-600 rounded-lg shadow-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-blue-700 p-2 rounded-lg">
                          <FaMoneyBillWave className="text-blue-200 text-lg" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-blue-100 uppercase tracking-wide">Total Salary</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">${selectedEmployee.salary.toLocaleString()}</p>
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-700 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium text-blue-200 flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-1"></span>
                              +2.5% from last month
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-500">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-blue-100">Monthly Average</span>
                          <span className="text-sm font-semibold text-white">${(selectedEmployee.salary / 12).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-600 rounded-lg shadow-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-blue-700 p-2 rounded-lg">
                          <FaCalendarAlt className="text-blue-200 text-lg" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-blue-100 uppercase tracking-wide">Leave Balance</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{selectedEmployee.leaveBalance} Days</p>
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-700 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium text-blue-200">{selectedEmployee.leaveUsed} used this year</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-500">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-blue-100">Remaining</span>
                          <span className="text-sm font-semibold text-white">{selectedEmployee.leaveBalance - selectedEmployee.leaveUsed} Days</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-600 rounded-lg shadow-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-blue-700 p-2 rounded-lg">
                          <FaCheckCircle className="text-blue-200 text-lg" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-blue-100 uppercase tracking-wide">Attendance</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{selectedEmployee.attendance}%</p>
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-700 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium text-blue-200 flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-1"></span>
                              Excellent
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-500">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-blue-100">This Month</span>
                          <span className="text-sm font-semibold text-white">22/23 Days</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-600 rounded-lg shadow-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-blue-700 p-2 rounded-lg">
                          <FaHourglassHalf className="text-blue-200 text-lg" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-blue-100 uppercase tracking-wide">Pending Tasks</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{selectedEmployee.pendingTasks}</p>
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-700 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium text-blue-200">Due this week</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-500">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-blue-100">Overdue</span>
                          <span className="text-sm font-semibold text-blue-200">{selectedEmployee.overdueTasks} Task</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employee Details Card */}
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaUser className="mr-2 text-blue-600" />
                      Employee Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Employee ID</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.employeeId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Department</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Position</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.position}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <FaEnvelope className="mr-2" />
                          Email
                        </p>
                        <p className="font-medium text-gray-900">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <FaPhone className="mr-2" />
                          Phone
                        </p>
                        <p className="font-medium text-gray-900">{selectedEmployee.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          Address
                        </p>
                        <p className="font-medium text-gray-900">{selectedEmployee.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Join Date</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.joinDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Marital Status</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.maritalStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Emergency Contact</p>
                        <p className="font-medium text-gray-900">{selectedEmployee.emergencyContact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaArrowRight className="mr-2 text-blue-600" />
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleViewSalary(selectedEmployee)}
                          className="w-full text-left px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <FaMoneyBillWave className="mr-3 text-blue-600" />
                            <span className="text-gray-700 group-hover:text-blue-700">Manage Salary</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleViewLeave(selectedEmployee)}
                          className="w-full text-left px-4 py-3 bg-green-50 rounded-lg hover:bg-green-100 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-3 text-green-600" />
                            <span className="text-gray-700 group-hover:text-green-700">Request Leave</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleViewProfile(selectedEmployee)}
                          className="w-full text-left px-4 py-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <FaUser className="mr-3 text-purple-600" />
                            <span className="text-gray-700 group-hover:text-purple-700">View Profile</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-gray-500">
                    <FaUser className="text-6xl mb-4 mx-auto text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select an Employee</h3>
                    <p className="text-gray-600">Choose an employee from the sidebar to view their dashboard</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllEmployeesDashboard
