import React from 'react'
import SummaryCard from './SummaryCard'
import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSignOutAlt,
} from 'react-icons/fa'

const AdminSummary = () => {
  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        <div className='flex justify-end items-center'>
          <button className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Dashboard Overview</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          <SummaryCard icon={<FaUsers />} text="Total Employees" number={13} color="teal" />
          <SummaryCard icon={<FaBuilding />} text="Total Departments" number={5} color="yellow" />
          <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number="$654" color="red" />
        </div>

        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Leave Details</h3>
        <div className='bg-gray-50 rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={5} color="teal" />
            <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={2} color="green" />
            <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={4} color="yellow" />
            <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={1} color="red" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSummary