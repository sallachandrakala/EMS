import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    totalNetSalary: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    averageSalary: 0,
    salaryByDepartment: {},
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
    
    // Listen for salary data updates
    const handleSalaryUpdate = () => {
      console.log('📊 Dashboard received salary update notification')
      loadDashboardStats()
    }
    
    const handleNewSalaryRequest = () => {
      console.log('📊 Dashboard received new salary request notification')
      loadDashboardStats()
    }
    
    const handleClearAllData = () => {
      console.log('🗑️ Dashboard received clear all data notification')
      setStats({
        totalEmployees: 0,
        totalDepartments: 0,
        totalSalary: 0,
        leaveApplied: 0,
        leaveApproved: 0,
        leavePending: 0,
        leaveRejected: 0
      })
      loadDashboardStats()
    }
    
    // Listen for leave data updates
    const handleLeaveUpdate = () => {
      console.log('📊 Dashboard received leave update notification')
      loadDashboardStats()
    }
    
    const handleNewLeaveRequest = () => {
      console.log('📊 Dashboard received new leave request notification')
      loadDashboardStats()
    }
    
    window.addEventListener('salaryDataUpdated', handleSalaryUpdate)
    window.addEventListener('newSalaryRequest', handleNewSalaryRequest)
    window.addEventListener('clearAllSalaryData', handleClearAllData)
    window.addEventListener('leaveDataUpdated', handleLeaveUpdate)
    window.addEventListener('newLeaveRequest', handleNewLeaveRequest)
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('salaryDataUpdated', handleSalaryUpdate)
      window.removeEventListener('newSalaryRequest', handleNewSalaryRequest)
      window.removeEventListener('clearAllSalaryData', handleClearAllData)
      window.removeEventListener('leaveDataUpdated', handleLeaveUpdate)
      window.removeEventListener('newLeaveRequest', handleNewLeaveRequest)
    }
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)

      console.log('=== LOADING DASHBOARD STATS FROM SERVER ===')

      let employees = []
      let departments = []
      let salaries = []
      let leaves = []

      // Load employees from server
      try {
        employees = await employeeAPI.getAll()
        console.log('✅ Loaded employees from server:', employees.length)
      } catch (error) {
        console.error('❌ Failed to load employees from server:', error)
        employees = []
      }

      // Load departments from server
      try {
        departments = await departmentAPI.getAll()
        console.log('✅ Loaded departments from server:', departments.length)
      } catch (error) {
        console.error('❌ Failed to load departments from server:', error)
        departments = []
      }

      // Load salaries from server
      try {
        salaries = await salaryAPI.getAll()
        console.log('✅ Loaded salaries from server:', salaries.length)
      } catch (error) {
        console.error('❌ Failed to load salaries from server:', error)
        salaries = []
      }

      // Load leaves from server
      try {
        leaves = await leaveAPI.getAll()
        console.log('✅ Loaded leaves from server:', leaves.length)
      } catch (error) {
        console.error('❌ Failed to load leaves from server:', error)
        leaves = []
      }

      // Calculate statistics from server data
      const totalSalary = salaries.reduce((sum, salary) => {
        const basicSalary = parseFloat(salary.basicSalary) || 0
        return sum + basicSalary
      }, 0)

      const totalNetSalary = salaries.reduce((sum, salary) => {
        const netSalary = parseFloat(salary.netSalary) || parseFloat(salary.basicSalary) || 0
        return sum + netSalary
      }, 0)

      const totalAllowances = salaries.reduce((sum, salary) => {
        const allowances = parseFloat(salary.allowances) || 0
        return sum + allowances
      }, 0)

      const totalDeductions = salaries.reduce((sum, salary) => {
        const deductions = parseFloat(salary.deductions) || 0
        return sum + deductions
      }, 0)

      const averageSalary = salaries.length > 0 ? totalSalary / salaries.length : 0

      // Salary by department
      const salaryByDepartment = salaries.reduce((acc, salary) => {
        const dept = salary.department || 'Unknown'
        if (!acc[dept]) {
          acc[dept] = { count: 0, total: 0, average: 0 }
        }
        acc[dept].count++
        acc[dept].total += parseFloat(salary.basicSalary) || 0
        acc[dept].average = acc[dept].total / acc[dept].count
        return acc
      }, {})

      console.log('=== MONTHLY SALARY ANALYSIS ===')
      console.log('💰 Total Basic Salary: $' + totalSalary.toLocaleString())
      console.log('💰 Total Net Salary: $' + totalNetSalary.toLocaleString())
      console.log('🎁 Total Allowances: $' + totalAllowances.toLocaleString())
      console.log('💸 Total Deductions: $' + totalDeductions.toLocaleString())
      console.log('📊 Average Salary: $' + averageSalary.toLocaleString())
      console.log('📁 Salary by Department:', salaryByDepartment)
      console.log('Based on', salaries.length, 'salary records from server')

      const leaveStats = leaves.reduce((acc, leave) => {
        const status = (leave.status || '').toLowerCase()
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {})

      setStats({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        totalSalary: totalSalary,
        totalNetSalary: totalNetSalary,
        totalAllowances: totalAllowances,
        totalDeductions: totalDeductions,
        averageSalary: averageSalary,
        salaryByDepartment: salaryByDepartment,
        leaveApplied: leaves.length,
        leaveApproved: leaveStats.approved || 0,
        leavePending: leaveStats.pending || 0,
        leaveRejected: leaveStats.rejected || 0
      })

      console.log('✅ Dashboard stats loaded from server:', {
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        totalSalary: totalSalary,
        salariesCount: salaries.length,
        leavesCount: leaves.length
      })
    } catch (error) {
      console.error('❌ Failed to load dashboard stats:', error)
      setStats({
        totalEmployees: 0,
        totalDepartments: 0,
        totalSalary: 0,
        totalNetSalary: 0,
        totalAllowances: 0,
        totalDeductions: 0,
        averageSalary: 0,
        salaryByDepartment: {},
        leaveApplied: 0,
        leaveApproved: 0,
        leavePending: 0,
        leaveRejected: 0
      })
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
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h3>
          <div className='flex items-center space-x-3'>
            <button 
              onClick={loadDashboardStats}
              className='flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors'
              disabled={loading}
            >
              <FaMoneyBillWave className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button 
              className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          <SummaryCard icon={<FaUsers />} text="Total Employees" number={stats.totalEmployees} color="teal" />
          <SummaryCard icon={<FaBuilding />} text="Total Departments" number={stats.totalDepartments} color="yellow" />
          <div 
            onClick={() => navigate('/admin-dashboard/salary')}
            className='bg-red-50 border-2 border-red-200 rounded-lg p-6 cursor-pointer hover:bg-red-100 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center'>
                  <FaMoneyBillWave className='text-white text-xl' />
                </div>
                <div>
                  <p className='text-sm text-gray-600 font-medium'>Monthly Salary</p>
                  <p className='text-2xl font-bold text-red-600'>${stats.totalSalary.toLocaleString()}</p>
                </div>
              </div>
              <div className='text-red-500'>
                <FaMoneyBillWave className='text-xl' />
              </div>
            </div>
            <p className='text-xs text-red-600 mt-3 text-center'>Click to manage salaries</p>
          </div>
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
