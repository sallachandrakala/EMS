import React, { useState, useEffect } from 'react'
import { FaUser, FaLock, FaBell, FaDatabase, FaSignOutAlt, FaSave, FaEye, FaTrash, FaDownload, FaExclamationTriangle } from 'react-icons/fa'
import { settingsAPI } from '../../services/api.js'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications')
  const [settings, setSettings] = useState({
    emailNotifications: true,
    leaveRequests: true,
    salaryUpdates: false,
    databaseBackup: false,
    systemLogs: false,
    clearCache: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      console.log('Loading settings from API...')
      const settingsData = await settingsAPI.getAll()
      console.log('Settings loaded successfully:', settingsData)
      setSettings(settingsData)
    } catch (error) {
      console.error('Failed to load settings:', error)
      // Keep default settings if API fails
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    try {
      console.log('Saving settings:', settings)
      const updatedSettings = await settingsAPI.update(settings)
      console.log('Settings saved successfully:', updatedSettings)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings. Please try again.')
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login page
      window.location.href = '/login'
    }
  }

  const handleBackup = () => {
    console.log('Starting database backup...')
    alert('Database backup initiated!')
  }

  const handleViewLogs = () => {
    console.log('Viewing system logs...')
    alert('System logs opened!')
  }

  const handleClearCache = () => {
    console.log('Clearing cache...')
    alert('Cache cleared successfully!')
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='p-8 bg-white pt-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Settings</h1>
            <p className='text-gray-600 mt-1'>Manage your system preferences and configurations</p>
          </div>
          <button 
            onClick={handleLogout}
            className='flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* Settings Navigation */}
        <div className='flex space-x-1 mb-8 border-b border-gray-200'>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaBell className='inline mr-2' />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'system'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaDatabase className='inline mr-2' />
            System Settings
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaLock className='inline mr-2' />
            Security
          </button>
        </div>

        {/* Settings Content */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <FaBell className='mr-3 text-teal-600' />
                Notification Settings
              </h2>
              
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Email Notifications</h3>
                  <div className='space-y-3'>
                    <label className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition-colors cursor-pointer'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          className='mr-3 w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        />
                        <div>
                          <span className='font-medium text-gray-700'>Email Notifications</span>
                          <p className='text-sm text-gray-500'>Receive email alerts for system events</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${settings.emailNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>

                    <label className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition-colors cursor-pointer'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          className='mr-3 w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                          checked={settings.leaveRequests}
                          onChange={(e) => handleSettingChange('leaveRequests', e.target.checked)}
                        />
                        <div>
                          <span className='font-medium text-gray-700'>Leave Requests</span>
                          <p className='text-sm text-gray-500'>Get notified when employees request leave</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${settings.leaveRequests ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {settings.leaveRequests ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>

                    <label className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition-colors cursor-pointer'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          className='mr-3 w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                          checked={settings.salaryUpdates}
                          onChange={(e) => handleSettingChange('salaryUpdates', e.target.checked)}
                        />
                        <div>
                          <span className='font-medium text-gray-700'>Salary Updates</span>
                          <p className='text-sm text-gray-500'>Notifications for salary changes and updates</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${settings.salaryUpdates ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {settings.salaryUpdates ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <FaDatabase className='mr-3 text-teal-600' />
                System Settings
              </h2>
              
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Database Management</h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                      <div className='flex items-center'>
                        <FaDownload className='mr-3 text-blue-500' />
                        <div>
                          <span className='font-medium text-gray-700'>Database Backup</span>
                          <p className='text-sm text-gray-500'>Create a backup of your database</p>
                        </div>
                      </div>
                      <button
                        onClick={handleBackup}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                      >
                        <FaSave className='mr-2' />
                        Backup Now
                      </button>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                      <div className='flex items-center'>
                        <FaEye className='mr-3 text-gray-500' />
                        <div>
                          <span className='font-medium text-gray-700'>System Logs</span>
                          <p className='text-sm text-gray-500'>View system activity and error logs</p>
                        </div>
                      </div>
                      <button
                        onClick={handleViewLogs}
                        className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                      >
                        <FaEye className='mr-2' />
                        View Logs
                      </button>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                      <div className='flex items-center'>
                        <FaTrash className='mr-3 text-orange-500' />
                        <div>
                          <span className='font-medium text-gray-700'>Clear Cache</span>
                          <p className='text-sm text-gray-500'>Clear system cache and temporary files</p>
                        </div>
                      </div>
                      <button
                        onClick={handleClearCache}
                        className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'
                      >
                        <FaTrash className='mr-2' />
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                <FaLock className='mr-3 text-teal-600' />
                Security Settings
              </h2>
              
              <div className='space-y-6'>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-800 mb-4'>Password Management</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
                      <input type='password' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
                      <input type='password' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
                      <input type='password' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' />
                    </div>
                    <button className='bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Settings Button */}
          <div className='mt-8 flex justify-end'>
            <button
              onClick={handleSaveSettings}
              className='bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center'
            >
              <FaSave className='mr-2' />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
