import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaMoneyBillWave, FaLock, FaUnlock, FaEdit, FaTrash, FaPlus, FaUser } from 'react-icons/fa'
import { salaryAPI } from '../../services/api'
import AdminSidebar from './AdminSidebar'

const SalaryCards = () => {
  const location = useLocation()
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [salaryRequests, setSalaryRequests] = useState([])
  const [showRequests, setShowRequests] = useState(false)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [filteredData, setFilteredData] = useState([])
  const [editingSalary, setEditingSalary] = useState(null)
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    email: '',
    department: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: '',
    effectiveDate: '',
    paymentMethod: 'Bank Transfer',
    status: 'Active'
  })
  
  // Detect if user is accessing from admin dashboard route
  const isAdminRoute = location.pathname === '/admin-dashboard/salary'
  
  const [user, setUser] = useState({
    role: isAdminRoute ? 'admin' : 'employee',
    employeeId: isAdminRoute ? 'ADMIN001' : 'EMP001',
    name: isAdminRoute ? 'Admin User' : 'Employee User',
    email: isAdminRoute ? 'admin@company.com' : 'employee@company.com',
    department: isAdminRoute ? 'IT' : 'IT'
  })

  // Update user state when route changes
  useEffect(() => {
    setUser({
      role: isAdminRoute ? 'admin' : 'employee',
      employeeId: isAdminRoute ? 'ADMIN001' : 'EMP001',
      name: isAdminRoute ? 'Admin User' : 'Employee User',
      email: isAdminRoute ? 'admin@company.com' : 'employee@company.com',
      department: isAdminRoute ? 'IT' : 'IT'
    })
  }, [isAdminRoute])

  useEffect(() => {
    loadSalaries()
    loadSalaryRequests()
  }, [])

  useEffect(() => {
    // Update filtered data when filter or data changes
    if (currentFilter === 'all') {
      setFilteredData([...salaries, ...salaryRequests])
    } else if (currentFilter === 'pending') {
      setFilteredData(salaryRequests.filter(r => r.status === 'Pending'))
    } else if (currentFilter === 'approved') {
      setFilteredData(salaryRequests.filter(r => r.status === 'Approved'))
    } else if (currentFilter === 'rejected') {
      setFilteredData(salaryRequests.filter(r => r.status === 'Rejected'))
    } else {
      setFilteredData(salaries) // Show only salaries for other filters
    }
  }, [currentFilter, salaries, salaryRequests])

  const filterByStatus = (status) => {
    setCurrentFilter(status)
    console.log('Filtering by status:', status)
  }

  const loadSalaryRequests = () => {
    try {
      const requests = JSON.parse(localStorage.getItem('salary_requests') || '[]')
      console.log('Loaded salary requests:', requests)
      setSalaryRequests(requests)
    } catch (error) {
      console.error('Failed to load salary requests:', error)
      setSalaryRequests([])
    }
  }

  const loadSalaries = async () => {
    try {
      setLoading(true)
      console.log('Admin loading salary data from API...')
      
      // First try to load from API
      const response = await salaryAPI.getAll()
      console.log('Admin salaries API response:', response)
      
      if (response.data && response.data.length > 0) {
        // Filter only admin-submitted data for admin dashboard
        const adminSalaries = response.data.filter(s => s.submittedBy === 'admin')
        setSalaries(adminSalaries)
        // Save to admin-specific localStorage
        localStorage.setItem('admin_dashboard_salaries', JSON.stringify(adminSalaries))
      } else {
        // Try to load from admin-specific localStorage as fallback
        const localSalaries = localStorage.getItem('admin_dashboard_salaries')
        if (localSalaries) {
          const parsedSalaries = JSON.parse(localSalaries)
          console.log('Admin loaded salaries from localStorage:', parsedSalaries)
          setSalaries(parsedSalaries)
        } else {
          setSalaries([])
        }
      }
    } catch (error) {
      console.error('Admin failed to load salaries:', error)
      
      // Fallback to admin-specific localStorage
      const localSalaries = localStorage.getItem('admin_dashboard_salaries')
      if (localSalaries) {
        const parsedSalaries = JSON.parse(localSalaries)
        console.log('Admin using localStorage fallback:', parsedSalaries)
        setSalaries(parsedSalaries)
      } else {
        console.log('Admin using sample data for testing')
        setSalaries([
          {
            _id: '1',
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            email: 'john@company.com',
            department: 'IT',
            basicSalary: 5000,
            allowances: 1000,
            deductions: 500,
            netSalary: 5500,
            payDate: '2024-01-25',
            effectiveDate: '2024-01-01',
            paymentMethod: 'Bank Transfer',
            status: 'Active',
            submittedBy: 'admin',
            submittedAt: new Date().toISOString()
          }
        ])
      }
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

      const salaryData = {
        ...formData,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        netSalary: netSalary,
        payDate: formData.payDate || new Date().toISOString().split('T')[0],
        effectiveDate: formData.effectiveDate || new Date().toISOString().split('T')[0],
        submittedBy: 'admin',
        submittedAt: new Date().toISOString()
        // Remove _id - let MongoDB generate it automatically
      }

      console.log('Admin submitting salary data:', salaryData)

      if (editingSalary) {
        try {
          await salaryAPI.update(editingSalary._id, salaryData)
          alert('Salary record updated successfully!')
          loadSalaries()
        } catch (apiError) {
          console.warn('API update failed, using local fallback:', apiError)
          setSalaries(prev => prev.map(s => s._id === editingSalary._id ? salaryData : s))
          alert('Salary record updated locally!')
        }
      } else {
        try {
          await salaryAPI.create(salaryData)
          alert('Salary record created successfully!')
          loadSalaries()
        } catch (apiError) {
          console.warn('API create failed, using local fallback:', apiError)
          setSalaries(prev => {
            const newSalaries = [...prev, salaryData]
            localStorage.setItem('admin_dashboard_salaries', JSON.stringify(newSalaries))
            return newSalaries
          })
          alert('Salary record created locally!')
        }
      }

      setShowForm(false)
      setEditingSalary(null)
      resetForm()
      
    } catch (error) {
      console.error('Failed to save salary:', error)
      alert('Failed to save salary. Please try again.')
    }
  }

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault()
    
    // Allow both employees and admins to use this form
    if (user?.role !== 'employee' && user?.role !== 'admin') {
      alert('This form is for employee self-service only!')
      return
    }

    if (!formData.employeeName || !formData.basicSalary || !formData.email) {
      alert('Please enter your name, email, and basic salary')
      return
    }

    try {
      const basicSalary = parseFloat(formData.basicSalary) || 0
      const allowances = parseFloat(formData.allowances) || 0
      const deductions = parseFloat(formData.deductions) || 0
      const netSalary = basicSalary + allowances - deductions

      // Create salary REQUEST data (not direct salary record)
      const salaryRequest = {
        ...formData,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        netSalary: netSalary,
        employeeId: user?.employeeId || formData.employeeId,
        employeeName: user?.name || formData.employeeName,
        email: user?.email || formData.email,
        department: user?.department || formData.department,
        payDate: formData.payDate || new Date().toISOString().split('T')[0],
        effectiveDate: formData.effectiveDate || new Date().toISOString().split('T')[0],
        paymentMethod: formData.paymentMethod || 'Bank Transfer',
        status: 'Pending', // Requests start as pending
        submittedBy: user?.role === 'employee' ? 'employee' : 'admin',
        submittedAt: new Date().toISOString(),
        requestType: 'salary_update', // Mark as a request
        approved: false // Not approved yet
        // Remove _id - let MongoDB generate it automatically
      }

      console.log('Employee submitting salary request:', salaryRequest)

      // Save to salary requests storage (separate from admin salaries)
      try {
        // Try API first
        await salaryAPI.create(salaryRequest)
        alert('Your salary request has been submitted for admin approval!')
      } catch (apiError) {
        console.warn('API create failed, using local fallback:', apiError)
        
        // Save to salary requests localStorage
        const existingRequests = JSON.parse(localStorage.getItem('salary_requests') || '[]')
        const newRequests = [...existingRequests, salaryRequest]
        localStorage.setItem('salary_requests', JSON.stringify(newRequests))
        
        console.log('Salary request saved locally:', newRequests)
        alert('Your salary request has been submitted locally for admin approval!')
      }

      resetEmployeeForm()
      setShowEmployeeForm(false)
      
    } catch (error) {
      console.error('Failed to submit salary request:', error)
      alert('Failed to submit salary request. Please try again.')
    }
  }

  const resetForm = () => {
    setEditingSalary(null)
    setFormData({
      employeeId: '',
      employeeName: '',
      email: '',
      department: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      payDate: '',
      effectiveDate: '',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    })
    setShowForm(false)
  }

  const resetEmployeeForm = () => {
    setFormData({
      employeeId: user?.employeeId || '',
      employeeName: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      payDate: '',
      effectiveDate: '',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    })
    setShowEmployeeForm(false)
  }

  const handleEdit = (salary) => {
    setEditingSalary(salary)
    setFormData(salary)
    setShowForm(true)
  }

  const handleDelete = async (salaryId) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await salaryAPI.delete(salaryId)
        alert('Salary record deleted successfully!')
        loadSalaries()
      } catch (error) {
        console.error('Failed to delete salary:', error)
        alert('Failed to delete salary record.')
      }
    }
  }

  const handleApproveRequest = (request) => {
    try {
      // Convert request to salary record
      const salaryRecord = {
        ...request,
        status: 'Active',
        approved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: user?.name || 'Admin'
      }

      // Add to admin salaries
      const newSalaries = [...salaries, salaryRecord]
      setSalaries(newSalaries)
      localStorage.setItem('admin_dashboard_salaries', JSON.stringify(newSalaries))

      // Update request status
      const updatedRequests = salaryRequests.map(r => 
        r._id === request._id ? { ...r, status: 'Approved', approved: true } : r
      )
      setSalaryRequests(updatedRequests)
      localStorage.setItem('salary_requests', JSON.stringify(updatedRequests))

      alert(`Salary request for ${request.employeeName} approved successfully!`)
    } catch (error) {
      console.error('Failed to approve request:', error)
      alert('Failed to approve request.')
    }
  }

  const handleRejectRequest = (request) => {
    if (window.confirm(`Are you sure you want to reject the salary request for ${request.employeeName}?`)) {
      try {
        // Update request status
        const updatedRequests = salaryRequests.map(r => 
          r._id === request._id ? { ...r, status: 'Rejected', approved: false } : r
        )
        setSalaryRequests(updatedRequests)
        localStorage.setItem('salary_requests', JSON.stringify(updatedRequests))

        alert(`Salary request for ${request.employeeName} rejected.`)
      } catch (error) {
        console.error('Failed to reject request:', error)
        alert('Failed to reject request.')
      }
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Admin Sidebar - only show on admin route */}
      {isAdminRoute && <AdminSidebar />}
      
      {/* Main Content */}
      <div className={`flex-1 ${isAdminRoute ? 'ml-64' : ''}`}>
        <div className='p-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
              <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-800 flex items-center justify-center'>
                  <FaMoneyBillWave className='mr-3 text-teal-600' />
                  Salary Management
                </h2>
              </div>
              <div className='flex flex-wrap gap-3 mt-4'>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => setShowForm(!showForm)}
                    className='bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                  >
                    <FaPlus className='mr-2' />
                    Add Salary
                  </button>
                )}
                {(user?.role === 'employee' || user?.role === 'admin') && (
                  <button 
                    onClick={() => {
                      resetEmployeeForm()
                      setShowEmployeeForm(!showEmployeeForm)
                    }}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                  >
                    <FaUnlock className='mr-2' />
                    {user?.role === 'admin' ? 'Employee View' : 'Update My Salary'}
                  </button>
                )}
              </div>
            </div>

        {/* Admin Salary Form */}
        {showForm && user?.role === 'admin' && (
          <div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
            <h3 className='text-xl font-bold text-gray-800 mb-6'>
              {editingSalary ? 'Edit Salary Record' : 'Add New Salary Record'}
            </h3>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Employee ID</label>
                  <input
                    type='text'
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter employee ID'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Employee Name</label>
                  <input
                    type='text'
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter employee name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter email'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Department</label>
                  <input
                    type='text'
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter department'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Basic Salary</label>
                  <input
                    type='number'
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter basic salary'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Allowances</label>
                  <input
                    type='number'
                    value={formData.allowances}
                    onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter allowances'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Deductions</label>
                  <input
                    type='number'
                    value={formData.deductions}
                    onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter deductions'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Pay Date</label>
                  <input
                    type='date'
                    value={formData.payDate}
                    onChange={(e) => setFormData({...formData, payDate: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  />
                </div>
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={resetForm}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg flex items-center'
                >
                  <FaPlus className='mr-2' />
                  {editingSalary ? 'Update' : 'Add'} Salary Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employee Self-Service Form */}
        {showEmployeeForm && (user?.role === 'employee' || user?.role === 'admin') && (
          <div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
            <h3 className='text-xl font-bold text-gray-800 mb-6'>
              {user?.role === 'admin' ? 'Admin: Employee View' : 'Update Your Salary Information'}
            </h3>
            <p className='text-sm text-blue-600 mb-4'>You can only update your own salary information</p>
            <form onSubmit={handleEmployeeSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Employee ID</label>
                  <input
                    type='text'
                    value={formData.employeeId}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                    readOnly
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
                  <input
                    type='text'
                    value={formData.employeeName}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                    readOnly
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Email</label>
                  <input
                    type='email'
                    value={formData.email}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                    readOnly
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Department</label>
                  <input
                    type='text'
                    value={formData.department}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                    readOnly
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Basic Salary</label>
                  <input
                    type='number'
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your basic salary'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Allowances</label>
                  <input
                    type='number'
                    value={formData.allowances}
                    onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your allowances'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Deductions</label>
                  <input
                    type='number'
                    value={formData.deductions}
                    onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your deductions'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Net Salary</label>
                  <input
                    type='text'
                    value={(parseFloat(formData.basicSalary || 0) + parseFloat(formData.allowances || 0) - parseFloat(formData.deductions || 0)).toFixed(2)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                    readOnly
                  />
                </div>
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={resetEmployeeForm}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center'
                >
                  <FaUser className='mr-2' />
                  Update My Salary
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Salary Records Table */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-xl font-bold text-gray-800'>Salary History</h3>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-600'>Total: {[...salaries, ...salaryRequests].length}</span>
              <button className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm'>
                Export to Excel
              </button>
            </div>
          </div>
          {loading ? (
            <div className='text-center py-8'>
              <div className='text-gray-600'>Loading salary records...</div>
            </div>
          ) : (
            <div className='overflow-x-auto border border border-gray-200 rounded-lg'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Type</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Employee ID</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Name</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Email</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Department</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Basic Salary</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Allowances</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Deductions</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Net Salary</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Pay Date</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Status</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Submitted By</th>
                    {user?.role === 'admin' && <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b'>Actions</th>}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {[...salaries, ...salaryRequests].map((record) => (
                    <tr key={record._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 text-sm'>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          record.requestType ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.requestType ? 'Request' : 'Salary'}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-900'>{record.employeeId}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>{record.employeeName}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>{record.email}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>{record.department}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>${record.basicSalary?.toLocaleString()}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>${record.allowances?.toLocaleString()}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>${record.deductions?.toLocaleString()}</td>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900'>${record.netSalary?.toLocaleString()}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>{record.payDate}</td>
                      <td className='px-6 py-4 text-sm'>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          record.status === 'Active' || record.status === 'Approved'
                            ? 'bg-green-100 text-green-800' 
                            : record.status === 'Pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          record.submittedBy === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.submittedBy}
                        </span>
                      </td>
                      {user?.role === 'admin' && (
                        <td className='px-6 py-4 text-sm'>
                          <div className='flex space-x-2'>
                            {record.requestType && record.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveRequest(record)}
                                  className='text-green-600 hover:text-green-800'
                                  title='Approve'
                                >
                                  <FaPlus />
                                </button>
                                <button 
                                  onClick={() => handleRejectRequest(record)}
                                  className='text-red-600 hover:text-red-800'
                                  title='Reject'
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                            {!record.requestType && (
                              <>
                                <button 
                                  onClick={() => handleEdit(record)}
                                  className='text-blue-600 hover:text-blue-800'
                                  title='Edit'
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  onClick={() => handleDelete(record._id)}
                                  className='text-red-600 hover:text-red-800'
                                  title='Delete'
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                            {record.requestType && (record.status === 'Approved' || record.status === 'Rejected') && (
                              <span className='text-gray-400 text-xs'>Processed</span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {[...salaries, ...salaryRequests].length === 0 && (
                <div className='text-center py-8 text-gray-500'>
                  No records found.
                </div>
              )}
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalaryCards
