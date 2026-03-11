/* eslint-disable */
// SalaryCards.jsx - Cache bust: 2026-03-10-23-20
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaMoneyBillWave, FaLock, FaUnlock, FaEdit, FaTrash, FaPlus, FaUser, FaSync, FaCheck, FaTimes } from 'react-icons/fa'
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
    
    // Listen for new salary requests from employees
    const handleNewSalaryRequest = () => {
      console.log('📨 Admin dashboard received new salary request notification')
      loadSalaryRequests()
      loadSalaries()
    }
    
    // Listen for salary data updates
    const handleSalaryDataUpdated = () => {
      console.log('🔄 Admin dashboard received salary data update notification')
      loadSalaryRequests()
      loadSalaries()
    }
    
    // Listen for clear all data event
    const handleClearAllData = () => {
      console.log('🗑️ Admin dashboard received clear all data notification')
      setSalaries([])
      setSalaryRequests([])
      loadSalaryRequests()
      loadSalaries()
    }
    
    window.addEventListener('newSalaryRequest', handleNewSalaryRequest)
    window.addEventListener('salaryDataUpdated', handleSalaryDataUpdated)
    window.addEventListener('clearAllSalaryData', handleClearAllData)
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('newSalaryRequest', handleNewSalaryRequest)
      window.removeEventListener('salaryDataUpdated', handleSalaryDataUpdated)
      window.removeEventListener('clearAllSalaryData', handleClearAllData)
    }
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
      console.log('=== ADMIN LOADING SALARY REQUESTS ===')
      const requests = JSON.parse(localStorage.getItem('salaryRequests') || '[]')
      console.log('📥 Loaded salary requests from localStorage:', requests.length)
      console.log('📋 All requests:', requests)
      
      // Log each request for debugging
      requests.forEach((req, index) => {
        console.log(`Request ${index + 1}:`, {
          id: req._id || req.id,
          name: req.employeeName,
          employeeId: req.employeeId,
          netSalary: req.netSalary,
          status: req.status,
          effectiveDate: req.effectiveDate
        })
      })
      
      setSalaryRequests(requests)
      console.log('✅ Admin dashboard updated with', requests.length, 'requests')
    } catch (error) {
      console.error('❌ Failed to load salary requests:', error)
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
      
      // Handle different API response formats
      let salariesData = []
      if (Array.isArray(response)) {
        // API returns array directly
        salariesData = response
      } else if (response.data && Array.isArray(response.data)) {
        // API returns wrapped in data property
        salariesData = response.data
      } else {
        console.log('Unexpected API response format:', response)
        salariesData = []
      }
      
      console.log('Processed salaries data:', salariesData)
      
      if (salariesData.length > 0) {
        // Filter only admin-submitted data for admin dashboard (or show all if no submittedBy field)
        const adminSalaries = salariesData.filter(s => !s.submittedBy || s.submittedBy === 'admin')
        console.log('Filtered admin salaries:', adminSalaries)
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
          
          // Notify dashboard
          window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
        } catch (apiError) {
          console.warn('API update failed, using local fallback:', apiError)
          
          // Update in state and localStorage
          const updatedSalaries = salaries.map(s => 
            (s._id === editingSalary._id || s.id === editingSalary.id) 
              ? { ...s, ...salaryData, _id: s._id || s.id } 
              : s
          )
          setSalaries(updatedSalaries)
          localStorage.setItem('admin_dashboard_salaries', JSON.stringify(updatedSalaries))
          
          // Notify dashboard
          window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
          
          alert('Salary record updated locally!')
        }
      } else {
        try {
          await salaryAPI.create(salaryData)
          alert('Salary record created successfully!')
          loadSalaries()
          
          // Notify dashboard
          window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
        } catch (apiError) {
          console.warn('API create failed, using local fallback:', apiError)
          
          // Add to state and localStorage
          const newSalary = {
            ...salaryData,
            _id: Date.now().toString(),
            id: Date.now()
          }
          const newSalaries = [...salaries, newSalary]
          setSalaries(newSalaries)
          localStorage.setItem('admin_dashboard_salaries', JSON.stringify(newSalaries))
          
          // Notify dashboard
          window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
          
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
        const existingRequests = JSON.parse(localStorage.getItem('salaryRequests') || '[]')
        const newRequests = [...existingRequests, salaryRequest]
        localStorage.setItem('salaryRequests', JSON.stringify(newRequests))
        
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
    console.log('=== SALARYCARDS DELETE START ===')
    console.log('Salary ID to delete:', salaryId)
    console.log('Salary ID type:', typeof salaryId)
    console.log('Salary ID length:', salaryId?.length)
    console.log('Is MongoDB ObjectId format:', salaryId?.length === 24 && /^[0-9a-fA-F]{24}$/.test(salaryId))
    
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      // Check if ID is a valid MongoDB ObjectId format BEFORE any try-catch
      const isValidObjectId = salaryId && typeof salaryId === 'string' && salaryId.length === 24 && /^[0-9a-fA-F]{24}$/.test(salaryId)
      
      console.log('Final ObjectId validation result:', isValidObjectId)
      
      if (!isValidObjectId) {
        console.log('Invalid MongoDB ObjectId format, deleting locally only...')
        console.log('Skipping API call completely to avoid server error')
        
        // For local records (non-ObjectId format), delete locally only
        const updatedSalaries = salaries.filter(s => s._id !== salaryId)
        setSalaries(updatedSalaries)
        localStorage.setItem('admin_dashboard_salaries', JSON.stringify(updatedSalaries))
        alert('Local salary record deleted successfully!')
        return // Exit early, don't try API at all
      }
      
      // Only proceed with API for valid ObjectIds
      try {
        console.log('Valid MongoDB ObjectId, attempting server API deletion...')
        const apiDeleted = await salaryAPI.delete(salaryId)
        console.log('Server API deletion result:', apiDeleted)
        
        if (apiDeleted) {
          console.log('Successfully deleted from server API')
          alert('Salary record deleted successfully!')
          loadSalaries()
        } else {
          console.log('Server API deletion failed, trying local deletion...')
          // Fallback to local deletion
          const updatedSalaries = salaries.filter(s => s._id !== salaryId)
          setSalaries(updatedSalaries)
          localStorage.setItem('admin_dashboard_salaries', JSON.stringify(updatedSalaries))
          alert('Salary record deleted locally!')
        }
      } catch (error) {
        console.error('Failed to delete salary:', error)
        console.log('API error, attempting local deletion fallback...')
        
        // Fallback: delete from local state and localStorage
        try {
          const updatedSalaries = salaries.filter(s => s._id !== salaryId)
          setSalaries(updatedSalaries)
          localStorage.setItem('admin_dashboard_salaries', JSON.stringify(updatedSalaries))
          alert(`Salary record deleted locally (server error: ${error.message})`)
        } catch (localError) {
          console.error('Local deletion also failed:', localError)
          alert('Failed to delete salary record. Please try again.')
        }
      }
    }
  }

  const handleApproveRequest = (request) => {
    try {
      console.log('Approving request:', request)
      
      // Convert request to salary record
      const salaryRecord = {
        ...request,
        _id: request._id || request.id || Date.now().toString(),
        status: 'Active',
        approved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: user?.name || 'Admin'
      }

      // Add to admin salaries
      const newSalaries = [...salaries, salaryRecord]
      setSalaries(newSalaries)
      localStorage.setItem('admin_dashboard_salaries', JSON.stringify(newSalaries))

      // Update request status in salaryRequests
      const requestId = request._id || request.id
      const updatedRequests = salaryRequests.map(r => 
        (r._id === requestId || r.id === requestId) ? { ...r, status: 'Approved', approved: true } : r
      )
      setSalaryRequests(updatedRequests)
      localStorage.setItem('salaryRequests', JSON.stringify(updatedRequests))

      // Notify dashboard
      window.dispatchEvent(new CustomEvent('salaryDataUpdated'))

      console.log('Request approved and saved to localStorage')
      alert(`✅ Salary request for ${request.employeeName} approved successfully!`)
    } catch (error) {
      console.error('Failed to approve request:', error)
      alert('Failed to approve request.')
    }
  }

  const handleRejectRequest = (request) => {
    if (window.confirm(`Are you sure you want to reject the salary request for ${request.employeeName}?`)) {
      try {
        console.log('Rejecting request:', request)
        
        // Update request status
        const requestId = request._id || request.id
        const updatedRequests = salaryRequests.map(r => 
          (r._id === requestId || r.id === requestId) ? { ...r, status: 'Rejected', approved: false } : r
        )
        setSalaryRequests(updatedRequests)
        localStorage.setItem('salaryRequests', JSON.stringify(updatedRequests))

        // Notify dashboard
        window.dispatchEvent(new CustomEvent('salaryDataUpdated'))

        console.log('Request rejected and saved to localStorage')
        alert(`❌ Salary request for ${request.employeeName} rejected.`)
      } catch (error) {
        console.error('Failed to reject request:', error)
        alert('Failed to reject request.')
      }
    }
  }

  const handleDeleteRequest = (request) => {
    if (window.confirm(`Are you sure you want to delete the salary request for ${request.employeeName}? This action cannot be undone.`)) {
      try {
        console.log('Deleting request:', request)
        
        // Remove request from array
        const requestId = request._id || request.id
        const updatedRequests = salaryRequests.filter(r => 
          (r._id !== requestId && r.id !== requestId)
        )
        setSalaryRequests(updatedRequests)
        localStorage.setItem('salaryRequests', JSON.stringify(updatedRequests))

        // Notify dashboard
        window.dispatchEvent(new CustomEvent('salaryDataUpdated'))

        console.log('Request deleted from localStorage')
        alert(`🗑️ Salary request for ${request.employeeName} deleted successfully.`)
      } catch (error) {
        console.error('Failed to delete request:', error)
        alert('Failed to delete request.')
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
                  <>
                    <button 
                      onClick={() => {
                        if (window.confirm('⚠️ WARNING: Clear ALL salary data from the system? This cannot be undone!')) {
                          if (window.confirm('🚨 FINAL CONFIRMATION: Delete everything?')) {
                            console.log('=== ADMIN CLEARING ALL DATA ===')
                            localStorage.removeItem('salaryRequests')
                            localStorage.removeItem('salaryRecords')
                            localStorage.removeItem('admin_dashboard_salaries')
                            localStorage.removeItem('salary_requests')
                            setSalaries([])
                            setSalaryRequests([])
                            alert('✅ All data cleared! Page will reload.')
                            setTimeout(() => window.location.reload(), 1000)
                          }
                        }
                      }}
                      className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                      title='Clear all salary data'
                    >
                      <FaTrash className='mr-2' />
                      Clear All Data
                    </button>
                    <button 
                      onClick={() => setShowForm(!showForm)}
                      className='bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                    >
                      <FaPlus className='mr-2' />
                      Add Salary
                    </button>
                    <button 
                      onClick={() => {
                        console.log('🔄 Manual refresh triggered')
                        loadSalaries()
                        loadSalaryRequests()
                      }}
                      className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                      title='Refresh salary data'
                    >
                      <FaSync className='mr-2' />
                      Refresh Data
                    </button>
                    <button 
                      onClick={() => {
                        const requests = JSON.parse(localStorage.getItem('salaryRequests') || '[]')
                        const salaries = JSON.parse(localStorage.getItem('admin_dashboard_salaries') || '[]')
                        alert(`📊 Storage Status:\n\n` +
                              `Salary Requests: ${requests.length}\n` +
                              `Admin Salaries: ${salaries.length}\n\n` +
                              `Check console for details.`)
                        console.log('📊 STORAGE DEBUG:')
                        console.log('Salary Requests:', requests)
                        console.log('Admin Salaries:', salaries)
                      }}
                      className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                      title='Check storage status'
                    >
                      <FaUser className='mr-2' />
                      Debug Storage
                    </button>
                  </>
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
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Net Salary</label>
                  <input
                    type='text'
                    value={`$${((parseFloat(formData.basicSalary) || 0) + (parseFloat(formData.allowances) || 0) - (parseFloat(formData.deductions) || 0)).toLocaleString()}`}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold text-green-700'
                    readOnly
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
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Effective Date</label>
                  <input
                    type='date'
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
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
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-bold text-gray-800'>Salary History</h3>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-600'>Total: {[...salaries, ...salaryRequests].length}</span>
              <button className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm'>
                Export to Excel
              </button>
            </div>
          </div>
          
          {/* Filter Buttons */}
          {user?.role === 'admin' && (
            <div className='flex flex-wrap gap-2 mb-4'>
              <button
                onClick={() => filterByStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({[...salaries, ...salaryRequests].length})
              </button>
              <button
                onClick={() => filterByStatus('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentFilter === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending Requests ({salaryRequests.filter(r => r.status === 'Pending').length})
              </button>
              <button
                onClick={() => filterByStatus('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentFilter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Approved ({salaryRequests.filter(r => r.status === 'Approved').length})
              </button>
              <button
                onClick={() => filterByStatus('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rejected ({salaryRequests.filter(r => r.status === 'Rejected').length})
              </button>
            </div>
          )}
          
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
                  {filteredData.map((record) => {
                    // Determine if this is a request or a salary record
                    const isRequest = record.requestType === 'salary_update' || 
                                     record.status === 'Pending' || 
                                     salaryRequests.some(r => (r._id === record._id || r.id === record.id))
                    
                    return (
                    <tr key={record._id || record.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 text-sm'>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          isRequest ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isRequest ? 'Request' : 'Salary'}
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
                          <div className='flex flex-wrap gap-2'>
                            {isRequest && record.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveRequest(record)}
                                  className='bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-1'
                                  title='Approve Request'
                                >
                                  <FaCheck className='text-xs' />
                                  <span>Accept</span>
                                </button>
                                <button 
                                  onClick={() => handleRejectRequest(record)}
                                  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-1'
                                  title='Reject Request'
                                >
                                  <FaTimes className='text-xs' />
                                  <span>Reject</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteRequest(record)}
                                  className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-1'
                                  title='Delete Request'
                                >
                                  <FaTrash className='text-xs' />
                                  <span>Delete</span>
                                </button>
                              </>
                            )}
                            {isRequest && record.status !== 'Pending' && (
                              <>
                                <span className='text-gray-500 text-xs italic'>
                                  {record.status === 'Approved' ? 'Accepted' : 'Rejected'}
                                </span>
                                <button 
                                  onClick={() => handleDeleteRequest(record)}
                                  className='text-red-600 hover:text-red-800 p-1'
                                  title='Delete Request'
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                            {!isRequest && (
                              <>
                                <button 
                                  onClick={() => handleEdit(record)}
                                  className='text-blue-600 hover:text-blue-800 p-1'
                                  title='Edit'
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  onClick={() => {
                                    console.log('=== DELETE BUTTON CLICKED ===');
                                    console.log('Record being deleted:', record);
                                    console.log('Record ID:', record._id);
                                    console.log('Record ID type:', typeof record._id);
                                    console.log('Record ID length:', record._id?.length);
                                    handleDelete(record._id);
                                  }}
                                  className='text-red-600 hover:text-red-800'
                                  title='Delete'
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredData.length === 0 && (
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
