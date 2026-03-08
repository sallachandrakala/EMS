import React from 'react'
import SummaryCard from './SummaryCard'
import { FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa'

const Leave = () => {
  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white'>
        <div className='flex justify-end items-center mb-8'>
          <button className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'>
          <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={5} color="teal" />
          <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={2} color="green" />
          <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={4} color="yellow" />
          <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={1} color="red" />
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h4 className='text-xl font-bold text-gray-800 mb-4'>Leave Requests</h4>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='pb-3 text-gray-700 font-semibold'>Employee</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Leave Type</th>
                  <th className='pb-3 text-gray-700 font-semibold'>From</th>
                  <th className='pb-3 text-gray-700 font-semibold'>To</th>
                  <th className='pb-3 text-gray-700 font-semibold'>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-800 font-medium'>John Doe</td>
                  <td className='py-3 text-gray-600'>Sick Leave</td>
                  <td className='py-3 text-gray-600'>2024-01-15</td>
                  <td className='py-3 text-gray-600'>2024-01-16</td>
                  <td className='py-3'><span className='bg-green-100 text-green-800 px-2 py-1 rounded text-sm'>Approved</span></td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-800 font-medium'>Jane Smith</td>
                  <td className='py-3 text-gray-600'>Annual Leave</td>
                  <td className='py-3 text-gray-600'>2024-01-20</td>
                  <td className='py-3 text-gray-600'>2024-01-25</td>
                  <td className='py-3'><span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm'>Pending</span></td>
                </tr>
                <tr className='border-b border-gray-100'>
                  <td className='py-3 text-gray-800 font-medium'>Mike Johnson</td>
                  <td className='py-3 text-gray-600'>Personal Leave</td>
                  <td className='py-3 text-gray-600'>2024-01-10</td>
                  <td className='py-3 text-gray-600'>2024-01-11</td>
                  <td className='py-3'><span className='bg-red-100 text-red-800 px-2 py-1 rounded text-sm'>Rejected</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leave
