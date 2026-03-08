import React, { useState, useEffect } from 'react'
import { FaMoneyBillWave, FaTimes, FaUpload, FaSave, FaPlus, FaSearch } from 'react-icons/fa'
import { employeeAPI } from '../../services/api'

const SalaryManagement = () => {
  const [showAddPage, setShowAddPage] = useState(false)
  const [showEditPage, setShowEditPage] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState(null)
  const [salaries, setSalaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    maritalStatus: '',
    designation: '',
    department: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: '',
    effectiveDate: '',
    paymentMethod: 'Bank Transfer',
    role: '',
    status: 'Active',
    password: '',
    image: null,
    imageName: '',
    notes: ''
  })

  useEffect(() => {
    loadSalaries()
  }, [])

  const loadSalaries = async () => {
    try {
      setLoading(true)
      const data = await employeeAPI.getAll()
      const salaryData = data.map(emp => ({
        _id: emp._id,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        basicSalary: emp.basicSalary || 0,
        allowances: emp.allowances || 0,
        deductions: emp.deductions || 0,
        netSalary: emp.netSalary || emp.salary || 0,
        effectiveDate: emp.effectiveDate || new Date().toISOString().split('T')[0],
        paymentMethod: emp.paymentMethod || 'Bank Transfer',
        image: emp.image,
        notes: emp.salaryNotes || '',
        department: emp.department,
        status: emp.status
      }))
      setSalaries(salaryData)
    } catch (error) {
      console.error('Failed to load salaries:', error)
      setSalaries([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF only)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        try {
          // Create image object for validation
          const img = new Image()
          img.onload = () => {
            try {
              // Validate image dimensions
              if (img.width === 0 || img.height === 0) {
                alert('Invalid image format or corrupted file')
                return
              }

              // Compress image if needed
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              
              // Set max dimensions
              const maxWidth = 800
              const maxHeight = 600
              let width = img.width
              let height = img.height
              
              // Calculate new dimensions
              if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height
                if (width > height) {
                  width = maxWidth
                  height = Math.round(maxWidth / aspectRatio)
                } else {
                  height = maxHeight
                  width = Math.round(maxHeight * aspectRatio)
                }
              }
              
              // Set canvas dimensions
              canvas.width = width
              canvas.height = height
              
              // Draw and compress image
              ctx.drawImage(img, 0, 0, width, height)
              
              // Convert to compressed base64 with proper format
              let compressedImage
              if (file.type === 'image/png') {
                compressedImage = canvas.toDataURL('image/png', 0.8)
              } else {
                compressedImage = canvas.toDataURL('image/jpeg', 0.8)
              }
              
              setFormData(prev => ({
                ...prev,
                image: compressedImage,
                imageName: file.name
              }))
            } catch (compressionError) {
              console.error('Image compression error:', compressionError)
              // Fallback to original image if compression fails
              setFormData(prev => ({
                ...prev,
                image: reader.result,
                imageName: file.name
              }))
            }
          }
          
          img.onerror = () => {
            alert('Failed to load image. Please try a different file.')
          }
          
          img.src = reader.result
        } catch (error) {
          console.error('Image processing error:', error)
          alert('Failed to process image. Please try again.')
        }
      }
      
      reader.onerror = () => {
        alert('Failed to read file. Please try again.')
      }
      
      reader.readAsDataURL(file)
    }
  }

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0
    const allowances = parseFloat(formData.allowances) || 0
    const deductions = parseFloat(formData.deductions) || 0
    const net = basic + allowances - deductions
    setFormData(prev => ({
      ...prev,
      netSalary: net.toString()
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.employeeId || !formData.employeeName || !formData.basicSalary) {
      alert('Please enter employee ID, name, and basic salary')
      return
    }

    const salaryData = {
      ...formData,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      deductions: parseFloat(formData.deductions),
      netSalary: parseFloat(formData.netSalary),
      effectiveDate: formData.effectiveDate,
      paymentMethod: formData.paymentMethod,
      salaryNotes: formData.notes,
      image: formData.image || `https://picsum.photos/seed/salary${salaries.length + 1}/200/200.jpg`
    }

    try {
      if (selectedSalary) {
        await employeeAPI.update(selectedSalary._id, salaryData)
        setSalaries(prev => 
          prev.map(salary => 
            salary._id === selectedSalary._id 
              ? { ...salary, ...salaryData }
              : salary
          )
        )
      } else {
        const newSalary = {
          ...salaryData,
          _id: `salary_${Date.now()}`
        }
        setSalaries(prev => [...prev, newSalary])
      }
      closeAddPage()
    } catch (error) {
      console.error('Failed to save salary:', error)
      alert('Failed to save salary. Please check server connection.')
    }
  }

  const handleDelete = async (salaryId) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await employeeAPI.delete(salaryId.replace('salary_', ''))
        setSalaries(prev => prev.filter(salary => salary._id !== salaryId))
      } catch (error) {
        console.error('Failed to delete salary:', error)
        alert('Failed to delete salary. Please check server connection.')
      }
    }
  }

  const openAddPage = () => {
    setSelectedSalary(null)
    setFormData({
      employeeId: '',
      employeeName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      maritalStatus: '',
      designation: '',
      department: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      netSalary: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      role: '',
      status: 'Active',
      password: '',
      image: null,
      imageName: '',
      notes: ''
    })
    setShowAddPage(true)
  }

  const openEditPage = (salary) => {
    setSelectedSalary(salary)
    setFormData({
      employeeId: salary.employeeId,
      employeeName: salary.employeeName,
      email: salary.email || '',
      phone: salary.phone || '',
      dateOfBirth: salary.dateOfBirth || '',
      maritalStatus: salary.maritalStatus || '',
      designation: salary.designation || '',
      department: salary.department || '',
      basicSalary: salary.basicSalary.toString(),
      allowances: salary.allowances.toString(),
      deductions: salary.deductions.toString(),
      netSalary: salary.netSalary.toString(),
      effectiveDate: salary.effectiveDate,
      paymentMethod: salary.paymentMethod,
      role: salary.role || '',
      status: salary.status || 'Active',
      password: salary.password || '',
      image: salary.image,
      imageName: salary.imageName || '',
      notes: salary.notes
    })
    setShowEditPage(true)
  }

  const closeAddPage = () => {
    setShowAddPage(false)
    setShowEditPage(false)
    setSelectedSalary(null)
  }

  const filteredSalaries = salaries.filter(salary =>
    salary.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showAddPage || showEditPage) {
    return (
      <div className='min-h-screen bg-gray-100 p-8'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-3xl font-bold text-gray-800 flex items-center'>
              <FaMoneyBillWave className='mr-3 text-teal-600' />
              {selectedSalary ? 'Edit Salary' : 'Add New Salary'}
            </h2>
            <button 
              onClick={closeAddPage}
              className='text-gray-500 hover:text-gray-700 text-2xl'
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Personal Information Section */}
            <div className='bg-gray-50 rounded-lg p-6 mb-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
                <span className='w-2 h-2 bg-teal-600 rounded-full mr-3'></span>
                Personal Information
              </h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Employee ID <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter employee ID'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter full name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter email address'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                  <input
                    type='tel'
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter phone number'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Date of Birth</label>
                  <input
                    type='date'
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Marital Status</label>
                  <select
                    value={formData.maritalStatus || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maritalStatus: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  >
                    <option value=''>Select Status</option>
                    <option value='Single'>Single</option>
                    <option value='Married'>Married</option>
                    <option value='Divorced'>Divorced</option>
                    <option value='Widowed'>Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className='bg-gray-50 rounded-lg p-6 mb-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
                <span className='w-2 h-2 bg-teal-600 rounded-full mr-3'></span>
                Professional Information
              </h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Designation</label>
                  <input
                    type='text'
                    value={formData.designation || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter designation'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Department</label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  >
                    <option value=''>Select Department</option>
                    <option value='Information Technology'>Information Technology</option>
                    <option value='Human Resources'>Human Resources</option>
                    <option value='Finance'>Finance</option>
                    <option value='Marketing'>Marketing</option>
                    <option value='Operations'>Operations</option>
                    <option value='Sales'>Sales</option>
                    <option value='Administration'>Administration</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Salary</label>
                  <input
                    type='number'
                    value={formData.basicSalary}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, basicSalary: e.target.value }))
                      calculateNetSalary()
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter salary'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Role</label>
                  <select
                    value={formData.role || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  >
                    <option value=''>Select Role</option>
                    <option value='Employee'>Employee</option>
                    <option value='Manager'>Manager</option>
                    <option value='Admin'>Admin</option>
                    <option value='HR'>HR</option>
                    <option value='Finance'>Finance</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
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
                    value={formData.password || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter password'
                  />
                </div>
              </div>
            </div>

            {/* Salary Details Section */}
            <div className='bg-gray-50 rounded-lg p-6 mb-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
                <span className='w-2 h-2 bg-teal-600 rounded-full mr-3'></span>
                Salary Details
              </h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Basic Salary ($)</label>
                  <input
                    type='number'
                    value={formData.basicSalary}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, basicSalary: e.target.value }))
                      calculateNetSalary()
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter basic salary'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Allowances ($)</label>
                  <input
                    type='number'
                    value={formData.allowances}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, allowances: e.target.value }))
                      calculateNetSalary()
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter allowances'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Deductions ($)</label>
                  <input
                    type='number'
                    value={formData.deductions}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, deductions: e.target.value }))
                      calculateNetSalary()
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                    placeholder='Enter deductions'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Net Salary ($)</label>
                  <input
                    type='number'
                    value={formData.netSalary}
                    readOnly
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                    placeholder='Calculated net salary'
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className='bg-gray-50 rounded-lg p-6 mb-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
                <span className='w-2 h-2 bg-teal-600 rounded-full mr-3'></span>
                Additional Information
              </h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Effective Date</label>
                  <input
                    type='date'
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
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
                <label className='block text-sm font-medium text-gray-700 mb-2'>Upload Image</label>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-4'>
                    <input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png,image/gif'
                      onChange={handleImageUpload}
                      className='hidden'
                      id='image-upload'
                    />
                    <label
                      htmlFor='image-upload'
                      className='flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer transition-colors'
                    >
                      <FaUpload className='mr-2' />
                      Choose File
                    </label>
                    {formData.imageName && (
                      <span className='text-sm text-gray-600'>{formData.imageName}</span>
                    )}
                  </div>
                  {formData.image && (
                    <div className='flex items-center space-x-4'>
                      <img
                        src={formData.image}
                        alt='Employee image preview'
                        className='w-24 h-24 object-cover rounded-lg border-2 border-gray-300'
                      />
                      <button
                        type='button'
                        onClick={() => setFormData(prev => ({ ...prev, image: null, imageName: '' }))}
                        className='text-red-500 hover:text-red-700 text-sm'
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                  <p className='text-xs text-gray-500'>Supported formats: JPG, PNG, GIF (Max: 5MB)</p>
                </div>
              </div>

              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter any additional notes...'
                />
              </div>
            </div>

            <div className='flex justify-end space-x-4 mt-8'>
              <button
                type='button'
                onClick={closeAddPage}
                className='px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center'
              >
                <FaSave className='mr-2' />
                {selectedSalary ? 'Update Salary' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
          <div className='flex justify-between items-center'>
            <h2 className='text-3xl font-bold text-gray-800 flex items-center'>
              <FaMoneyBillWave className='mr-3 text-teal-600' />
              Salary Management
            </h2>
            <button
              onClick={openAddPage}
              className='bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center'
            >
              <FaPlus className='mr-2' />
              Add New Salary
            </button>
          </div>

          <div className='mt-6'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search by employee name or ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
              />
              <FaSearch className='absolute left-3 top-3.5 text-gray-400' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='text-gray-500'>Loading salary records...</div>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Employee ID</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Basic Salary</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Allowances</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Deductions</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Net Salary</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Effective Date</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Payment Method</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredSalaries.map((salary, index) => (
                    <tr key={salary._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {salary.employeeId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        <div className='flex items-center'>
                          {salary.image && (
                            <img
                              src={salary.image}
                              alt={salary.employeeName}
                              className='w-8 h-8 rounded-full object-cover mr-3'
                            />
                          )}
                          {salary.employeeName}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ${salary.basicSalary?.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ${salary.allowances?.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ${salary.deductions?.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        ${salary.netSalary?.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {salary.effectiveDate}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          salary.paymentMethod === 'Bank Transfer' ? 'bg-blue-100 text-blue-800' :
                          salary.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {salary.paymentMethod}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          salary.status === 'Active' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {salary.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => openEditPage(salary)}
                            className='text-blue-600 hover:text-blue-900'
                            title='Edit Salary'
                          >
                            <FaMoneyBillWave />
                          </button>
                          <button
                            onClick={() => handleDelete(salary._id)}
                            className='text-red-600 hover:text-red-900'
                            title='Delete Salary'
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSalaries.length === 0 && (
                    <tr>
                      <td colSpan='8' className='px-6 py-4 text-center text-gray-500'>
                        No salary records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalaryManagement
