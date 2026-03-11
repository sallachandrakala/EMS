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

const SalaryManagement = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSalary, setEditingSalary] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [profileData, setProfileData] = useState({
    employeeId: user?.employeeId || 'EMP001',
    name: user?.name || 'Employee',
    email: user?.email || 'employee@company.com',
    department: user?.department || 'IT',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    loadData()
    // Update profile data when user changes
    setProfileData({
      employeeId: user?.employeeId || 'EMP001',
      name: user?.name || 'Employee',
      email: user?.email || 'employee@company.com',
      department: user?.department || 'IT',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }, [user])

  const loadData = () => {
    console.log('=== LOADING DATA (SHOW ALL REQUESTS) ===')
    
    // ONLY load from localStorage - ignore imported data files
    const storedRecords = localStorage.getItem('salaryRecords')
    const records = storedRecords ? JSON.parse(storedRecords) : []
    console.log('Loaded records from localStorage:', records.length)
    
    const storedRequests = localStorage.getItem('salaryRequests')
    const requests = storedRequests ? JSON.parse(storedRequests) : []
    console.log('Loaded requests from localStorage:', requests.length)
    console.log('All requests:', requests)
    
    // SHOW ALL REQUESTS - Don't filter by employeeId
    // This allows employees to see all requests they create, regardless of the ID they enter
    const allSalaryData = [...records, ...requests].sort((a, b) => {
      const dateA = new Date(a.effectiveDate || a.requestedDate || 0)
      const dateB = new Date(b.effectiveDate || b.requestedDate || 0)
      return dateB - dateA
    })
    
    console.log('Total salary data to display:', allSalaryData.length, 'records')
    console.log('Salary data:', allSalaryData)
    
    // If no data in localStorage, show empty (don't use hardcoded data)
    setSalaries(allSalaryData)
    setLoading(false)
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    
    try {
      // Validate password if changing
      if (profileData.newPassword || profileData.confirmPassword) {
        if (!profileData.currentPassword) {
          alert('Please enter your current password to change it.')
          return
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          alert('New passwords do not match!')
          return
        }
        if (profileData.newPassword.length < 6) {
          alert('New password must be at least 6 characters long.')
          return
        }
      }
      
      // Prepare updated user data
      const updatedData = {
        employeeId: profileData.employeeId,
        name: profileData.name,
        email: profileData.email,
        department: profileData.department
      }
      
      console.log('=== PROFILE UPDATE ===')
      console.log('Current user:', user)
      console.log('Updated data:', updatedData)
      
      // Update password if provided
      if (profileData.newPassword) {
        // Verify current password (simple check)
        if (user?.password && user.password !== profileData.currentPassword) {
          alert('❌ Current password is incorrect!')
          return
        }
        updatedData.password = profileData.newPassword
      }
      
      // Update user in auth context and localStorage
      if (updateUser) {
        const result = updateUser(updatedData)
        console.log('Updated user via context:', result)
      } else {
        // Fallback if updateUser is not available
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          const updatedUser = { ...userData, ...updatedData }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          console.log('Updated user via localStorage:', updatedUser)
        }
      }
      
      // Verify the update
      const verifyUser = localStorage.getItem('user')
      console.log('Verified user in localStorage:', verifyUser ? JSON.parse(verifyUser) : null)
      
      const message = profileData.newPassword 
        ? '✅ Profile and password updated successfully! Please login again with your new credentials.' 
        : '✅ Profile updated successfully!'
      
      alert(message)
      setShowProfileEdit(false)
      
      // Reset password fields
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // If password was changed, logout and redirect to login
      if (profileData.newPassword) {
        setTimeout(() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }, 1000)
      } else {
        // Just reload to show updated info
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('❌ Failed to update profile. Please try again.')
    }
  }

  const [filterDepartment, setFilterDepartment] = useState('all')
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    email: '',
    phone: '',
    department: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: '',
    effectiveDate: '',
    paymentMethod: 'Bank Transfer',
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      email: '',
      phone: '',
      department: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      netSalary: '',
      effectiveDate: '',
      paymentMethod: 'Bank Transfer',
      notes: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('🔵 FORM SUBMITTED')
    console.log('Form data:', formData)
    console.log('Editing salary:', editingSalary)
    console.log('Current user:', user)
    
    // Validate required fields
    if (!formData.employeeId || !formData.employeeName || !formData.email || !formData.department || !formData.basicSalary) {
      alert('❌ Please fill in all required fields:\n- Employee ID\n- Employee Name\n- Email\n- Department\n- Basic Salary')
      console.error('❌ Validation failed - missing required fields')
      return
    }
    
    if (editingSalary) {
      console.log('=== UPDATING EXISTING SALARY RECORD ===')
      console.log('Editing salary:', editingSalary)
      console.log('Form data:', formData)
      console.log('Employee Name in form:', formData.employeeName)
      
      try {
        // Calculate net salary
        const netSalary = parseFloat(formData.basicSalary || 0) + parseFloat(formData.allowances || 0) - parseFloat(formData.deductions || 0)
        
        const updatedData = {
          employeeId: formData.employeeId,
          employeeName: formData.employeeName,
          email: formData.email,
          department: formData.department,
          basicSalary: parseFloat(formData.basicSalary || 0),
          allowances: parseFloat(formData.allowances || 0),
          deductions: parseFloat(formData.deductions || 0),
          netSalary: netSalary,
          effectiveDate: formData.effectiveDate,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes
        }
        
        console.log('Updated data to save:', updatedData)
        
        const salaryId = editingSalary._id || editingSalary.id
        console.log('Updating salary with ID:', salaryId)
        
        // Update in localStorage - salaryRequests
        const storedRequests = localStorage.getItem('salaryRequests')
        if (storedRequests) {
          const requests = JSON.parse(storedRequests)
          console.log('Current requests before update:', requests)
          
          const updatedRequests = requests.map(r => {
            if (r._id === salaryId || r.id === salaryId) {
              console.log('Found matching request, updating...')
              console.log('Old data:', r)
              const updated = { ...r, ...updatedData }
              console.log('New data:', updated)
              return updated
            }
            return r
          })
          
          localStorage.setItem('salaryRequests', JSON.stringify(updatedRequests))
          console.log('✅ Updated salaryRequests in localStorage')
          console.log('Updated requests:', updatedRequests)
        }
        
        // Update in localStorage - salaryRecords
        const storedRecords = localStorage.getItem('salaryRecords')
        if (storedRecords) {
          const records = JSON.parse(storedRecords)
          const updatedRecords = records.map(r => 
            (r._id === salaryId || r.id === salaryId) 
              ? { ...r, ...updatedData } 
              : r
          )
          localStorage.setItem('salaryRecords', JSON.stringify(updatedRecords))
          console.log('✅ Updated salaryRecords in localStorage')
        }
        
        alert('✅ Salary request updated successfully! Name: ' + updatedData.employeeName)
        setShowAddForm(false)
        setEditingSalary(null)
        resetForm()
        
        // Reload data
        loadData()
        
        // Notify admin dashboard
        window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
      } catch (error) {
        console.error('Update failed:', error)
        alert('❌ Failed to update salary request!')
      }
    } else {
      console.log('Creating new salary request...')
      
      console.log('=== FORM DATA DETAILS ===')
      console.log('Employee ID from form:', formData.employeeId)
      console.log('Employee Name from form:', formData.employeeName)
      console.log('Email from form:', formData.email)
      console.log('Department from form:', formData.department)
      
      // Calculate net salary
      const netSalary = parseFloat(formData.basicSalary || 0) + parseFloat(formData.allowances || 0) - parseFloat(formData.deductions || 0)
      
      const newRequestData = {
        id: Date.now(),
        _id: Date.now().toString(),
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        email: formData.email,
        department: formData.department,
        basicSalary: parseFloat(formData.basicSalary || 0),
        allowances: parseFloat(formData.allowances || 0),
        deductions: parseFloat(formData.deductions || 0),
        netSalary: netSalary,
        effectiveDate: formData.effectiveDate || new Date().toISOString().split('T')[0],
        requestedDate: new Date().toISOString().split('T')[0],
        paymentMethod: formData.paymentMethod || 'Bank Transfer',
        notes: formData.notes || '',
        status: 'Pending',
        submittedBy: 'employee',
        submittedAt: new Date().toISOString()
      }
      
      console.log('=== NEW SALARY REQUEST DATA ===')
      console.log('Form Data:', formData)
      console.log('Request Data to save:', newRequestData)
      console.log('Employee Name in request:', newRequestData.employeeName)
      
      try {
        console.log('=== CREATING NEW SALARY REQUEST ===')
        console.log('Request data:', newRequestData)
        
        // Save directly to localStorage
        const storedRequests = localStorage.getItem('salaryRequests')
        const requests = storedRequests ? JSON.parse(storedRequests) : []
        
        console.log('📦 Current requests in localStorage:', requests.length)
        
        requests.push(newRequestData)
        localStorage.setItem('salaryRequests', JSON.stringify(requests))
        
        console.log('✅ Saved to localStorage:', requests.length, 'total requests')
        console.log('📝 Last saved request:', requests[requests.length - 1])
        console.log('👤 Employee name:', requests[requests.length - 1].employeeName)
        console.log('🆔 Employee ID:', requests[requests.length - 1].employeeId)
        console.log('💰 Net Salary:', requests[requests.length - 1].netSalary)
        console.log('📅 Effective Date:', requests[requests.length - 1].effectiveDate)
        console.log('� Status:', requests[requests.length - 1].status)
        
        // Verify it was saved
        const verifyRequests = JSON.parse(localStorage.getItem('salaryRequests') || '[]')
        console.log('🔍 Verification - Total requests in storage:', verifyRequests.length)
        
        alert('✅ Salary request submitted successfully!\n\nName: ' + newRequestData.employeeName + '\nAmount: $' + newRequestData.netSalary.toLocaleString() + '\n\nAdmin will review your request.')
        
        // Dispatch event to notify admin dashboard
        console.log('📡 Dispatching newSalaryRequest event to admin dashboard...')
        window.dispatchEvent(new CustomEvent('newSalaryRequest', { 
          detail: { request: newRequestData } 
        }))
        
        // Also dispatch salaryDataUpdated for good measure
        window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
        
        console.log('✅ Events dispatched successfully')
        
        // Reset form
        resetForm()
        setShowAddForm(false)
        
        // Reload data to show the new request
        loadData()
      } catch (error) {
        console.error('❌ Error submitting salary request:', error)
        alert('❌ Failed to submit salary request! Error: ' + error.message)
      }
    }
  }

  const handleEdit = (salary) => {
    console.log('=== EDIT BUTTON CLICKED ===')
    console.log('Salary to edit:', salary)
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
      netSalary: salary.netSalary,
      effectiveDate: salary.effectiveDate,
      paymentMethod: salary.paymentMethod || 'Bank Transfer',
      notes: salary.notes || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = (salary) => {
    console.log('=== DELETE BUTTON CLICKED ===')
    console.log('Salary to delete:', salary)
    
    if (window.confirm(`Are you sure you want to delete this salary request for ${salary.employeeName}?`)) {
      try {
        // Delete from localStorage
        const storedRequests = localStorage.getItem('salaryRequests')
        const storedRecords = localStorage.getItem('salaryRecords')
        
        if (storedRequests) {
          const requests = JSON.parse(storedRequests)
          const updatedRequests = requests.filter(r => 
            (r.id !== salary.id && r._id !== salary._id && r.id !== salary._id && r._id !== salary.id)
          )
          localStorage.setItem('salaryRequests', JSON.stringify(updatedRequests))
          console.log('Deleted from salaryRequests. Remaining:', updatedRequests.length)
        }
        
        if (storedRecords) {
          const records = JSON.parse(storedRecords)
          const updatedRecords = records.filter(r => 
            (r.id !== salary.id && r._id !== salary._id && r.id !== salary._id && r._id !== salary.id)
          )
          localStorage.setItem('salaryRecords', JSON.stringify(updatedRecords))
          console.log('Deleted from salaryRecords. Remaining:', updatedRecords.length)
        }
        
        // Update state
        const updatedSalaries = salaries.filter(s => 
          (s.id !== salary.id && s._id !== salary._id && s.id !== salary._id && s._id !== salary.id)
        )
        setSalaries(updatedSalaries)
        
        alert('✅ Salary request deleted successfully!')
        
        // Notify admin dashboard
        window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
        
        // Reload data
        loadData()
      } catch (error) {
        console.error('Failed to delete salary:', error)
        alert('❌ Failed to delete salary request!')
      }
    }
  }

  const filteredSalaries = salaries.filter(salary => {
    const matchesSearch = searchTerm === '' || 
      salary.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.basicSalary?.toString().includes(searchTerm)
    
    const matchesDepartment = filterDepartment === 'all' || salary.department === filterDepartment
    
    return matchesSearch && matchesDepartment
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL salary data (Admin + Employee) from EVERYWHERE. This action cannot be undone. Are you sure?')) {
      if (window.confirm('🚨 FINAL CONFIRMATION: ALL salary data from ALL users will be deleted from localStorage. Click OK to proceed.')) {
        try {
          console.log('=== CLEARING ALL SALARY DATA (COMPLETE WIPE) ===')
          
          // Clear ALL salary-related data from localStorage
          localStorage.removeItem('salaryRequests')
          localStorage.removeItem('salaryRecords')
          localStorage.removeItem('admin_dashboard_salaries')
          localStorage.removeItem('salary_requests') // Alternative key
          localStorage.removeItem('employeeSalaries')
          localStorage.removeItem('adminSalaries')
          
          console.log('✅ Removed all salary keys from localStorage')
          
          // Verify they're gone
          console.log('Verification:')
          console.log('- salaryRequests:', localStorage.getItem('salaryRequests'))
          console.log('- salaryRecords:', localStorage.getItem('salaryRecords'))
          console.log('- admin_dashboard_salaries:', localStorage.getItem('admin_dashboard_salaries'))
          
          // Update state to empty
          setSalaries([])
          
          // Force reload the page to clear any cached data
          alert('✅ All salary data has been cleared!\n\nPage will reload to ensure clean state.')
          
          // Notify admin dashboard BEFORE reload
          window.dispatchEvent(new CustomEvent('salaryDataUpdated'))
          window.dispatchEvent(new CustomEvent('clearAllSalaryData'))
          
          // Reload page after short delay
          setTimeout(() => {
            window.location.reload()
          }, 1000)
          
        } catch (error) {
          console.error('Failed to clear data:', error)
          alert('❌ Failed to clear salary data! Error: ' + error.message)
        }
      }
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              const requests = localStorage.getItem('salaryRequests')
              const records = localStorage.getItem('salaryRecords')
              const adminSalaries = localStorage.getItem('admin_dashboard_salaries')
              
              console.log('=== STORAGE DEBUG ===')
              console.log('salaryRequests:', requests ? JSON.parse(requests) : 'EMPTY')
              console.log('salaryRecords:', records ? JSON.parse(records) : 'EMPTY')
              console.log('admin_dashboard_salaries:', adminSalaries ? JSON.parse(adminSalaries) : 'EMPTY')
              
              const reqCount = requests ? JSON.parse(requests).length : 0
              const recCount = records ? JSON.parse(records).length : 0
              const adminCount = adminSalaries ? JSON.parse(adminSalaries).length : 0
              
              alert(`📊 Storage Status:\n\n` +
                    `Salary Requests: ${reqCount}\n` +
                    `Salary Records: ${recCount}\n` +
                    `Admin Salaries: ${adminCount}\n\n` +
                    `Total: ${reqCount + recCount + adminCount}\n\n` +
                    `Check console (F12) for details.`)
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaSearch />
            <span>Check Storage</span>
          </button>
          <button
            onClick={handleClearAllData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaTrash />
            <span>Clear All Data</span>
          </button>
          <button
            onClick={() => {
              resetForm()
              setShowAddForm(true)
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Request</span>
          </button>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg shadow-md border-2 border-purple-300 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-purple-800 flex items-center space-x-2">
            <FaUser />
            <span>My Profile</span>
          </h2>
          <button
            onClick={() => setShowProfileEdit(!showProfileEdit)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-all"
          >
            <FaEdit />
            <span>{showProfileEdit ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
        
        {!showProfileEdit ? (
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {(user?.name || 'E').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Full Name</p>
                <p className="text-lg font-bold text-gray-800">{user?.name || 'Employee'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Employee ID</p>
                <p className="text-lg font-bold text-gray-800">{user?.employeeId || 'EMP001'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Department</p>
                <p className="text-lg font-bold text-gray-800">{user?.department || 'IT'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                <p className="text-lg font-bold text-gray-800">{user?.email || 'employee@company.com'}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Employee ID
                </label>
                <input
                  type="text"
                  value={profileData.employeeId}
                  onChange={(e) => setProfileData({...profileData, employeeId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBuilding className="inline mr-2" />
                  Department
                </label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email (e.g., mohitha@gmail.com)"
                  required
                />
              </div>
            </div>
            
            {/* Password Change Section */}
            <div className="border-t-2 border-gray-200 pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Leave password fields empty if you don't want to change your password.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowProfileEdit(false)
                  setProfileData({
                    employeeId: user?.employeeId || 'EMP001',
                    name: user?.name || 'Employee',
                    email: user?.email || 'employee@company.com',
                    department: user?.department || 'IT',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  })
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 font-medium shadow-md"
              >
                <FaSave />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, department, or salary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingSalary ? 'Edit Salary Request' : 'Add Salary Request'}
            </h2>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingSalary(null)
                resetForm()
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {!editingSalary && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> You can enter ANY employee name and ID. The data will be sent to the admin dashboard for approval.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter any employee ID (e.g., EMP001, EMP002)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter any employee name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter email (e.g., mohitha@gmail.com)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter department (e.g., IT, HR, Finance)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                <input
                  type="number"
                  value={formData.allowances}
                  onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                <input
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary</label>
                <input
                  type="text"
                  value={`$${((parseFloat(formData.basicSalary) || 0) + (parseFloat(formData.allowances) || 0) - (parseFloat(formData.deductions) || 0)).toLocaleString()}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold text-green-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Cash">Cash</option>
                  <option value="Direct Deposit">Direct Deposit</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional notes or comments..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2"
              >
                <FaSave />
                <span>{editingSalary ? 'Update' : 'Submit'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Salary Records Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Salary Requests</h2>
        
        {filteredSalaries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-300" />
            <p>No salary requests found</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Create Your First Request
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalaries.map((salary, index) => (
                  <tr key={salary.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{salary.employeeName}</div>
                          <div className="text-sm text-gray-500">{salary.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${parseFloat(salary.basicSalary || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                      ${parseFloat(salary.netSalary || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.effectiveDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        salary.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        salary.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {salary.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(salary)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(salary)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
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
  )
}

export default SalaryManagement
