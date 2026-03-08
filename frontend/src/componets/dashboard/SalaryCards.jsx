import React, { useState, useEffect } from 'react'
import { FaMoneyBillWave, FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { employeeAPI } from '../../services/api'

const SalaryCards = () => {
  const [showForm, setShowForm] = useState(true) // Always show form
  const [editingSalary, setEditingSalary] = useState(null)
  const [formData, setFormData] = useState({
    employeeName: '',
    department: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: ''
  })

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
      payDate: formData.payDate
    }

    try {
      await employeeAPI.create(salaryData)
      alert('Salary saved successfully!')
      resetForm()
    } catch (error) {
      console.error('Failed to save salary:', error)
      alert('Failed to save salary. Please try again.')
    }
  }

  const resetForm = () => {
    setEditingSalary(null)
    setFormData({
      employeeName: '',
      department: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      payDate: ''
    })
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
            <FaMoneyBillWave className='mr-3 text-teal-600' />
            Salary Management
          </h2>
          <button 
            onClick={resetForm}
            className='text-gray-500 hover:text-gray-700 text-2xl'
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Employee Information */}
          <div className='bg-gray-50 rounded-lg p-6 mb-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
              <span className='w-2 h-2 bg-teal-600 rounded-full mr-3'></span>
              Employee Information
            </h3>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Employee Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.employeeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter employee name'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Department</label>
                <select
                  value={formData.department}
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
            </div>
          </div>

          {/* Salary Details */}
          <div className='bg-gray-50 rounded-lg p-6 mb-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-6 flex items-center'>
              <span className='w-2 h-2 bg-teal-600 rounded-full mr-3'></span>
              Salary Details
            </h3>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Basic Salary <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  value={formData.basicSalary}
                  onChange={(e) => setFormData(prev => ({ ...prev, basicSalary: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter basic salary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Allowances</label>
                <input
                  type='number'
                  value={formData.allowances}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowances: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter allowances'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Deductions</label>
                <input
                  type='number'
                  value={formData.deductions}
                  onChange={(e) => setFormData(prev => ({ ...prev, deductions: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                  placeholder='Enter deductions'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Pay Date</label>
                <input
                  type='date'
                  value={formData.payDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, payDate: e.target.value }))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-4 pt-6'>
            <button
              type='button'
              onClick={resetForm}
              className='px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
            >
              Add New Salary
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SalaryCards
