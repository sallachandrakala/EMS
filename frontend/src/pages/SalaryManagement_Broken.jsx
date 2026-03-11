import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { 
  FaMoneyBillWave, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFilter,
  FaDownload,
  FaSearch,
  FaBuilding,
  FaCalendarAlt,
  FaUser,
  FaSave
} from 'react-icons/fa'
import { salaryRecords, employeeData, getEmployeeSalaryRecords, addSalaryRecord, updateSalaryData, deleteSalaryRecord, salaryRequests, addSalaryRequest, getEmployeeSalaryRequests, updateSalaryRequestStatus, getAllSalaryRequests } from '../data/employeeData'
import { salaryRequestAPI } from '../services/api'

const SalaryManagement = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSalary, setEditingSalary] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedSalaries = localStorage.getItem('salaryRecords')
    if (storedSalaries) {
      const parsedSalaries = JSON.parse(storedSalaries)
      console.log('Loaded', parsedSalaries.length, 'salary records from localStorage')
      setSalaries(parsedSalaries)
    } else {
      // Fallback to data store
      const employeeId = user?.employeeId || 'EMP001'
      const fallbackSalaries = getEmployeeSalaryRecords(employeeId)
      console.log('Loaded', fallbackSalaries.length, 'salary records from data store')
      setSalaries(fallbackSalaries)
    }
    setLoading(false)
  }, [])
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [formData, setFormData] = useState({
    employeeId: user?.employeeId || 'EMP001',
    employeeName: user?.name || 'Employee',
    email: user?.email || 'employee@company.com',
    phone: '',
    department: user?.department || 'IT',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: '',
    effectiveDate: '',
    paymentMethod: 'Bank Transfer',
    status: 'Active',
    notes: ''
  })

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin-dashboard')
      return
    }
    loadData()
  }, [user, navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Loading salary data for dashboard...')
      
      const fromAllEmployees = localStorage.getItem('fromAllEmployeesDashboard')
      const selectedEmployee = localStorage.getItem('selectedEmployeeSalary')
      
      if (fromAllEmployees && selectedEmployee) {
        const employee = JSON.parse(selectedEmployee)
        const employeeRequests = getEmployeeSalaryRequests(employee.employeeId)
        
        setSalaries(employeeRequests)
        
        console.log('Loaded selected employee from all-employees:', employee)
        console.log('Loaded employee salary requests:', employeeRequests)
      } else {
        const employeeId = user?.employeeId || 'EMP001';
        const currentEmployee = employeeData.find(emp => emp.employeeId === employeeId);
        
        // Load salary requests instead of direct salary records
        const employeeRequests = getEmployeeSalaryRequests(employeeId);
        
        setSalaries(employeeRequests)
        
        console.log('Loaded current employee data:', currentEmployee)
        console.log('Loaded employee salary requests:', employeeRequests)
        console.log('Number of salary requests:', employeeRequests.length)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted')
    console.log('Editing salary:', editingSalary)
    console.log('Form data:', formData)
    console.log('Current user:', user)
    
    if (editingSalary) {
      console.log('=== UPDATING EXISTING SALARY RECORD ===')
      console.log('Editing salary:', editingSalary)
      console.log('Form data:', formData)
      
      // Temporarily remove access control for testing
      // For employees, they can only edit their own pending requests
      // if (user?.role !== 'admin' && editingSalary.employeeId !== user?.employeeId) {
      //   alert('You can only edit your own salary requests!')
      //   return
      // }
      
      console.log('Calling updateSalaryData with ID:', editingSalary.id, 'and data:', formData)
      const updatedSalary = updateSalaryData(editingSalary.id, formData)
      console.log('Update result:', updatedSalary)
      
      if (updatedSalary) {
        const employeeId = user?.employeeId || 'EMP001'
        const updatedSalaries = getEmployeeSalaryRecords(employeeId)
        console.log('Updated salaries:', updatedSalaries)
        setSalaries(updatedSalaries)
        alert('✅ Salary record updated successfully!')
        
        // Also update the admin dashboard if it's open
        setTimeout(() => {
          if (window.location.pathname.includes('/admin-dashboard')) {
            console.log('Refreshing admin dashboard data...')
            window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
          }
        }, 1000)
      } else {
        console.log('Update failed')
        alert('Failed to update salary record!')
      }
    } else {
      console.log('Creating new salary request...')
      
      // Calculate net salary
      const netSalary = parseFloat(formData.basicSalary || 0) + parseFloat(formData.allowances || 0) - parseFloat(formData.deductions || 0)
      
      const newRequestData = {
        employeeId: user?.employeeId || 'EMP001',
        employeeName: user?.name || 'Employee',
        department: user?.department || 'IT',
        basicSalary: formData.basicSalary,
        allowances: formData.allowances,
        deductions: formData.deductions,
        netSalary: netSalary,
        effectiveDate: formData.effectiveDate || new Date().toISOString().split('T')[0], // Use provided date or default to today
        requestedDate: new Date().toISOString().split('T')[0], // Add current date as requested date
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'Pending' // Ensure status is set to Pending
      }
      
      console.log('Creating new salary request with data:', newRequestData)
      const newRequest = addSalaryRequest(newRequestData)
      console.log('New request created:', newRequest)
      
      if (newRequest) {
        const updatedRequests = getEmployeeSalaryRequests(user?.employeeId || 'EMP001')
        console.log('Updated requests:', updatedRequests)
        setSalaries(updatedRequests)
        alert('✅ Salary request submitted successfully!')
        
        // Dispatch event to notify admin dashboard
        setTimeout(() => {
          console.log('📝 Dispatching newSalaryRequest event to admin dashboard')
          window.dispatchEvent(new CustomEvent('newSalaryRequest'))
        }, 500)
        
        // Reset form
        resetForm()
        setShowAddForm(false)
      } else {
        console.log('Failed to create salary request')
        alert('Failed to submit salary request!')
      }
    } catch (error) {
      console.error('Error submitting to server:', error)
      // Fallback to local only
      console.log('Falling back to local submission...')
      const localRequest = addSalaryRequest(newRequestData)
      if (localRequest) {
        alert('Your salary request has been submitted locally (server error occurred)!')
      } else {
        alert('Failed to submit salary request!')
      }
    }
  }
    
    setShowAddForm(false)
    setEditingSalary(null)
    resetForm()
    // Reload data to show updated requests
    loadData()
  }

  const handleEdit = (salary) => {
    console.log('=== EDIT BUTTON CLICKED ===')
    console.log('Editing salary:', salary)
    console.log('Current user:', user)
    console.log('User role:', user?.role)
    console.log('User employeeId:', user?.employeeId)
    console.log('Salary employeeId:', salary.employeeId)
    
    // Temporarily remove access control for testing
    // if (user?.role !== 'admin' && salary.employeeId !== user?.employeeId) {
    //   alert('You can only edit your own salary records!')
    //   return
    // }
    
    console.log('Setting editing salary and showing form...')
    setEditingSalary(salary)
    setFormData({
      employeeId: salary.employeeId,
      employeeName: salary.employeeName,
      email: salary.email,
      phone: salary.phone || '',
      department: salary.department,
      basicSalary: salary.basicSalary,
      allowances: salary.allowances,
      deductions: salary.deductions,
      payDate: salary.payDate || '',
      effectiveDate: salary.effectiveDate || '',
      paymentMethod: salary.paymentMethod || 'Bank Transfer',
      status: salary.status || 'Active',
      notes: salary.notes || ''
    })
    setShowAddForm(true)
    console.log('Form should now be visible with salary data')
  }

  const handleDelete = (id) => {
    console.log('Delete clicked for ID:', id)
    console.log('Current user:', user)
    console.log('User role:', user?.role)
    console.log('User employeeId:', user?.employeeId)
    
    const salary = salaries.find(s => s.id === id)
    console.log('Found salary:', salary)
    
    // Temporarily remove access control for testing
    // Allow deletion if user is admin or if it's their own record
    // if (user?.role !== 'admin' && salary?.employeeId !== user?.employeeId) {
    //   alert('You can only delete your own salary records!')
    //   return
    // }
    
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      const deletedSalary = deleteSalaryRecord(id)
      if (deletedSalary) {
        const employeeId = user?.employeeId || 'EMP001'
        const updatedSalaries = getEmployeeSalaryRecords(employeeId)
        setSalaries(updatedSalaries)
        alert('Your salary record deleted successfully!')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      employeeId: user?.employeeId || 'EMP001',
      employeeName: user?.name || 'Employee',
      email: user?.email || 'employee@company.com',
      phone: '',
      department: user?.department || 'IT',
      basicSalary: '',
      allowances: '',
      deductions: '',
      payDate: '',
      effectiveDate: '',
      paymentMethod: 'Bank Transfer',
      status: 'Active',
      notes: ''
    })
  }

  const filteredSalaries = salaries.filter(salary => {
    const matchesSearch = salary.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || salary.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
              <p className="text-gray-600 mt-1">Manage your salary information</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Salary Requests</h2>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Request Salary Change
              </button>
            </div>

            <div className="mb-6 flex flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowances</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSalaries.map((salary, index) => (
                    <tr key={salary.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{salary.employeeName}</div>
                            <div className="text-sm text-gray-500">{salary.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.basicSalary).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.allowances).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.deductions).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${parseFloat(salary.netSalary).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.payDate || salary.processDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          salary.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          salary.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          salary.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {salary.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(salary)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(salary.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
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
          </div>

          {/* Add/Edit Salary Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-screen overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingSalary ? 'Edit Salary Request' : 'Request Salary Change'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                      <input
                        type="text"
                        value={formData.employeeName}
                        onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                      <input
                        type="number"
                        value={formData.basicSalary}
                        onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                      <input
                        type="number"
                        value={formData.allowances}
                        onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                      <input
                        type="number"
                        value={formData.deductions}
                        onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pay Date</label>
                      <input
                        type="date"
                        value={formData.payDate}
                        onChange={(e) => setFormData({...formData, payDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                      <input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Check">Check</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter any additional notes about your salary"
                      />
                    </div>
                  </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingSalary(null)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <FaSave className="mr-2" />
                    {editingSalary ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}
          
          {/* Debug Section - Test Salary Request Connection */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug: Test Connection</h3>
            <p className="text-sm text-yellow-700 mb-3">
              Test if salary requests are properly connected to admin dashboard:
            </p>
            <button
              onClick={() => {
                console.log('=== TEST SALARY REQUEST CONNECTION ===')
                
                // Create a test salary request
                const testRequest = {
                  employeeId: user?.employeeId || 'EMP001',
                  employeeName: user?.name || 'Test Employee',
                  department: user?.department || 'IT',
                  basicSalary: '15000',
                  allowances: '2000',
                  deductions: '500',
                  netSalary: 16500,
                  effectiveDate: new Date().toISOString().split('T')[0],
                  paymentMethod: 'Bank Transfer',
                  notes: 'Test request for debugging connection'
                }
                
                console.log('Creating test request:', testRequest)
                const result = addSalaryRequest(testRequest)
                console.log('Test request result:', result)
                
                // Verify it was added
                const allRequests = getAllSalaryRequests()
                console.log('All requests after test:', allRequests)
                console.log('Total requests:', allRequests.length)
                
                alert(`Test request created! Total requests: ${allRequests.length}. Check admin dashboard and click "Refresh Requests".`)
                
                // Reload current data
                loadData()
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
            >
              Create Test Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalaryManagement
