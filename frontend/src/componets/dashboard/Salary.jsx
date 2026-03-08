import React from 'react'
import SummaryCard from './SummaryCard'
import { FaMoneyBillWave, FaUsers, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa'

const Salary = () => {
  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white'>
        <div className='flex justify-end items-center mb-8'>
          <button className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number="$654" color="teal" />
          <SummaryCard icon={<FaUsers />} text="Total Employees" number={13} color="blue" />
          <SummaryCard icon={<FaCalendarAlt />} text="This Month" number="January" color="green" />
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h4 className='text-xl font-bold text-gray-800 mb-4'>Salary Details</h4>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='pb-3 text-gray-700 font-semibold'>Employee</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Department</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Basic Salary</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Allowances</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Total Salary</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-800 font-medium'>John Doe</td>
                  <td className='py-3 text-gray-600'>IT</td>
                  <td className='py-3 text-gray-800'>$4000</td>
                  <td className='py-3 text-gray-800'>$500</td>
                  <td className='py-3 text-gray-800 font-semibold'>$4500</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-800 font-medium'>Jane Smith</td>
                  <td className='py-3 text-gray-600'>HR</td>
                  <td className='py-3 text-gray-800'>$3500</td>
                  <td className='py-3 text-gray-800'>$400</td>
                  <td className='py-3 text-gray-800 font-semibold'>$3900</td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-800 font-medium'>Mike Johnson</td>
                  <td className='py-3 text-gray-600'>Finance</td>
                  <td className='py-3 text-gray-800'>$4500</td>
                  <td className='py-3 text-gray-800'>$600</td>
                  <td className='py-3 text-gray-800 font-semibold'>$5100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Salary
