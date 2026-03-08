import React from 'react'
import { FaBuilding, FaSignOutAlt } from 'react-icons/fa'

const Department = () => {
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
          <h4 className='text-xl font-bold text-gray-800 mb-4'>Department List</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center space-x-3 mb-2'>
                <FaBuilding className='text-teal-600 text-xl' />
                <h5 className='font-semibold text-gray-800'>Information Technology</h5>
              </div>
              <p className='text-gray-600 text-sm mb-2'>Head: John Smith</p>
              <p className='text-gray-800 font-medium'>Employees: 4</p>
            </div>
            <div className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center space-x-3 mb-2'>
                <FaBuilding className='text-teal-600 text-xl' />
                <h5 className='font-semibold text-gray-800'>Human Resources</h5>
              </div>
              <p className='text-gray-600 text-sm mb-2'>Head: Sarah Johnson</p>
              <p className='text-gray-800 font-medium'>Employees: 3</p>
            </div>
            <div className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center space-x-3 mb-2'>
                <FaBuilding className='text-teal-600 text-xl' />
                <h5 className='font-semibold text-gray-800'>Finance</h5>
              </div>
              <p className='text-gray-600 text-sm mb-2'>Head: Mike Wilson</p>
              <p className='text-gray-800 font-medium'>Employees: 3</p>
            </div>
            <div className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center space-x-3 mb-2'>
                <FaBuilding className='text-teal-600 text-xl' />
                <h5 className='font-semibold text-gray-800'>Marketing</h5>
              </div>
              <p className='text-gray-600 text-sm mb-2'>Head: Emily Davis</p>
              <p className='text-gray-800 font-medium'>Employees: 2</p>
            </div>
            <div className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center space-x-3 mb-2'>
                <FaBuilding className='text-teal-600 text-xl' />
                <h5 className='font-semibold text-gray-800'>Operations</h5>
              </div>
              <p className='text-gray-600 text-sm mb-2'>Head: Robert Brown</p>
              <p className='text-gray-800 font-medium'>Employees: 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Department
