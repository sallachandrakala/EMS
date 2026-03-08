import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'

const Employee = () => {
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
          <h4 className='text-xl font-bold text-gray-800 mb-4'>Employee List</h4>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='pb-3 text-gray-700 font-semibold'>ID</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Name</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Department</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-600'>001</td>
                  <td className='py-3 text-gray-800 font-medium'>John Doe</td>
                  <td className='py-3 text-gray-600'>IT</td>
                  <td className='py-3'><span className='bg-green-100 text-green-800 px-2 py-1 rounded text-sm'>Active</span></td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-600'>002</td>
                  <td className='py-3 text-gray-800 font-medium'>Jane Smith</td>
                  <td className='py-3 text-gray-600'>HR</td>
                  <td className='py-3'><span className='bg-green-100 text-green-800 px-2 py-1 rounded text-sm'>Active</span></td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-600'>003</td>
                  <td className='py-3 text-gray-800 font-medium'>Mike Johnson</td>
                  <td className='py-3 text-gray-600'>Finance</td>
                  <td className='py-3'><span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm'>On Leave</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Employee
