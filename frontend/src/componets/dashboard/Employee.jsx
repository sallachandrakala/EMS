import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaEdit, FaTrash, FaTimes, FaMoneyBillWave, FaArrowLeft, FaSearch, FaEye, FaMoneyBill } from 'react-icons/fa'
import { employeeAPI } from '../../services/api'

const Employee = () => {
  const navigate = useNavigate()
  const [showAddPage, setShowAddPage] = useState(false)
  const [showViewPage, setShowViewPage] = useState(false)
  const [showSalaryPage, setShowSalaryPage] = useState(false)
  const [showLeavePage, setShowLeavePage] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [salaryFormData, setSalaryFormData] = useState({
    basicSalary: '',
    allowances: '',
    deductions: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    notes: ''
  })

  // Load employees from server
  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const data = await employeeAPI.getAll()
      setEmployees(data)
    } catch (error) {
      console.error('Failed to load employees:', error)
      // Don't use fallback - show error instead
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    designation: '',
    department: '',
    basicSalary: '',
    password: '',
    role: '',
    image: null,
    status: 'Active',
    allowances: '',
    netSalary: ''
  })
  const [editingEmployee, setEditingEmployee] = useState(null)

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const generateEmployeeId = () => {
    const nextId = employees.length + 1
    return `EMP${String(nextId).padStart(3, '0')}`
  }

  const openAddPage = () => {
    setShowAddPage(true)
    setEditingEmployee(null)
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      designation: '',
      department: '',
      basicSalary: '',
      password: '',
      role: '',
      image: null,
      status: 'Active',
      allowances: '',
      netSalary: ''
    })
  }

  const openViewPage = (employee) => {
    setSelectedEmployee(employee)
    setShowViewPage(true)
  }

  const openSalaryPage = (employee) => {
    // Store selected employee data for salary dashboard
    localStorage.setItem('selectedEmployee', JSON.stringify(employee))
    // Navigate to salary dashboard
    navigate('/salary-management')
  }

  const openLeavePage = (employee) => {
    setSelectedEmployee(employee)
    setShowLeavePage(true)
  }

  const handleSalarySubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedEmployee || !salaryFormData.basicSalary) {
      alert('Please enter basic salary')
      return
    }

    try {
      const basicSalary = parseFloat(salaryFormData.basicSalary)
      const allowances = parseFloat(salaryFormData.allowances) || 0
      const deductions = parseFloat(salaryFormData.deductions) || 0
      const netSalary = basicSalary + allowances - deductions

      const employeeData = {
        ...selectedEmployee,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        netSalary: netSalary,
        effectiveDate: salaryFormData.effectiveDate,
        paymentMethod: salaryFormData.paymentMethod,
        salaryNotes: salaryFormData.notes
      }

      console.log('Saving salary data:', employeeData) // Debug log
      await employeeAPI.update(selectedEmployee._id, employeeData)
      console.log('Salary data saved successfully') // Debug log
      
      // Update local employees state
      setEmployees(prev => prev.map(emp => 
        emp._id === selectedEmployee._id ? employeeData : emp
      ))

      alert('Salary information saved successfully!')
      setShowSalaryPage(false)
      setSelectedEmployee(null)
      
      // Reset salary form
      setSalaryFormData({
        basicSalary: '',
        allowances: '',
        deductions: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        notes: ''
      })
    } catch (error) {
      console.error('Failed to save salary:', error) // Debug log
      alert('Failed to save salary. Please try again.')
    }
  }

  const openEditPage = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeId: employee.employeeId || '',
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      dateOfBirth: employee.dateOfBirth || '',
      gender: employee.gender || '',
      maritalStatus: employee.maritalStatus || '',
      designation: employee.designation || '',
      department: employee.department || '',
      basicSalary: employee.basicSalary || '',
      password: employee.password || '',
      role: employee.role || '',
      image: null,
      status: employee.status || 'Active',
      allowances: employee.allowances || '',
      netSalary: employee.netSalary || ''
    })
    setShowAddPage(true)
  }

  const closeAddPage = () => {
    setShowAddPage(false)
    setEditingEmployee(null)
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      designation: '',
      department: '',
      salary: '',
      password: '',
      role: '',
      image: null,
      status: 'Active',
      basicSalary: '',
      allowances: '',
      netSalary: ''
    })
  }

  const closeViewPage = () => {
    setShowViewPage(false)
    setSelectedEmployee(null)
  }

  const closeSalaryPage = () => {
    setShowSalaryPage(false)
    setSelectedEmployee(null)
  }

  const closeLeavePage = () => {
    setShowLeavePage(false)
    setSelectedEmployee(null)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0
    const allowances = parseFloat(formData.allowances) || 0
    const net = basic + allowances
    setFormData(prev => ({
      ...prev,
      netSalary: net.toString()
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.employeeId) {
      alert('Please enter employee name, email and employee ID')
      return
    }

    const employeeData = {
      ...formData,
      basicSalary: parseFloat(formData.basicSalary) || parseFloat(formData.salary) || 0,
      allowances: parseFloat(formData.allowances) || 0,
      netSalary: parseFloat(formData.netSalary) || parseFloat(formData.salary) || 0,
      image: formData.image || `https://picsum.photos/seed/employee${employees.length + 1}/40/40.jpg`
    }

    try {
      if (editingEmployee) {
        // Update existing employee
        await employeeAPI.update(editingEmployee._id, employeeData)
        setEmployees(prev => 
          prev.map(employee => 
            employee._id === editingEmployee._id 
              ? { ...employee, ...employeeData }
              : employee
          )
        )
      } else {
        // Add new employee
        const newEmployee = await employeeAPI.create(employeeData)
        setEmployees(prev => [...prev, newEmployee])
      }
      closeAddPage()
    } catch (error) {
      console.error('Failed to save employee:', error)
      alert('Failed to save employee. Please check server connection.')
      // Don't use fallback - show error instead
    }
  }

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(employeeId)
        setEmployees(prev => prev.filter(employee => employee._id !== employeeId))
      } catch (error) {
        console.error('Failed to delete employee:', error)
        alert('Failed to delete employee. Please check server connection.')
        // Don't use fallback - show error instead
      }
    }
  }

  const handleLeaveAction = async (action) => {
    if (!selectedEmployee) return
    
    try {
      const updatedStatus = action === 'approve' ? 'On Leave' : 'Active'
      await employeeAPI.update(selectedEmployee._id, { status: updatedStatus })
      
      setEmployees(prev => 
        prev.map(emp => 
          emp._id === selectedEmployee._id 
            ? { ...emp, status: updatedStatus }
            : emp
        )
      )
    } catch (error) {
      console.error('Failed to update leave status:', error)
      alert('Failed to update leave status. Please check server connection.')
      // Don't use fallback - show error instead
    }
    closeLeavePage()
  }

  // View Employee Page
  if (showViewPage && selectedEmployee) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='p-8 bg-white pt-4'>
          <div className='flex justify-between items-center mb-6'>
            <button 
              onClick={closeViewPage}
              className='flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <FaArrowLeft />
              <span>Back to Employee</span>
            </button>
            <h4 className='text-2xl font-bold text-gray-800'>Employee Details</h4>
          </div>

          <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Profile Image */}
              <div className='flex flex-col items-center'>
                <img 
                  src={selectedEmployee.image} 
                  alt={selectedEmployee.name} 
                  className='w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4'
                />
                <h3 className='text-xl font-bold text-gray-800'>{selectedEmployee.name}</h3>
                <p className='text-gray-600'>{selectedEmployee.designation || 'Employee'} • {selectedEmployee.department}</p>
                <span className={`mt-2 px-3 py-1 rounded-full text-sm ${
                  selectedEmployee.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedEmployee.status}
                </span>
              </div>

              {/* Personal Information */}
              <div className='space-y-4'>
                <h5 className='text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2'>Personal Information</h5>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Employee ID:</span>
                    <span className='font-medium'>{selectedEmployee.employeeId}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Date of Birth:</span>
                    <span className='font-medium'>{selectedEmployee.dateOfBirth || 'Not specified'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Gender:</span>
                    <span className='font-medium'>{selectedEmployee.gender || 'Not specified'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Marital Status:</span>
                    <span className='font-medium'>{selectedEmployee.maritalStatus || 'Not specified'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Email:</span>
                    <span className='font-medium'>{selectedEmployee.email}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Phone:</span>
                    <span className='font-medium'>{selectedEmployee.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8 flex justify-center space-x-4'>
              <button 
                onClick={closeViewPage}
                className='px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-lg'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Salary Form Modal
  if (showSalaryPage && selectedEmployee) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-bold text-gray-800'>Add Salary Information</h3>
              <button 
                onClick={() => setShowSalaryPage(false)}
                className='text-gray-500 hover:text-gray-700 text-2xl'
              >
                ×
              </button>
            </div>
            <div className='mt-4 flex items-center'>
              <img 
                src={selectedEmployee.image} 
                alt={selectedEmployee.name} 
                className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 mr-3'
              />
              <div>
                <p className='font-semibold text-gray-800'>{selectedEmployee.name}</p>
                <p className='text-sm text-gray-600'>{selectedEmployee.employeeId} • {selectedEmployee.department}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSalarySubmit} className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Basic Salary ($) <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  value={salaryFormData.basicSalary}
                  onChange={(e) => setSalaryFormData(prev => ({ ...prev, basicSalary: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter basic salary'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Allowances ($)
                </label>
                <input
                  type='number'
                  value={salaryFormData.allowances}
                  onChange={(e) => setSalaryFormData(prev => ({ ...prev, allowances: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter allowances'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Deductions ($)
                </label>
                <input
                  type='number'
                  value={salaryFormData.deductions}
                  onChange={(e) => setSalaryFormData(prev => ({ ...prev, deductions: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter deductions'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Net Salary ($)
                </label>
                <input
                  type='number'
                  value={parseFloat(salaryFormData.basicSalary || 0) + parseFloat(salaryFormData.allowances || 0) - parseFloat(salaryFormData.deductions || 0)}
                  readOnly
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                  placeholder='Calculated net salary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Effective Date
                </label>
                <input
                  type='date'
                  value={salaryFormData.effectiveDate}
                  onChange={(e) => setSalaryFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Payment Method
                </label>
                <select
                  value={salaryFormData.paymentMethod}
                  onChange={(e) => setSalaryFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                >
                  <option value='Bank Transfer'>Bank Transfer</option>
                  <option value='Cash'>Cash</option>
                  <option value='Check'>Check</option>
                  <option value='Direct Deposit'>Direct Deposit</option>
                </select>
              </div>
            </div>

            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Notes
              </label>
              <textarea
                value={salaryFormData.notes}
                onChange={(e) => setSalaryFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                placeholder='Enter any additional notes...'
              />
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button
                type='button'
                onClick={() => setShowSalaryPage(false)}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
              >
                Save Salary
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Leave Management Page
  if (showLeavePage && selectedEmployee) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='p-8 bg-white pt-4'>
          <div className='flex justify-between items-center mb-6'>
            <button 
              onClick={closeLeavePage}
              className='flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <FaArrowLeft />
              <span>Back to Employee</span>
            </button>
            <h4 className='text-2xl font-bold text-gray-800'>Leave Management</h4>
          </div>

          <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
            <div className='flex items-center mb-6'>
              <img 
                src={selectedEmployee.image} 
                alt={selectedEmployee.name} 
                className='w-16 h-16 rounded-full object-cover border-2 border-gray-200 mr-4'
              />
              <div>
                <h3 className='text-xl font-bold text-gray-800'>{selectedEmployee.name}</h3>
                <p className='text-gray-600'>{selectedEmployee.designation} • {selectedEmployee.department}</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                  selectedEmployee.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedEmployee.status}
                </span>
              </div>
            </div>

            <div className='bg-gray-50 rounded-lg p-6 mb-6'>
              <h5 className='text-lg font-semibold text-gray-800 mb-4'>Leave Information</h5>
              <div className='space-y-3'>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-gray-600'>Total Leave Balance:</span>
                  <span className='font-medium'>21 days</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-gray-600'>Leave Taken:</span>
                  <span className='font-medium'>5 days</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-gray-600'>Remaining Leave:</span>
                  <span className='font-medium text-green-600'>16 days</span>
                </div>
                <div className='flex justify-between items-center py-2'>
                  <span className='text-gray-600'>Current Status:</span>
                  <span className={`font-medium ${
                    selectedEmployee.status === 'Active' 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>
            </div>

            {selectedEmployee.status === 'Active' ? (
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6'>
                <h6 className='font-semibold text-yellow-800 mb-2'>Request Leave</h6>
                <p className='text-sm text-yellow-700 mb-4'>
                  Do you want to mark {selectedEmployee.name} as On Leave?
                </p>
                <button 
                  onClick={() => handleLeaveAction('approve')}
                  className='w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg transition-colors'
                >
                  Mark as On Leave
                </button>
              </div>
            ) : (
              <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-6'>
                <h6 className='font-semibold text-green-800 mb-2'>Return from Leave</h6>
                <p className='text-sm text-green-700 mb-4'>
                  Do you want to mark {selectedEmployee.name} as Active?
                </p>
                <button 
                  onClick={() => handleLeaveAction('return')}
                  className='w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors'
                >
                  Mark as Active
                </button>
              </div>
            )}

            <div className='mt-8 flex justify-center space-x-4'>
              <button 
                onClick={closeLeavePage}
                className='px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-lg'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showAddPage) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='p-8 bg-white pt-4'>
          <div className='flex justify-between items-center mb-6'>
            <button 
              onClick={closeAddPage}
              className='flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <FaArrowLeft />
              <span>Back to Employee</span>
            </button>
            <h4 className='text-2xl font-bold text-gray-800'>
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h4>
          </div>

          <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Personal Information */}
              <div className='space-y-6'>
                <h5 className='text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2'>Personal Information</h5>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Employee ID</label>
                  <input 
                    type='text' 
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                    placeholder='Enter employee ID' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name *</label>
                  <input 
                    type='text' 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                    placeholder='Enter full name' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email *</label>
                  <input 
                    type='email' 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                    placeholder='Enter email address' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                  <input 
                    type='tel' 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                    placeholder='Enter phone number' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Date of Birth</label>
                  <input 
                    type='date' 
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Marital Status</label>
                  <select 
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
                  >
                    <option value=''>Select Status</option>
                    <option value='Single'>Single</option>
                    <option value='Married'>Married</option>
                    <option value='Divorced'>Divorced</option>
                    <option value='Widowed'>Widowed</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Upload Image</label>
                  <div className='space-y-2'>
                    <input 
                      type='file' 
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100'
                    />
                    {formData.image && (
                      <div className='flex justify-center'>
                        <img 
                          src={formData.image} 
                          alt='Profile Preview' 
                          className='w-20 h-20 rounded-full object-cover border-2 border-gray-200'
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className='space-y-6'>
                <h5 className='text-xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-2'>Professional Information</h5>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Designation</label>
                  <input 
                    type='text' 
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                    placeholder='Enter designation' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
                  >
                    <option value=''>Select Department</option>
                    <option value='Information Technology'>Information Technology</option>
                    <option value='Human Resources'>Human Resources</option>
                    <option value='Finance'>Finance</option>
                    <option value='Marketing'>Marketing</option>
                    <option value='Operations'>Operations</option>
                    <option value='Sales'>Sales</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Basic Salary</label>
                  <input 
                    type='number' 
                    value={formData.basicSalary}
                    onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                    placeholder='Enter basic salary' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
                  >
                    <option value=''>Select Role</option>
                    <option value='Employee'>Employee</option>
                    <option value='Team Lead'>Team Lead</option>
                    <option value='Manager'>Manager</option>
                    <option value='Director'>Director</option>
                    <option value='Admin'>Admin</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
                  >
                    <option value='Active'>Active</option>
                    <option value='On Leave'>On Leave</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                  <input 
                    type='password' 
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg' 
                    placeholder='Enter password' 
                  />
                </div>
              </div>
            </div>

            <div className='mt-8 flex justify-center space-x-4'>
              <>
                <button 
                  onClick={closeAddPage}
                  className='px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-lg'
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className='px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors text-lg'
                >
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
              </>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        <div className='flex justify-end items-center'>
          <button 
            onClick={handleLogout}
            className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          {/* Header with Title, Search and Add Button */}
          <div className='flex flex-col items-center mb-6 space-y-4'>
            <h4 className='text-2xl font-bold text-gray-800'>Employee Management</h4>
            <div className='flex items-center w-full max-w-2xl'>
              <div className='relative flex-1 md:flex-initial md:w-48'>
                <input 
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Search employees...'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
                <FaSearch className='absolute left-3 top-3 text-gray-400' />
              </div>
              <div className='w-6'></div>
              <button 
                onClick={openAddPage}
                className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 transition-colors whitespace-nowrap'
              >
                <span>Add Employee</span>
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('selectedEmployee', JSON.stringify(null))
                  navigate('/salary-management')
                }}
                className='flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 transition-colors whitespace-nowrap'
              >
                <FaMoneyBillWave className='text-xs' />
                <span>Add New Salary</span>
              </button>
            </div>
          </div>
          {/* Employee Table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='pb-3 text-gray-700 font-semibold'>S.No</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Image</th>
                  <th className='pb-3 text-gray-700 font-semibold'>EmployeeName</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Department</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee._id} className='border-b border-gray-100'>
                    <td className='py-3 text-gray-600'>{index + 1}</td>
                    <td className='py-3'>
                      <img 
                        src={employee.image} 
                        alt={employee.name} 
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    </td>
                    <td className='py-3 text-gray-800 font-medium'>{employee.name}</td>
                    <td className='py-3 text-gray-800'>{employee.department}</td>
                    <td className='py-3'>
                      <div className='flex items-center space-x-2'>
                        <button 
                          onClick={() => openViewPage(employee)}
                          className='flex items-center space-x-1 text-white px-3 py-1 rounded text-sm transition-colors' 
                          style={{backgroundColor: '#3b82f6'}}
                        >
                          <FaEye className='text-xs' />
                          <span>View</span>
                        </button>
                        <>
                        <button 
                          onClick={() => openEditPage(employee)}
                          className='flex items-center space-x-1 text-white px-3 py-1 rounded text-sm transition-colors' 
                          style={{backgroundColor: '#23ab1f'}}
                        >
                          <FaEdit className='text-xs' />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => openSalaryPage(employee)}
                          className='flex items-center space-x-1 text-white px-3 py-1 rounded text-sm transition-colors' 
                          style={{backgroundColor: '#f59e0b'}}
                        >
                          <FaMoneyBill className='text-xs' />
                          <span>Salary</span>
                        </button>
                        <button 
                          onClick={() => openLeavePage(employee)}
                          className='flex items-center space-x-1 text-white px-3 py-1 text-sm transition-colors' 
                          style={{backgroundColor: '#6b7280'}}
                        >
                          <span>{employee.status === 'On Leave' ? 'Return' : 'Leave'}</span>
                        </button>
                        </>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Employee;
