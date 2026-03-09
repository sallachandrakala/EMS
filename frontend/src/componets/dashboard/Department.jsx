import React, { useState, useEffect } from 'react'
import { FaSignOutAlt, FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaBuilding } from 'react-icons/fa'
import { departmentAPI } from '../../services/api.js'

const Department = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentHead: '',
    description: ''
  })
  const [editingDepartment, setEditingDepartment] = useState(null)

  // Fetch departments from server
  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const data = await departmentAPI.getAll()
      setDepartments(data)
      setError('')
    } catch (error) {
      setError('Failed to fetch departments')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
    setEditingDepartment(null)
    setFormData({
      departmentName: '',
      departmentHead: '',
      description: ''
    })
  }

  const openEditModal = (department) => {
    setEditingDepartment(department)
    setFormData({
      departmentName: department.name,
      departmentHead: department.head || '',
      description: department.description || ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingDepartment(null)
    setFormData({
      departmentName: '',
      departmentHead: '',
      description: ''
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  const handleSubmit = async () => {
    try {
      if (!formData.departmentName) {
        alert('Please enter department name')
        return
      }

      if (editingDepartment) {
        // Update existing department
        await departmentAPI.update(editingDepartment._id, {
          name: formData.departmentName,
          head: formData.departmentHead,
          description: formData.description
        })
      } else {
        // Add new department
        if (!formData.departmentHead) {
          alert('Please enter department head name')
          return
        }
        await departmentAPI.create({
          name: formData.departmentName,
          head: formData.departmentHead,
          description: formData.description
        })
      }
      
      await fetchDepartments() // Refresh list
      closeModal()
    } catch (error) {
      alert(error.message || 'Failed to save department')
    }
  }

  const handleDelete = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.delete(departmentId)
        await fetchDepartments() // Refresh list
      } catch (error) {
        alert(error.message || 'Failed to delete department')
      }
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          {/* Header with Title and Add Button */}
          <div className='flex justify-between items-center mb-6'>
            <h4 className='text-2xl font-bold text-gray-800'>Department Management</h4>
            <button 
              onClick={openModal}
              className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              <FaBuilding className='text-lg' />
              <span>Add New Department</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className='mb-6'>
            <div className='relative max-w-md'>
              <input 
                type='text' 
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder='Search departments...' 
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              />
              <FaSearch className='absolute left-3 top-3 text-gray-400' />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
              {error}
            </div>
          )}

          {/* Department Table */}
          <div className='overflow-x-auto'>
            {loading ? (
              <div className='text-center py-8'>
                <div className='text-gray-500'>Loading departments...</div>
              </div>
            ) : (
              <table className='w-full text-left'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='pb-3 text-gray-700 font-semibold'>S.No</th>
                    <th className='pb-3 text-gray-700 font-semibold'>DepartmentName</th>
                    <th className='pb-3 text-gray-700 font-semibold'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept, index) => (
                    <tr key={dept._id} className='border-b border-gray-100'>
                      <td className='py-3 text-gray-600'>{index + 1}</td>
                      <td className='py-3 text-gray-800 font-medium'>{dept.name}</td>
                      <td className='py-3'>
                        <div className='flex items-center'>
                          <button 
                            onClick={() => openEditModal(dept)}
                            className='flex items-center space-x-1 text-white px-3 py-1 rounded text-sm transition-colors mr-1' 
                            style={{backgroundColor: '#23ab1f'}}
                          >
                            <FaEdit className='text-xs' />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(dept._id)}
                            className='flex items-center space-x-1 text-white px-3 py-1 rounded text-sm transition-colors' 
                            style={{backgroundColor: '#cc1030'}}
                          >
                            <FaTrash className='text-xs' />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Department Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold text-gray-800'>
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
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
                <label className='block text-sm font-medium text-gray-700 mb-2'>Department Name</label>
                <input 
                  type='text' 
                  value={formData.departmentName}
                  onChange={(e) => handleInputChange('departmentName', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                  placeholder='Enter department name' 
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Department Head</label>
                <input 
                  type='text' 
                  value={formData.departmentHead}
                  onChange={(e) => handleInputChange('departmentHead', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                  placeholder='Enter department head name' 
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
                  rows='3'
                  placeholder='Enter department description'
                ></textarea>
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
                {editingDepartment ? 'Update Department' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Department
