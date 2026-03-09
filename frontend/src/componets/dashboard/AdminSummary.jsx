import React, { useState, useEffect } from 'react'
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
import { employeeAPI, departmentAPI, salaryAPI, leaveAPI } from '../../services/api'

const AdminSummary = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Load data from APIs
      const [employees, departments, salaries, leaves] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        salaryAPI.getAll(),
        leaveAPI.getAll()
      ])

      // Calculate statistics
      const totalSalary = salaries.reduce((sum, salary) => sum + (salary.basicSalary || 0), 0)
      const leaveStats = leaves.reduce((acc, leave) => {
        acc[leave.status.toLowerCase()] = (acc[leave.status.toLowerCase()] || 0) + 1
        return acc
      }, {})

      setStats({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        totalSalary: totalSalary,
        leaveApplied: leaves.length,
        leaveApproved: leaveStats.approved || 0,
        leavePending: leaveStats.pending || 0,
        leaveRejected: leaveStats.rejected || 0
      })
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        <div className='flex justify-end items-center'>
          <button className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
            onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Dashboard Overview</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          <SummaryCard icon={<FaUsers />} text="Total Employees" number={stats.totalEmployees} color="teal" />
          <SummaryCard icon={<FaBuilding />} text="Total Departments" number={stats.totalDepartments} color="yellow" />
          <SummaryCard icon={<FaMoneyBillWave />} text={`Monthly Salary: $${stats.totalSalary.toLocaleString()}`} color="red" />
        </div>

        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Leave Details</h3>
        <div className='bg-gray-50 rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={stats.leaveApplied} color="teal" />
            <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={stats.leaveApproved} color="green" />
            <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={stats.leavePending} color="yellow" />
            <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={stats.leaveRejected} color="red" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSummary