import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaEdit,
  FaCamera,
  FaSave,
  FaTimes,
  FaKey,
  FaDownload,
  FaTrash
} from 'react-icons/fa'
import { employeeAPI } from '../services/api'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    joinDate: '',
    employeeId: '',
    emergencyContact: '',
    bloodGroup: '',
    maritalStatus: '',
    nationality: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Try to load from API first
      if (user?.employeeId) {
        const response = await employeeAPI.getById(user.employeeId)
        if (response.data) {
          setFormData(response.data)
          setImagePreview(response.data.profileImage)
        }
      } else {
        // Fallback to user context data
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: user?.address || '',
          department: user?.department || 'IT',
          position: user?.position || 'Software Developer',
          joinDate: user?.joinDate || '2023-01-01',
          employeeId: user?.employeeId || 'EMP001',
          emergencyContact: user?.emergencyContact || '',
          bloodGroup: user?.bloodGroup || 'O+',
          maritalStatus: user?.maritalStatus || 'Single',
          nationality: user?.nationality || 'US'
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      // Set default values on error
      setFormData({
        name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@company.com',
        phone: user?.phone || '+1 234 567 8900',
        address: user?.address || '123 Main St, New York, NY',
        department: user?.department || 'IT',
        position: user?.position || 'Software Developer',
        joinDate: user?.joinDate || '2023-01-01',
        employeeId: user?.employeeId || 'EMP001',
        emergencyContact: user?.emergencyContact || '+1 987 654 3210',
        bloodGroup: user?.bloodGroup || 'O+',
        maritalStatus: user?.maritalStatus || 'Single',
        nationality: user?.nationality || 'US'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setProfileImage(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const updateData = new FormData()
      Object.keys(formData).forEach(key => {
        updateData.append(key, formData[key])
      })
      
      if (profileImage) {
        updateData.append('profileImage', profileImage)
      }

      // Update via API
      if (user?.employeeId) {
        await employeeAPI.update(user.employeeId, updateData)
      }

      // Update local context
      updateUser({
        ...user,
        ...formData,
        profileImage: imagePreview
      })

      alert('Profile updated successfully!')
      setEditMode(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }

    try {
      // Call password change API
      await employeeAPI.changePassword(user?.employeeId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      alert('Password changed successfully!')
      setShowPasswordForm(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Failed to change password:', error)
      alert('Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await employeeAPI.delete(user?.employeeId)
        alert('Account deleted successfully!')
        // Logout and redirect
        navigate('/login')
      } catch (error) {
        console.error('Failed to delete account:', error)
        alert('Failed to delete account')
      }
    }
  }

  const downloadProfile = () => {
    const profileData = {
      ...formData,
      profileImage: imagePreview
    }
    
    const dataStr = JSON.stringify(profileData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `profile_${formData.employeeId}_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h3 className='text-2xl font-bold text-gray-800'>My Profile</h3>
            <p className='text-gray-600'>Manage your personal information and account settings</p>
          </div>
          <div className='flex space-x-3'>
            <button 
              onClick={() => navigate('/employee-dashboard')}
              className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Back to Dashboard
            </button>
            <button 
              onClick={downloadProfile}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
            >
              <FaDownload className='mr-2' />
              Download Profile
            </button>
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)}
                className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
              >
                <FaEdit className='mr-2' />
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => setEditMode(false)}
                className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
              >
                <FaTimes className='mr-2' />
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Image Section */}
          <div className='lg:col-span-1'>
            <div className='bg-gray-50 rounded-lg p-6'>
              <div className='text-center'>
                <div className='relative inline-block'>
                  <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 bg-gray-200 mx-auto mb-4'>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <FaUser className='text-gray-400 text-4xl' />
                      </div>
                    )}
                  </div>
                  {editMode && (
                    <label className='absolute bottom-4 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer hover:bg-teal-600 transition-colors'>
                      <FaCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <h4 className='text-lg font-semibold text-gray-800'>{formData.name}</h4>
                <p className='text-gray-600'>{formData.position}</p>
                <p className='text-sm text-gray-500 mt-1'>Employee ID: {formData.employeeId}</p>
                
                <div className='mt-4 space-y-2'>
                  <div className='flex items-center justify-center text-sm text-gray-600'>
                    <FaBuilding className='mr-2' />
                    {formData.department}
                  </div>
                  <div className='flex items-center justify-center text-sm text-gray-600'>
                    <FaCalendarAlt className='mr-2' />
                    Joined: {formData.joinDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-gray-50 rounded-lg p-6 mt-6'>
              <h5 className='font-semibold text-gray-800 mb-4'>Quick Actions</h5>
              <div className='space-y-3'>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className='w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center'
                >
                  <FaKey className='mr-3 text-gray-600' />
                  <span className='text-gray-700'>Change Password</span>
                </button>
                <button
                  onClick={downloadProfile}
                  className='w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center'
                >
                  <FaDownload className='mr-3 text-gray-600' />
                  <span className='text-gray-700'>Download Data</span>
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className='w-full text-left px-4 py-3 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center text-red-600'
                >
                  <FaTrash className='mr-3' />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className='lg:col-span-2'>
            <form onSubmit={handleSubmit}>
              <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                <h5 className='font-semibold text-gray-800 mb-4'>Personal Information</h5>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
                    <input
                      type='tel'
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Emergency Contact</label>
                    <input
                      type='tel'
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      rows='2'
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                <h5 className='font-semibold text-gray-800 mb-4'>Professional Information</h5>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Employee ID</label>
                    <input
                      type='text'
                      value={formData.employeeId}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100'
                      disabled
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    >
                      <option value='IT'>IT</option>
                      <option value='HR'>HR</option>
                      <option value='Finance'>Finance</option>
                      <option value='Marketing'>Marketing</option>
                      <option value='Operations'>Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Position</label>
                    <input
                      type='text'
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Join Date</label>
                    <input
                      type='date'
                      value={formData.joinDate}
                      onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 rounded-lg p-6 mb-6'>
                <h5 className='font-semibold text-gray-800 mb-4'>Additional Information</h5>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    >
                      <option value='A+'>A+</option>
                      <option value='A-'>A-</option>
                      <option value='B+'>B+</option>
                      <option value='B-'>B-</option>
                      <option value='O+'>O+</option>
                      <option value='O-'>O-</option>
                      <option value='AB+'>AB+</option>
                      <option value='AB-'>AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    >
                      <option value='Single'>Single</option>
                      <option value='Married'>Married</option>
                      <option value='Divorced'>Divorced</option>
                      <option value='Widowed'>Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Nationality</label>
                    <input
                      type='text'
                      value={formData.nationality}
                      onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>

              {editMode && (
                <div className='flex justify-end space-x-3'>
                  <button
                    type='button'
                    onClick={() => setEditMode(false)}
                    className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={saving}
                    className='px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center'
                  >
                    <FaSave className='mr-2' />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4'>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
                    <input
                      type='password'
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
                    <input
                      type='password'
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
                    <input
                      type='password'
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
                      required
                    />
                  </div>
                </div>
                <div className='flex justify-end space-x-3 mt-6'>
                  <button
                    type='button'
                    onClick={() => setShowPasswordForm(false)}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700'
                  >
                    Change Password
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

export default Profile
