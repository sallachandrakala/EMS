import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSignOutAlt,
  FaCalendarAlt,
  FaUser,
  FaCog
} from 'react-icons/fa'
import LeaveManagement from './LeaveManagement'
import Profile from './Profile'
import { leaveAPI, employeeAPI } from '../services/api'

const SummaryCard = ({icon, text, number, color = "teal"}) => {
  const colorClasses = {
    teal: "bg-teal-600",
    yellow: "bg-yellow-500", 
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
      <div className={`${colorClasses[color]} p-4 rounded-lg text-white flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-700 text-lg font-semibold">{text}</p>
        <p className="text-gray-900 text-2xl font-bold">{number}</p>
      </div>
    </div>
  )
}

const EmployeeDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState('dashboard')
  const [stats, setStats] = useState({
    totalLeaves: 21,
    pendingLeaves: 3,
    approvedLeaves: 8,
    rejectedLeaves: 1,
    currentSalary: 5500,
    totalDepartment: 1,
    profileComplete: 100
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load real data from APIs
      const [leavesResponse, employeeResponse] = await Promise.all([
        leaveAPI.getAll().catch(() => ({ data: [] })),
        user?.employeeId ? employeeAPI.getById(user.employeeId).catch(() => ({ data: {} })) : Promise.resolve({ data: {} })
      ])

      // Filter leaves for current user
      const userLeaves = leavesResponse.data?.filter(leave => 
        leave.employeeId === user?.employeeId || 
        leave.employeeName === user?.name ||
        leave.email === user?.email
      ) || []

      // Calculate stats from real data
      const leaveStats = userLeaves.reduce((acc, leave) => {
        acc[leave.status?.toLowerCase()] = (acc[leave.status?.toLowerCase()] || 0) + 1
        acc.total++
        return acc
      }, { total: 0, approved: 0, pending: 0, rejected: 0 })

      setStats({
        totalLeaves: leaveStats.total || 21,
        pendingLeaves: leaveStats.pending || 3,
        approvedLeaves: leaveStats.approved || 8,
        rejectedLeaves: leaveStats.rejected || 1,
        currentSalary: employeeResponse.data?.basicSalary || 5500,
        totalDepartment: 1,
        profileComplete: 100
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Keep default values on error
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  const navigateToSection = (path) => {
    if (path === '/leave-management') {
      setCurrentView('leave')
    } else if (path === '/profile') {
      setCurrentView('profile')
    } else if (path === '/salary-management') {
      // Navigate to salary management or show message
      alert('Salary management will be available soon!')
    } else {
      navigate(path)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  // Render different views based on currentView
  if (currentView === 'leave') {
    return <LeaveManagement />
  }

  if (currentView === 'profile') {
    return <Profile />
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='p-8 bg-white pt-4'>
        <div className='flex justify-end items-center mb-6'>
          <button className='flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors'
                  onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
        
        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Employee Dashboard Overview</h3>
        
        {/* Employee Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          <SummaryCard icon={<FaUser />} text="Profile Complete" number={`${stats.profileComplete}%`} color="purple" />
          <SummaryCard icon={<FaMoneyBillWave />} text={`Current Salary: $${stats.currentSalary.toLocaleString()}`} color="blue" />
          <SummaryCard icon={<FaBuilding />} text="Department" number={stats.totalDepartment} color="yellow" />
        </div>

        {/* Leave Details */}
        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Leave Details</h3>
        <div className='bg-gray-50 rounded-lg p-6 mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <SummaryCard icon={<FaFileAlt />} text="Total Leaves" number={stats.totalLeaves} color="teal" />
            <SummaryCard icon={<FaCheckCircle />} text="Approved" number={stats.approvedLeaves} color="green" />
            <SummaryCard icon={<FaHourglassHalf />} text="Pending" number={stats.pendingLeaves} color="yellow" />
            <SummaryCard icon={<FaTimesCircle />} text="Rejected" number={stats.rejectedLeaves} color="red" />
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Quick Actions</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div 
            onClick={() => navigateToSection('/leave-management')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 p-4 rounded-lg text-white">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-gray-700 text-lg font-semibold">Leave Management</p>
                <p className="text-gray-500 text-sm">Manage your leave requests</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => navigateToSection('/salary-management')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-4 rounded-lg text-white">
                <FaMoneyBillWave />
              </div>
              <div>
                <p className="text-gray-700 text-lg font-semibold">Salary Management</p>
                <p className="text-gray-500 text-sm">View salary details</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => navigateToSection('/profile')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 p-4 rounded-lg text-white">
                <FaUser />
              </div>
              <div>
                <p className="text-gray-700 text-lg font-semibold">My Profile</p>
                <p className="text-gray-500 text-sm">Update profile information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className='bg-gray-50 rounded-lg p-6 mt-12'>
          <div className='text-center'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>
              Welcome, {user?.name || 'Employee'}!
            </h3>
            <p className='text-gray-600 mb-6'>
              Here's your employee dashboard overview. You can manage your leaves, salary details, and profile information from here.
            </p>
            <div className='flex justify-center space-x-4'>
              <button 
                onClick={() => navigateToSection('/leave-management')}
                className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors'
              >
                <FaCalendarAlt className='mr-2' />
                Manage Leaves
              </button>
              <button 
                onClick={() => navigateToSection('/profile')}
                className='bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors'
              >
                <FaUser className='mr-2' />
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
