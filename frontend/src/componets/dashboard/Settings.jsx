import React from 'react'
import { FaUser, FaLock, FaBell, FaDatabase, FaSignOutAlt } from 'react-icons/fa'

const Settings = () => {
  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        <div className='flex justify-end items-center'>
          <button className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h4 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
              <FaUser className='mr-2 text-teal-600' />
              Profile Settings
            </h4>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Admin Name</label>
                <input type='text' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' defaultValue='Admin User' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input type='email' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' defaultValue='admin@ems.com' />
              </div>
              <button className='bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
                Update Profile
              </button>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h4 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
              <FaLock className='mr-2 text-teal-600' />
              Security Settings
            </h4>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
                <input type='password' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
                <input type='password' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' />
              </div>
              <button className='bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
                Change Password
              </button>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h4 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
              <FaBell className='mr-2 text-teal-600' />
              Notification Settings
            </h4>
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2 text-teal-600 focus:ring-teal-500' defaultChecked />
                <span className='text-gray-700'>Email Notifications</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2 text-teal-600 focus:ring-teal-500' defaultChecked />
                <span className='text-gray-700'>Leave Requests</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2 text-teal-600 focus:ring-teal-500' />
                <span className='text-gray-700'>Salary Updates</span>
              </label>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <h4 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
              <FaDatabase className='mr-2 text-teal-600' />
              System Settings
            </h4>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700'>Database Backup</span>
                <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors'>
                  Backup Now
                </button>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700'>System Logs</span>
                <button className='bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors'>
                  View Logs
                </button>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700'>Clear Cache</span>
                <button className='bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors'>
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
