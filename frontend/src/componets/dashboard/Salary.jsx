import React, { useState } from 'react'
import { FaSignOutAlt, FaEdit, FaTrash, FaTimes, FaMoneyBillWave } from 'react-icons/fa'

const Salary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [salaries, setSalaries] = useState([
    { id: 1, employeeName: 'John Doe', department: 'Information Technology', basicSalary: 4000, allowances: 500, netSalary: 4500, image: 'https://picsum.photos/seed/employee1/40/40.jpg' },
    { id: 2, employeeName: 'Jane Smith', department: 'Human Resources', basicSalary: 3500, allowances: 400, netSalary: 3900, image: 'https://picsum.photos/seed/employee2/40/40.jpg' },
    { id: 3, employeeName: 'Mike Johnson', department: 'Finance', basicSalary: 4500, allowances: 600, netSalary: 5100, image: 'https://picsum.photos/seed/employee3/40/40.jpg' }
  ])
  const [formData, setFormData] = useState({
    employeeName: '',
    department: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: ''
  })
  const [editingSalary, setEditingSalary] = useState(null)

  const openModal = () => {
    setIsModalOpen(true)
    setEditingSalary(null)
    setFormData({
      employeeName: '',
      department: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      netSalary: ''
    })
  }

  const openEditModal = (salary) => {
    setEditingSalary(salary)
    setFormData({
      employeeName: salary.employeeName || '',
      department: salary.department || '',
      basicSalary: salary.basicSalary || '',
      allowances: salary.allowances || '',
      deductions: salary.deductions || '',
      netSalary: salary.netSalary || ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSalary(null)
    setFormData({
      employeeName: '',
      department: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      netSalary: ''
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

  const handleSubmit = () => {
    if (!formData.employeeName || !formData.basicSalary) {
      alert('Please enter employee name and basic salary')
      return
    }

    const salaryData = {
      ...formData,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances) || 0,
      deductions: parseFloat(formData.deductions) || 0,
      netSalary: parseFloat(formData.netSalary) || 0
    }

    if (editingSalary) {
      // Update existing salary
      setSalaries(prev => 
        prev.map(salary => 
          salary.id === editingSalary.id 
            ? { ...salary, ...salaryData }
            : salary
        )
      )
    } else {
      // Add new salary
      const newSalary = {
        id: salaries.length + 1,
        ...salaryData,
        image: `https://picsum.photos/seed/employee${salaries.length + 1}/40/40.jpg`
      }
      setSalaries(prev => [...prev, newSalary])
    }
    
    closeModal()
  }

  const handleDelete = (salaryId) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      setSalaries(prev => prev.filter(salary => salary.id !== salaryId))
    }
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        <div className='flex justify-end items-center'>
          <button className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          {/* Header with Title and Add Button */}
          <div className='flex justify-between items-center mb-6'>
            <h4 className='text-2xl font-bold text-gray-800'>Salary Management</h4>
            <button 
              onClick={openModal}
              className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <FaMoneyBillWave className='text-lg' />
              <span>Add New Salary</span>
            </button>
          </div>

          {/* Salary List */}
          <div className='space-y-4'>
            {salaries.map((salary, index) => (
              <div key={salary.id} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-4'>
                    <img 
                      src={salary.image} 
                      alt={salary.employeeName} 
                      className='w-16 h-16 rounded-full object-cover'
                    />
                    <div>
                      <h5 className='text-xl font-semibold text-gray-800'>{salary.employeeName}</h5>
                      <p className='text-base text-gray-600'>{salary.department}</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <button 
                      onClick={() => openEditModal(salary)}
                      className='flex items-center space-x-2 text-white px-4 py-2 rounded text-base transition-colors' 
                      style={{backgroundColor: '#23ab1f'}}
                    >
                      <FaEdit className='text-sm' />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(salary.id)}
                      className='flex items-center space-x-2 text-white px-4 py-2 rounded text-base transition-colors' 
                      style={{backgroundColor: '#cc1030'}}
                    >
                      <FaTrash className='text-sm' />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                
                <div className='space-y-4 pl-20'>
                  <div className='flex items-center'>
                    <span className='text-base text-gray-600 w-32'>Basic Salary:</span>
                    <span className='text-xl font-semibold text-gray-800'>₹{salary.basicSalary}</span>
                  </div>
                  <div className='flex items-center'>
                    <span className='text-base text-gray-600 w-32'>Allowances:</span>
                    <span className='text-xl font-semibold text-green-600'>₹{salary.allowances}</span>
                  </div>
                  <div className='flex items-center'>
                    <span className='text-base text-gray-600 w-32'>Net Salary:</span>
                    <span className='text-2xl font-bold text-teal-600'>₹{salary.netSalary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Salary Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold text-gray-800'>
                {editingSalary ? 'Edit Salary' : 'Add New Salary'}
              </h3>
              <button 
                onClick={closeModal}
                className='text-gray-500 hover:text-gray-700 transition-colors'
              >
                <FaTimes className='text-xl' />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Employee Name</label>
                <input 
                  type='text' 
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                  placeholder='Enter employee name' 
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Department</label>
                <select 
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                  placeholder='Enter basic salary' 
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Allowances</label>
                <input 
                  type='number' 
                  value={formData.allowances}
                  onChange={(e) => handleInputChange('allowances', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                  placeholder='Enter allowances' 
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Deductions</label>
                <input 
                  type='number' 
                  value={formData.deductions}
                  onChange={(e) => handleInputChange('deductions', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                  placeholder='Enter deductions' 
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Net Salary</label>
                <div className='flex space-x-2'>
                  <input 
                    type='number' 
                    value={formData.netSalary}
                    onChange={(e) => handleInputChange('netSalary', e.target.value)}
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                    placeholder='Net salary (auto-calculated)' 
                    readOnly
                  />
                  <button 
                    type='button'
                    onClick={calculateNetSalary}
                    className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors'
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>

            <div className='mt-6 flex justify-end space-x-3'>
              <button 
                onClick={closeModal}
                className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className='px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors'
              >
                {editingSalary ? 'Update Salary' : 'Add Salary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Salary
