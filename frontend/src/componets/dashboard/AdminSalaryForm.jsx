import React, { useState } from 'react'
import { FaMoneyBillWave, FaTimes, FaSave, FaCalculator } from 'react-icons/fa'
import { employeeAPI } from '../../services/api'

const AdminSalaryForm = () => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    employeeName: '',
    department: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: '',
    image: null
  })

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
    const deductions = parseFloat(formData.deductions) || 0
    const net = basic + allowances - deductions
    setFormData(prev => ({
      ...prev,
      netSalary: net.toString()
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.employeeName || !formData.basicSalary) {
      alert('Please enter employee name and basic salary')
      return
    }

    const salaryData = {
      employeeName: formData.employeeName,
      department: formData.department,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      deductions: parseFloat(formData.deductions),
      netSalary: parseFloat(formData.netSalary),
      image: formData.image || `https://picsum.photos/seed/salary${Date.now()}/200/200.jpg`
    }

    try {
      await employeeAPI.create(salaryData)
      alert('Salary added successfully!')
      setShowForm(false)
      setFormData({
        employeeName: '',
        department: '',
        basicSalary: '',
        allowances: '',
        deductions: '',
        netSalary: '',
        image: null
      })
    } catch (error) {
      console.error('Failed to add salary:', error)
      alert('Failed to add salary. Please try again.')
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setFormData({
      employeeName: '',
      department: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      netSalary: '',
      image: null
    })
  }

  if (!showForm) {
    return (
      <div className='p-6'>
        <button
          onClick={() => setShowForm(true)}
          className='bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center'
        >
          <FaMoneyBillWave className='mr-2' />
          Add New Salary
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
            <FaMoneyBillWave className='mr-3 text-teal-600' />
            Add New Salary
          </h2>
          <button 
            onClick={closeForm}
            className='text-gray-500 hover:text-gray-700 text-2xl'
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Employee Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Employee Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={formData.employeeName}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
              placeholder='Enter employee name'
            />
          </div>

          {/* Department */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
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

          {/* Salary Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Basic Salary <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={formData.basicSalary}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, basicSalary: e.target.value }))
                  calculateNetSalary()
                }}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
                placeholder='Enter basic salary'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Allowances
              </label>
              <input
                type='number'
                value={formData.allowances}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, allowances: e.target.value }))
                  calculateNetSalary()
                }}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
                placeholder='Enter allowances'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Deductions
              </label>
              <input
                type='number'
                value={formData.deductions}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, deductions: e.target.value }))
                  calculateNetSalary()
                }}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg'
                placeholder='Enter deductions'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Net Salary
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={formData.netSalary}
                  readOnly
                  className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-lg font-semibold text-green-600'
                  placeholder='Net salary (auto-calculated)'
                />
                <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                  <FaCalculator className='text-green-500' />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Upload Image
            </label>
            <div className='flex items-center space-x-4'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
                id='image-upload'
              />
              <label
                htmlFor='image-upload'
                className='flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer transition-colors'
              >
                Choose File
              </label>
              {formData.image && (
                <img
                  src={formData.image}
                  alt='Salary document preview'
                  className='w-16 h-16 object-cover rounded border-2 border-gray-300'
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-4 pt-6'>
            <button
              type='button'
              onClick={closeForm}
              className='px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-lg flex items-center'
            >
              <FaSave className='mr-2' />
              Add Salary
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSalaryForm
