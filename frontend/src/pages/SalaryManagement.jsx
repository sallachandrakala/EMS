import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import {
  FaMoneyBillWave,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaTimes,
  FaEye
} from 'react-icons/fa'
import { salaryAPI, employeeAPI } from '../services/api'

const SalaryManagement = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [salaries, setSalaries] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSalary, setEditingSalary] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [formData, setFormData] = useState({
    employeeId: user?.employeeId || `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
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
    // Only allow employees to access their own salary data
    if (user?.role === 'admin') {
      navigate('/admin-dashboard')
      return
    }
    loadData()
  }, [user, navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Loading salary data from API...')
      
      // First try to load from API
      const salariesResponse = await salaryAPI.getAll()
      console.log('Salaries API response:', salariesResponse)
      
      const userSalaries = salariesResponse.data?.filter(salary => 
        salary.employeeId === user?.employeeId || 
        salary.employeeName === user?.name ||
        salary.email === user?.email
      ) || []
      
      console.log('Filtered user salaries:', userSalaries)
      
      // If API has data, use it
      if (userSalaries.length > 0) {
        setSalaries(userSalaries)
      } else {
        // Try to load from employee-specific localStorage as fallback
        const localSalaries = localStorage.getItem(`employee_salaries_${user?.email}`)
        if (localSalaries) {
          const parsedSalaries = JSON.parse(localSalaries)
          console.log('Loaded salaries from employee localStorage:', parsedSalaries)
          setSalaries(parsedSalaries)
        } else {
          setSalaries([])
        }
      }
      
      // Only load current employee's data
      const employeesResponse = await employeeAPI.getAll()
      console.log('Employees API response:', employeesResponse)
      
      const currentUser = employeesResponse.data?.find(emp => 
        emp.employeeId === user?.employeeId || 
        emp.name === user?.name ||
        emp.email === user?.email
      )
      
      if (currentUser) {
        setEmployees([currentUser])
        setFormData(prev => ({
          ...prev,
          employeeId: currentUser.employeeId,
          employeeName: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '',
          department: currentUser.department
        }))
      } else {
        // Fallback: Use user context data
        setFormData(prev => ({
          ...prev,
          employeeId: user?.employeeId || `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          employeeName: user?.name || 'Employee',
          email: user?.email || 'employee@company.com',
          department: user?.department || 'IT'
        }))
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      // Fallback data for testing when API fails
      console.log('Using fallback data due to API failure')
      
      // Try localStorage first
      const localSalaries = localStorage.getItem(`employee_salaries_${user?.email}`)
      if (localSalaries) {
        const parsedSalaries = JSON.parse(localSalaries)
        setSalaries(parsedSalaries)
      } else {
        setSalaries([])
      }
      
      setEmployees([{
        employeeId: user?.employeeId || `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: user?.name || 'Current User',
        email: user?.email || 'employee@company.com',
        department: user?.department || 'IT',
        phone: ''
      }])
      
      // Set form with user context data
      setFormData(prev => ({
        ...prev,
        employeeId: user?.employeeId || `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        employeeName: user?.name || 'Employee',
        email: user?.email || 'employee@company.com',
        department: user?.department || 'IT'
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const basicSalary = parseFloat(formData.basicSalary) || 0
      const allowances = parseFloat(formData.allowances) || 0
      const deductions = parseFloat(formData.deductions) || 0
      const netSalary = basicSalary + allowances - deductions

      // Ensure required fields are present
      const employeeId = user?.employeeId || formData.employeeId || `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      const email = user?.email || formData.email || 'employee@company.com'

      // Only allow creating/updating own salary record
      const salaryData = {
        ...formData,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        netSalary: netSalary,
        employeeId: employeeId, // Ensure this is always present
        employeeName: user?.name || formData.employeeName || 'Employee',
        email: email, // Ensure this is always present
        department: user?.department || formData.department || 'IT',
        payDate: formData.payDate || new Date().toISOString().split('T')[0],
        effectiveDate: formData.effectiveDate || new Date().toISOString().split('T')[0],
        paymentMethod: formData.paymentMethod || 'Bank Transfer',
        status: 'Active'
        // Remove _id - let MongoDB generate it automatically
      }

      console.log('Submitting salary data:', salaryData)
      console.log('Current salaries state:', salaries)
      console.log('Form data:', formData)

      if (editingSalary) {
        // Only allow editing own records
        if (editingSalary.employeeId !== user?.employeeId) {
          alert('You can only edit your own salary records!')
          return
        }
        console.log('Updating salary record...')
        try {
          await salaryAPI.update(editingSalary._id, salaryData)
          alert('Your salary record updated successfully!')
        } catch (apiError) {
          console.warn('API update failed, using local fallback:', apiError)
          // Local fallback with localStorage persistence
          setSalaries(prev => {
            const newSalaries = prev.map(s => s._id === editingSalary._id ? salaryData : s)
            console.log('Updated salaries:', newSalaries)
            
            // Save to localStorage for persistence
            localStorage.setItem(`employee_salaries_${user?.email}`, JSON.stringify(newSalaries))
            console.log('Updated employee localStorage:', newSalaries)
            
            return newSalaries
          })
          alert('Your salary record updated locally!')
        }
      } else {
        console.log('Creating new salary record...')
        try {
          await salaryAPI.create(salaryData)
          alert('Your salary record created successfully!')
        } catch (apiError) {
          console.warn('API create failed, using local fallback:', apiError)
          console.log('Adding salary data to local state:', salaryData)
          // Local fallback with localStorage persistence - add _id for local storage
          const localSalaryData = {
            ...salaryData,
            _id: Date.now().toString() // Add _id only for local storage
          }
          setSalaries(prev => {
            const newSalaries = [...prev, localSalaryData]
            console.log('New salaries after adding:', newSalaries)
            
            // Save to localStorage for persistence
            localStorage.setItem(`employee_salaries_${user?.email}`, JSON.stringify(newSalaries))
            console.log('Saved to employee localStorage:', newSalaries)
            
            return newSalaries
          })
          alert('Your salary record created locally!')
        }
      }

      setShowAddForm(false)
      setEditingSalary(null)
      resetForm()
      
      // Don't reload data - let the local state update take effect
      console.log('Salary record saved successfully!')
    } catch (error) {
      console.error('Failed to save salary:', error)
      console.error('Error details:', error.message)
      
      // Provide more specific error messages
      if (error.message.includes('email') || error.message.includes('employeeId')) {
        alert('Required fields missing. Please ensure all required fields are filled.')
      } else if (error.message.includes('500')) {
        alert('Server error occurred. Please try again later.')
      } else {
        alert('Failed to save salary. Please try again.')
      }
    }
  }

  const handleEdit = (salary) => {
    // Only allow editing own records
    if (salary.employeeId !== user?.employeeId) {
      alert('You can only edit your own salary records!')
      return
    }
    
    setEditingSalary(salary)
    setFormData({
      employeeId: salary.employeeId,
      employeeName: salary.employeeName,
      email: salary.email,
      phone: salary.phone || '',
      department: salary.department,
      basicSalary: salary.basicSalary.toString(),
      allowances: salary.allowances.toString(),
      deductions: salary.deductions.toString(),
      payDate: salary.payDate || '',
      effectiveDate: salary.effectiveDate || '',
      paymentMethod: salary.paymentMethod || 'Bank Transfer',
      status: salary.status || 'Active',
      notes: salary.notes || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    const salary = salaries.find(s => s._id === id)
    // Only allow deleting own records
    if (salary?.employeeId !== user?.employeeId) {
      alert('You can only delete your own salary records!')
      return
    }
    
    if (window.confirm('Are you sure you want to delete your salary record?')) {
      try {
        await salaryAPI.delete(id)
        alert('Your salary record deleted successfully!')
        loadData()
      } catch (error) {
        console.error('Failed to delete salary:', error)
        alert('Failed to delete salary record.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      employeeId: user?.employeeId || `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
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

  // Test function to verify local storage
  const testLocalStorage = () => {
    const testData = {
      employeeId: user?.employeeId || 'TEST001',
      employeeName: user?.name || 'Test User',
      email: user?.email || 'test@example.com',
      department: user?.department || 'IT',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      payDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      status: 'Active'
      // Remove _id - let MongoDB generate it automatically
    }
    
    console.log('Test data being added:', testData)
    setSalaries(prev => {
      const newSalaries = [...prev, testData]
      console.log('Test - New salaries:', newSalaries)
      
      // Save to localStorage for persistence
      localStorage.setItem(`employee_salaries_${user?.email}`, JSON.stringify(newSalaries))
      console.log('Test - Saved to employee localStorage:', newSalaries)
      
      return newSalaries
    })
    alert('Test salary record added and saved!')
  }

  // Only show current employee's salaries
  const filteredSalaries = salaries.filter(salary => {
    const matchesSearch = salary.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salary.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salary.department?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || salary.department === filterDepartment
    // Only show own records
    const isOwnRecord = salary.employeeId === user?.employeeId || 
                       salary.employeeName === user?.name ||
                       salary.email === user?.email
    return matchesSearch && matchesDepartment && isOwnRecord
  })

  const totalSalary = filteredSalaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading your salary information...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8 bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Salary Management</h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/employee-dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/salary-dashboard')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Salary Dashboard
            </button>
            <button
              onClick={testLocalStorage}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Local Storage
            </button>
            <button
              onClick={() => {
                resetForm()
                setShowAddForm(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              Add My Salary Record
            </button>
          </div>
        </div>

        {/* Statistics Cards - Only for current employee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">My Salary Records</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSalaries.length}</p>
              </div>
              <FaUser className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">My Net Salary</p>
                <p className="text-2xl font-bold text-gray-900">${totalSalary.toLocaleString()}</p>
              </div>
              <FaMoneyBillWave className="text-green-600 text-2xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSalaries.find(s => s.status === 'Active') ? 'Active' : 'No Records'}
                </p>
              </div>
              <FaCalendarAlt className="text-teal-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Filters - Simplified for personal use */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search your salary records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center">
            <FaDownload className="mr-2" />
            Export My Data
          </button>
        </div>

        {/* Salary Table - Only user's records */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSalaries.map((salary) => (
                  <tr key={salary._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{salary.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{salary.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{salary.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${salary.basicSalary?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${salary.allowances?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${salary.deductions?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${salary.netSalary?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{salary.payDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        salary.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {salary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(salary)}
                          className="text-blue-600 hover:text-blue-800" 
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(salary._id)}
                          className="text-red-600 hover:text-red-800" 
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800" title="View">
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSalaries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No salary records found for your account.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Your First Salary Record
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Salary Modal - Restricted to own data */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {editingSalary ? 'Edit My Salary Record' : 'Add My Salary Record'}
              </h3>
              <p className="text-sm text-blue-600 mb-4">You can only manage your own salary information</p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Information - Read-only for security */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={formData.employeeId}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          value={formData.employeeName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={formData.department}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salary Information - Editable */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Salary Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                        <input
                          type="number"
                          value={formData.basicSalary}
                          onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your basic salary"
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
                          placeholder="Enter your allowances"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                        <input
                          type="number"
                          value={formData.deductions}
                          onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your deductions"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary</label>
                        <input
                          type="text"
                          value={`$${(parseFloat(formData.basicSalary || 0) + parseFloat(formData.allowances || 0) - parseFloat(formData.deductions || 0)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-50 rounded-lg p-6 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pay Date</label>
                        <input
                          type="date"
                          value={formData.payDate}
                          onChange={(e) => setFormData({...formData, payDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
                        <input
                          type="date"
                          value={formData.effectiveDate}
                          onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
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
                          <option value="Direct Deposit">Direct Deposit</option>
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
      </div>
    </div>
  )
}

export default SalaryManagement
