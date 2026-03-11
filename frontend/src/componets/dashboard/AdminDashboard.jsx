// AdminDashboard.jsx - Last updated: 2026-03-10 23:45:53
import { 
  FaUser, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaCog, 
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaBuilding,
  FaFileAlt,
  FaChartBar,
  FaBell,
  FaCamera,
  FaUpload,
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaUserShield,
  FaCheck
} from 'react-icons/fa'
import { employeeAPI, salaryAPI, leaveAPI, departmentAPI, salaryRequestAPI } from '../../services/api.js'
import { getAllSalaryRequests, updateSalaryRequestStatus, getEmployeeSalaryRecords, updateSalaryRecord, deleteSalaryRecord, getAllSalaryRecords, employeeData, getAllLeaveRequests } from '../../data/employeeData'

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [salaries, setSalaries] = useState([])
  const [allSalaries, setAllSalaries] = useState([])
  const [leaves, setLeaves] = useState([])
  const [salaryRequests, setSalaryRequests] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    employeeId: '',
    department: '',
    phone: '',
    designation: '',
    dateOfBirth: '',
    address: ''
  })

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'users', label: 'User Management', icon: FaUserShield },
    { id: 'employees', label: 'Employees', icon: FaUsers },
    { id: 'departments', label: 'Departments', icon: FaBuilding },
    { id: 'salary', label: 'Salary', icon: FaMoneyBillWave },
    { id: 'leave', label: 'Leave', icon: FaCalendarAlt },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ]

  useEffect(() => {
    loadUserData()
    loadDashboardData()
  }, [])

  // Auto-refresh salary requests every 30 seconds from server
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log('=== AUTO-REFRESHING SALARY REQUESTS FROM SERVER ===')
      try {
        const [serverRequests, localRequests] = await Promise.all([
          salaryRequestAPI.getAll(),
          getAllSalaryRequests()
        ])
        
        // Normalize server data
        const normalizedServerRequests = serverRequests.map(req => ({
          ...req,
          id: req._id || req.id,
          status: req.status || 'Pending'
        }))
        
        console.log('Auto-refreshed server requests:', normalizedServerRequests.length)
        console.log('Auto-refreshed local requests:', localRequests.length)
        
        const combinedRequests = [...normalizedServerRequests, ...localRequests]
        setSalaryRequests(combinedRequests)
      } catch (error) {
        console.error('Error auto-refreshing from server, using local only:', error)
        const localRequests = getAllSalaryRequests()
        setSalaryRequests(localRequests)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserData(user)
  }

  const handleApproveRequest = async (requestId) => {
    console.log('Approving request:', requestId)
    if (window.confirm('Are you sure you want to approve this salary request?')) {
      try {
        console.log('=== APPROVING REQUEST ===')
        console.log('Step 1: Updating server API...')
        
        // Step 1: Update server API
        const updatedRequest = await salaryRequestAPI.update(requestId, { 
          status: 'Approved', 
          adminNotes: 'Approved by admin' 
        })
        console.log('Server update result:', updatedRequest)
        
        // Step 2: Update local data store
        console.log('Step 2: Updating local data store...')
        const localUpdate = updateSalaryRequestStatus(requestId, 'Approved', 'Approved by admin')
        console.log('Local update result:', localUpdate)
        
        if (updatedRequest || localUpdate) {
          // Step 3: Reload all data
          console.log('Step 3: Reloading all data...')
          const [serverRequests, localRequests] = await Promise.all([
            salaryRequestAPI.getAll(),
            getAllSalaryRequests()
          ])
          
          // Normalize server data
          const normalizedServerRequests = serverRequests.map(req => ({
            ...req,
            id: req._id || req.id,
            status: req.status || 'Pending'
          }))
          
          const combinedRequests = [...normalizedServerRequests, ...localRequests]
          setSalaryRequests(combinedRequests)
          
          // Step 4: Reload salary records
          const updatedSalaryRecords = await salaryAPI.getAll()
          setSalaries(updatedSalaryRecords)
          
          // Step 5: Also get local salary records
          const localSalaryRecords = getAllSalaryRecords()
          const allCombinedSalaries = [...updatedSalaryRecords, ...localSalaryRecords]
          setAllSalaries(allCombinedSalaries)
          
          console.log('=== APPROVAL COMPLETE ===')
          console.log('Combined requests:', combinedRequests.length)
          console.log('Server salary records:', updatedSalaryRecords.length)
          console.log('Local salary records:', localSalaryRecords.length)
          console.log('All combined salaries:', allCombinedSalaries.length)
          
          alert('Salary request approved successfully! Data stored in both server and local data store.')
        } else {
          console.log('Failed to update request')
          alert('Failed to approve salary request!')
        }
      } catch (error) {
        console.error('Error approving request:', error)
        // Fallback to local only
        console.log('Falling back to local update only...')
        const localUpdate = updateSalaryRequestStatus(requestId, 'Approved', 'Approved by admin')
        if (localUpdate) {
          const updatedRequests = getAllSalaryRequests()
          setSalaryRequests(updatedRequests)
          alert('Salary request approved locally (server error occurred)!')
        }
      }
    }
  }

  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      try {
        console.log('=== REJECTING REQUEST ===')
        console.log('Step 1: Updating server API...')
        
        // Step 1: Update server API
        const updatedRequest = await salaryRequestAPI.update(requestId, { 
          status: 'Rejected', 
          adminNotes: reason 
        })
        console.log('Server update result:', updatedRequest)
        
        // Step 2: Update local data store
        console.log('Step 2: Updating local data store...')
        const localUpdate = updateSalaryRequestStatus(requestId, 'Rejected', reason)
        console.log('Local update result:', localUpdate)
        
        if (updatedRequest || localUpdate) {
          // Step 3: Reload all data
          console.log('Step 3: Reloading all data...')
          const [serverRequests, localRequests] = await Promise.all([
            salaryRequestAPI.getAll(),
            getAllSalaryRequests()
          ])
          
          // Normalize server data
          const normalizedServerRequests = serverRequests.map(req => ({
            ...req,
            id: req._id || req.id,
            status: req.status || 'Pending'
          }))
          
          const combinedRequests = [...normalizedServerRequests, ...localRequests]
          setSalaryRequests(combinedRequests)
          
          console.log('=== REJECTION COMPLETE ===')
          console.log('Combined requests:', combinedRequests.length)
          
          alert('Salary request rejected successfully! Data stored in both server and local data store.')
        } else {
          alert('Failed to reject salary request!')
        }
      } catch (error) {
        console.error('Error rejecting request:', error)
        // Fallback to local only
        console.log('Falling back to local update only...')
        const localUpdate = updateSalaryRequestStatus(requestId, 'Rejected', reason)
        if (localUpdate) {
          const updatedRequests = getAllSalaryRequests()
          setSalaryRequests(updatedRequests)
          alert('Salary request rejected locally (server error occurred)!')
        }
      }
    }
  }

  const handleEditSalary = (salary) => {
    console.log('Edit button clicked for salary:', salary)
    
    // For now, let's show the salary details and a simple edit form
    const newBasicSalary = prompt(`Edit salary for ${salary.employeeName}:`, salary.basicSalary)
    
    if (newBasicSalary !== null && newBasicSalary !== '') {
      const updatedSalaryData = {
        ...salary,
        basicSalary: parseFloat(newBasicSalary),
        netSalary: parseFloat(newBasicSalary) + parseFloat(salary.allowances || 0) - parseFloat(salary.deductions || 0)
      }
      
      // Update via API
      salaryAPI.update(salary.id || salary._id, updatedSalaryData).then(() => {
        // Update local state
        const updatedSalaries = salaries.map(s => 
          (s.id === salary.id || s._id === salary._id) ? updatedSalaryData : s
        )
        setSalaries(updatedSalaries)
        alert(`Salary record for ${salary.employeeName} updated successfully!`)
      }).catch(error => {
        console.error('Error updating salary:', error)
        alert('Failed to update salary record. Please try again.')
      })
    }
  }

  const handleDeleteSalary = async (salary, index) => {
    console.log('=== DELETE START ===')
    console.log('Salary data:', salary)
    console.log('Index:', index)
    console.log('Salary ID:', salary.id || salary._id)
    console.log('Salary ID length:', (salary.id || salary._id)?.length)
    console.log('Is MongoDB ObjectId format:', (salary.id || salary._id)?.length === 24 && /^[0-9a-fA-F]{24}$/.test(salary.id || salary._id))
    
    if (window.confirm(`Are you sure you want to delete salary record for ${salary.employeeName || salary.name}?`)) {
      try {
        const salaryId = salary.id || salary._id
        const isValidObjectId = salaryId?.length === 24 && /^[0-9a-fA-F]{24}$/.test(salaryId)
        
        let deletedSuccessfully = false
        
        if (isValidObjectId) {
          console.log('Valid MongoDB ObjectId, attempting server API deletion...')
          const apiDeleted = await salaryAPI.delete(salaryId)
          console.log('Server API deletion result:', apiDeleted)
          
          if (apiDeleted) {
            console.log('Successfully deleted from server API')
            deletedSuccessfully = true
          }
        }
        
        // Always try to delete from local data store as well
        console.log('Attempting local data store deletion...')
        const localDeleted = deleteSalaryRecord(salaryId)
        console.log('Local data store deletion result:', localDeleted)
        
        if (localDeleted) {
          deletedSuccessfully = true
        }
        
        if (deletedSuccessfully) {
          console.log('=== DELETE SUCCESSFUL - UPDATING STATES ===')
          
          // Update all relevant states
          
          // 1. Update salaries state
          const newSalaries = salaries.filter((s, i) => i !== index)
          console.log('Updating salaries state:', salaries.length, '->', newSalaries.length)
          setSalaries(newSalaries)
          
          // 2. Update allSalaries state (this is what's displayed in the table)
          const newAllSalaries = allSalaries.filter((s, i) => i !== index)
          console.log('Updating allSalaries state:', allSalaries.length, '->', newAllSalaries.length)
          setAllSalaries(newAllSalaries)
          
          // 3. Also update by ID filtering for safety
          const newAllSalariesById = allSalaries.filter(s => (s.id || s._id) !== salaryId)
          if (newAllSalariesById.length !== newAllSalaries.length) {
            console.log('Using ID-based filtering for additional safety')
            setAllSalaries(newAllSalariesById)
          }
          
          alert(`✅ Successfully deleted salary record for ${salary.employeeName || salary.name}`)
          
          console.log('=== DELETE COMPLETE ===')
          
          // Verify the deletion after a short delay
          setTimeout(() => {
            console.log('Post-delete verification:')
            console.log('salaries length:', salaries.length)
            console.log('allSalaries length:', allSalaries.length)
          }, 500)
          
        } else {
          console.log('=== DELETE FAILED ===')
          alert('❌ Failed to delete salary record. Please try again.')
        }
        
      } catch (error) {
        console.error('Delete error:', error)
        
        // Final fallback: just update local state
        console.log('API error, updating local state only...')
        const newAllSalaries = allSalaries.filter((s, i) => i !== index)
        setAllSalaries(newAllSalaries)
        
        setTimeout(() => {
          console.log('Fallback - After state update - allSalaries count:', allSalaries.length)
        }, 100)
        
        alert(`Salary record deleted locally (server error: ${error.message})`)
        
        console.log('=== DELETE FALLBACK SUCCESS ===')
      }
    } else {
      console.log('Delete cancelled by user')
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setProfileImage(reader.result)
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Please select an image file (JPG, PNG, etc.)')
      }
    }
  }

  // Listen for salary data updates from other components
  useEffect(() => {
    const handleSalaryDataUpdate = () => {
      console.log('🔄 Salary data update event received - refreshing admin dashboard data')
      loadDashboardData()
    }

    window.addEventListener('salaryDataUpdated', handleSalaryDataUpdate)
    
    // Also listen for new salary requests from employees
    window.addEventListener('newSalaryRequest', () => {
      console.log('📝 New salary request event received - refreshing admin dashboard data')
      loadDashboardData()
    })
    
    return () => {
      window.removeEventListener('salaryDataUpdated', handleSalaryDataUpdate)
      window.removeEventListener('newSalaryRequest', () => {
        console.log('📝 New salary request event received - refreshing admin dashboard data')
        loadDashboardData()
      })
    }
  }, [])

  // Auto-load local data on component mount
  useEffect(() => {
    console.log('=== AUTO-LOADING LOCAL EMPLOYEE DATA ===')
    console.log('employeeData available:', employeeData)
    console.log('employeeData length:', employeeData.length)
    
    // Load local data immediately as fallback - no conditions
    try {
      const localEmployees = employeeData
      console.log('Auto-loading local employees:', localEmployees.length)
      console.log('First employee:', localEmployees[0])
      
      // Force set employees regardless of current state
      setEmployees(localEmployees)
      console.log('✅ Successfully set employees from local data store')
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalEmployees: localEmployees.length
      }))
      
    } catch (error) {
      console.error('Error auto-loading local employees:', error)
      alert('❌ Error loading employee data. Check console for details.')
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log('=== LOADING DASHBOARD DATA FROM SERVER ===')
      console.log('Current user from localStorage:', JSON.parse(localStorage.getItem('user') || '{}'))
      
      const [employeesData, departmentsData, salariesData, leavesData, salaryRequestsData] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        salaryAPI.getAll(),
        leaveAPI.getAll(),
        salaryRequestAPI.getAll()
      ])

      console.log('=== SERVER DATA LOADED ===')
      console.log('Employees from server:', employeesData.length)
      console.log('Departments from server:', departmentsData.length)
      console.log('Salaries from server:', salariesData.length)
      console.log('Leaves from server:', leavesData.length)
      console.log('Salary requests from server:', salaryRequestsData.length)

      // Also get local data as backup
      const localSalaryRequests = getAllSalaryRequests()
      const localLeaveRequests = getAllLeaveRequests()
      
      console.log('=== LOCAL DATA LOADED ===')
      console.log('Local salary requests:', localSalaryRequests.length)
      console.log('Local leave requests:', localLeaveRequests.length)
      
      // Normalize server data to match frontend expected format
      const normalizedServerRequests = salaryRequestsData.map(req => ({
        ...req,
        id: req._id || req.id, // Use MongoDB _id as id if available
        status: req.status || 'Pending'
      }))
      
      console.log('=== DATA COMBINATION ===')
      console.log('Normalized server requests:', normalizedServerRequests.length)
      console.log('Local salary requests:', localSalaryRequests.length)
      console.log('Total combined requests:', normalizedServerRequests.length + localSalaryRequests.length)
      
      if (normalizedServerRequests.length > 0) {
        console.log('First server salary request:', normalizedServerRequests[0])
        console.log('Server request keys:', Object.keys(normalizedServerRequests[0]))
      } else {
        console.log('No salary requests found on server!')
      }
      
      // Get all salary records from data store (as backup)
      const allSalaryRecords = getAllSalaryRecords()

      console.log('=== DATA LOADED FROM SERVER ===')
      console.log('Employees:', employeesData.length)
      console.log('Departments:', departmentsData.length)
      console.log('Salaries from API:', salariesData.length)
      console.log('All salary records from data store:', allSalaryRecords.length)
      console.log('Leaves:', leavesData.length)
      console.log('Salary requests from server:', normalizedServerRequests.length)
      console.log('Salary requests from local:', localSalaryRequests.length)

      setEmployees(employeesData)
      setDepartments(departmentsData)
      // Use API data as primary source now that server is running
      setSalaries(salariesData)
      setLeaves(leavesData)
      
      // Use server data for salary requests, with local data as backup
      const combinedSalaryRequests = [...normalizedServerRequests, ...localSalaryRequests]
      setSalaryRequests(combinedSalaryRequests)
        
        if (matchingEmployee) {
          console.log(`Found matching employee for request ${request.id}:`, matchingEmployee.name)
          return {
            ...request,
            employeeName: matchingEmployee.name || request.employeeName,
            email: matchingEmployee.email || request.email,
            department: matchingEmployee.department || request.department,
            phone: matchingEmployee.phone || request.phone,
            designation: matchingEmployee.designation || request.designation,
            employeeEnriched: true
          }
        } else {
          console.log(`No matching employee found for request ${request.id} (employeeId: ${request.employeeId})`)
          return {
            ...request,
            employeeName: request.employeeName || `Employee ${request.employeeId}`,
            employeeEnriched: false
          }
        }
      })

      console.log('=== ENRICHMENT ANALYSIS ===')
      console.log('Original requests:', combinedSalaryRequests.length)
      console.log('Enriched requests:', enrichedSalaryRequests.length)
      console.log('Enriched with employee data:', enrichedSalaryRequests.filter(req => req.employeeEnriched).length)
      console.log('Not enriched:', enrichedSalaryRequests.filter(req => !req.employeeEnriched).length)

      setSalaryRequests(enrichedSalaryRequests)

      console.log('=== EMPLOYEE TO ADMIN CONNECTION ANALYSIS ===')
      console.log('Normalized server requests:', normalizedServerRequests.length)
      console.log('Local requests:', localSalaryRequests.length)
      console.log('Combined total:', combinedSalaryRequests.length)
      
      // Analyze employee data in requests
      const requestsWithEmployeeData = combinedSalaryRequests.filter(req => req.employeeName || req.employeeId)
      const requestsWithoutEmployeeData = combinedSalaryRequests.filter(req => !req.employeeName && !req.employeeId)
      
      console.log('Requests WITH employee data:', requestsWithEmployeeData.length)
      console.log('Requests WITHOUT employee data:', requestsWithoutEmployeeData.length)
      
      if (requestsWithoutEmployeeData.length > 0) {
        console.log('❌ EMPLOYEE DATA ISSUE DETECTED!')
        console.log('Requests missing employee data:', requestsWithoutEmployeeData.map(req => ({
          id: req.id,
          hasEmployeeName: !!req.employeeName,
          hasEmployeeId: !!req.employeeId,
          employeeName: req.employeeName,
          employeeId: req.employeeId,
          allKeys: Object.keys(req)
        })))
      }

      console.log('=== STATE UPDATED ===')
      console.log('Salaries state set:', salariesData.length, 'records')
      console.log('Salary requests state set:', combinedSalaryRequests.length, 'requests')
      
      // Combine API salaries with local data store for complete view
      const localSalaryRecords = getAllSalaryRecords()
      console.log('Local salary records from data store:', localSalaryRecords.length)
      
      // Create combined data for salary records section
      const combinedSalaries = [...salariesData, ...localSalaryRecords]
      console.log('Combined salaries for display:', combinedSalaries.length)
      
      // Store combined data for the salary records section
      setAllSalaries(combinedSalaries)
    } catch (error) {
      console.error('Error loading dashboard data from server:', error)
      // Fallback to local data only
      console.log('Falling back to local data only...')
      const localSalaryRequests = getAllSalaryRequests()
      setSalaryRequests(localSalaryRequests)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setImagePreview(null)
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      await employeeAPI.create(userForm)
      alert('User created successfully!')
      setShowAddUser(false)
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employeeId: '',
        department: '',
        phone: '',
        designation: '',
        dateOfBirth: '',
        address: ''
      })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user')
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      await employeeAPI.update(selectedUser._id, userForm)
      alert('User updated successfully!')
      setShowEditUser(false)
      setSelectedUser(null)
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        employeeId: '',
        department: '',
        phone: '',
        designation: '',
        dateOfBirth: '',
        address: ''
      })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await employeeAPI.delete(userId)
        alert('User deleted successfully!')
        loadDashboardData()
      } catch (error) {
        console.error('Failed to delete user:', error)
        alert('Failed to delete user')
      }
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
      phone: user.phone,
      designation: user.designation,
      dateOfBirth: user.dateOfBirth,
      address: user.address
    })
    setShowEditUser(true)
  }

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
            
            {/* Admin Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Total Employees</p>
                    <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                  </div>
                  <FaUsers className="text-3xl text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Salary</p>
                    <p className="text-2xl font-bold">${stats.totalSalary.toLocaleString()}</p>
                  </div>
                  <FaMoneyBillWave className="text-3xl text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Departments</p>
                    <p className="text-2xl font-bold">{stats.totalDepartments}</p>
                  </div>
                  <FaBuilding className="text-3xl text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pending Leaves</p>
                    <p className="text-2xl font-bold">{stats.pendingLeaves}</p>
                  </div>
                  <FaCalendarAlt className="text-3xl text-orange-200" />
                </div>
              </div>
            </div>

            {/* Leave Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingLeaves}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approvedLeaves}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejectedLeaves}</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">New user registered</span>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Leave request approved</span>
                  </div>
                  <span className="text-sm text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Salary records updated</span>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FaPlus />
                <span>Create User</span>
              </button>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
                  </div>
                  <FaUsers className="text-3xl text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Admin Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {employees.filter(emp => emp.role === 'admin').length}
                    </p>
                  </div>
                  <FaUserShield className="text-3xl text-red-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Employee Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {employees.filter(emp => emp.role === 'employee').length}
                    </p>
                  </div>
                  <FaUser className="text-3xl text-blue-600" />
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">All Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.employeeId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditUser(employee)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(employee._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found. Click "Create User" to add your first user.
                  </div>
                )}
              </div>
            </div>

            {/* Create User Modal */}
            {showAddUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h3>
                  <form onSubmit={handleCreateUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={userForm.name}
                          onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={userForm.email}
                          onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                        <select
                          required
                          value={userForm.role}
                          onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={userForm.employeeId}
                          onChange={(e) => setUserForm({...userForm, employeeId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={userForm.department}
                          onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                          type="text"
                          value={userForm.designation}
                          onChange={(e) => setUserForm({...userForm, designation: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={userForm.dateOfBirth}
                          onChange={(e) => setUserForm({...userForm, dateOfBirth: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={userForm.address}
                          onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddUser(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit User Modal */}
            {showEditUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h3>
                  <form onSubmit={handleUpdateUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={userForm.name}
                          onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={userForm.email}
                          onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                        <select
                          required
                          value={userForm.role}
                          onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                        <input
                          type="text"
                          value={userForm.employeeId}
                          onChange={(e) => setUserForm({...userForm, employeeId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={userForm.department}
                          onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                          type="text"
                          value={userForm.designation}
                          onChange={(e) => setUserForm({...userForm, designation: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={userForm.dateOfBirth}
                          onChange={(e) => setUserForm({...userForm, dateOfBirth: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={userForm.address}
                          onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditUser(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )

      case 'employees':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Employee Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">All Employees</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add Employee</span>
                  </button>
                  <button
                    onClick={() => {
                      console.log('=== LOADING EMPLOYEES FROM LOCAL DATA STORE ===')
                      
                      // Load from local data store as fallback
                      try {
                        const localEmployees = employeeData
                        console.log('Local employees loaded:', localEmployees.length)
                        setEmployees(localEmployees)
                        alert(`✅ Loaded ${localEmployees.length} employees from local data store!`)
                      } catch (error) {
                        console.error('Error loading local employees:', error)
                        alert('❌ Failed to load employees from local data store')
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaSearch />
                    <span>Load Local</span>
                  </button>
                  <button
                    onClick={() => {
                      console.log('=== TESTING EMPLOYEE API CONNECTION ===')
                      console.log('Server URL:', 'http://localhost:5000/api/employees')
                      console.log('Current employees state:', employees.length)
                      
                      // Test direct API call with timeout
                      const controller = new AbortController()
                      const timeoutId = setTimeout(() => controller.abort(), 5000)
                      
                      fetch('http://localhost:5000/api/employees', { signal: controller.signal })
                        .then(response => {
                          clearTimeout(timeoutId)
                          console.log('API Response status:', response.status)
                          if (!response.ok) throw new Error(`HTTP ${response.status}`)
                          return response.json()
                        })
                        .then(data => {
                          console.log('API Response data:', data)
                          console.log('Number of employees from API:', data.length)
                          setEmployees(data)
                          alert(`✅ Server Connection Working!\n\nAPI Response: ${data.length} employees found\n\nData loaded successfully!`)
                        })
                        .catch(error => {
                          clearTimeout(timeoutId)
                          console.error('API Connection Error:', error)
                          if (error.name === 'AbortError') {
                            alert('❌ Server Connection Timeout!\n\nServer not responding within 5 seconds.\n\nPlease check:\n1. Server is running (npm start in server folder)\n2. MongoDB is connected\n3. Port 5000 is available\n\nTry "Load Local" button for fallback.')
                          } else {
                            alert(`❌ Server Connection Failed!\n\nError: ${error.message}\n\nTry "Load Local" button for fallback data.`)
                          }
                        })
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaSearch />
                    <span>Test Server</span>
                  </button>
                </div>
              </div>
              
              {/* Debug Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-sm text-gray-600">
                  <strong>Debug Info:</strong><br/>
                  • Employees loaded: {employees.length}<br/>
                  • Server: http://localhost:5000<br/>
                  • API: /api/employees<br/>
                  • Last updated: {new Date().toLocaleTimeString()}<br/>
                  • Data Source: {employees.length > 0 ? 'Loaded' : 'Not loaded'}<br/>
                  • Connection: {employees.length > 0 ? 'Working' : 'Check connection'}
                </div>
                
                {/* Quick Debug Actions */}
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => {
                      console.log('=== EMPLOYEES STATE DEBUG ===')
                      console.log('Employees array:', employees)
                      console.log('Employees length:', employees.length)
                      console.log('First employee:', employees[0])
                      
                      if (employees.length === 0) {
                        console.log('❌ No employees found - try loading from local data store')
                        const localEmployees = employeeData
                        console.log('Local employees available:', localEmployees.length)
                      }
                    }}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Debug State
                  </button>
                  
                  <button
                    onClick={() => {
                      console.log('=== LOADING LOCAL FALLBACK ===')
                      const localEmployees = employeeData
                      setEmployees(localEmployees)
                      console.log('Loaded local employees:', localEmployees.length)
                    }}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Load Local
                  </button>
                </div>
              </div>
              
              {/* Employees Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaUser className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            employee.role === 'hr' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {employee.role || 'Employee'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(employee)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(employee.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'departments':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Department Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">All Departments</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddDepartment(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add Department</span>
                  </button>
                  <button
                    onClick={loadDashboardData}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaSearch />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
              
              {/* Departments Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((department) => (
                      <tr key={department.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <FaBuilding className="text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{department.name}</div>
                              <div className="text-sm text-gray-500">{department.description || 'No description'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employees.filter(emp => emp.department === department.name).length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {department.manager || 'Not assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditDepartment(department)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteDepartment(department.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'salary':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Salary Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Salary management interface will be loaded here...</p>
            </div>
          </div>
        )

      case 'leave':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Leave Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">All Leave Requests</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddLeave(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Add Leave</span>
                  </button>
                  <button
                    onClick={loadDashboardData}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <FaSearch />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
              
              {/* Leave Requests Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaves.map((leave) => (
                      <tr key={leave.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaCalendarAlt className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{leave.employeeName}</div>
                              <div className="text-sm text-gray-500">{leave.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            leave.type === 'Annual' ? 'bg-purple-100 text-purple-800' :
                            leave.type === 'Sick' ? 'bg-red-100 text-red-800' :
                            leave.type === 'Personal' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {leave.type || 'Leave'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.reason || 'No reason'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveLeave(leave.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectLeave(leave.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">System Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Email Notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">User Registration</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Auto Backup</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'salary':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Salary Management</h2>
              {salaryRequests.filter(req => req.status === 'Pending').length > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <FaMoneyBillWave className="text-xs" />
                  <span>{salaryRequests.filter(req => req.status === 'Pending').length} Pending</span>
                </div>
              )}
            </div>
            
            {/* Debug Access Control */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Access Control Debug</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>Current User: {userData?.name || 'Not loaded'}</p>
                <p>User Role: {userData?.role || 'Not loaded'}</p>
                <p>Salary Requests: {salaryRequests.length} total</p>
                <p>Pending Requests: {salaryRequests.filter(req => req.status === 'Pending').length}</p>
                <p>Approved Requests: {salaryRequests.filter(req => req.status === 'Approved').length}</p>
                <p>Rejected Requests: {salaryRequests.filter(req => req.status === 'Rejected').length}</p>
              </div>
              <div className="mt-3 space-x-2">
                <button
                  onClick={() => {
                    console.log('=== ACCESS CONTROL DEBUG ===')
                    console.log('User data:', userData)
                    console.log('All salary requests:', salaryRequests)
                    console.log('Pending requests:', salaryRequests.filter(req => req.status === 'Pending'))
                    console.log('Approved requests:', salaryRequests.filter(req => req.status === 'Approved'))
                    console.log('Rejected requests:', salaryRequests.filter(req => req.status === 'Rejected'))
                    
                    // Show detailed info about each request
                    salaryRequests.forEach((req, index) => {
                      console.log(`Request ${index + 1}:`, {
                        id: req.id,
                        employeeId: req.employeeId,
                        employeeName: req.employeeName,
                        status: req.status,
                        requestedDate: req.requestedDate,
                        effectiveDate: req.effectiveDate,
                        basicSalary: req.basicSalary
                      })
                    })
                    
                    alert(`Debug info logged to console. Total requests: ${salaryRequests.length}, Pending: ${salaryRequests.filter(req => req.status === 'Pending').length}`)
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Debug Access
                </button>
                <button
                  onClick={() => {
                    console.log('=== PENDING REQUESTS DEBUG ===')
                    const pendingRequests = salaryRequests.filter(req => req.status === 'Pending')
                    console.log('Total pending requests:', pendingRequests.length)
                    
                    if (pendingRequests.length === 0) {
                      console.log('❌ NO PENDING REQUESTS FOUND')
                      alert('❌ No pending requests found!\n\nTry clicking "🔗 Test Connection" to fetch data.')
                      return
                    }
                    
                    console.log('=== ANALYZING PENDING REQUESTS ===')
                    pendingRequests.forEach((req, index) => {
                      console.log(`\n--- Request ${index + 1} ---`)
                      console.log('ID:', req.id || req._id)
                      console.log('Employee Name:', req.employeeName || req.name || 'MISSING')
                      console.log('Employee ID:', req.employeeId || 'MISSING')
                      console.log('Email:', req.email || 'MISSING')
                      console.log('Department:', req.department || 'MISSING')
                      console.log('Basic Salary:', req.basicSalary || 'MISSING')
                      console.log('Net Salary:', req.netSalary || 'MISSING')
                      console.log('Status:', req.status || 'MISSING')
                      console.log('Requested Date:', req.requestedDate || 'MISSING')
                      console.log('Effective Date:', req.effectiveDate || 'MISSING')
                      console.log('All keys:', Object.keys(req))
                    })
                    
                    alert(`✅ Found ${pendingRequests.length} pending requests!\n\nCheck console for detailed employee data analysis.\n\nLook for any "MISSING" values - those indicate data problems.`)
                  }}
                  className="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                >
                  🔍 Debug Pending
                </button>
                <button
                  onClick={() => {
                    console.log('=== EMPLOYEE DATA ENRICHMENT TEST ===')
                    
                    // Test current state
                    const currentRequests = salaryRequests
                    console.log('Current requests in state:', currentRequests.length)
                    
                    // Count enriched vs non-enriched
                    const enrichedRequests = currentRequests.filter(req => req.employeeEnriched)
                    const nonEnrichedRequests = currentRequests.filter(req => !req.employeeEnriched)
                    
                    console.log('Enriched requests:', enrichedRequests.length)
                    console.log('Non-enriched requests:', nonEnrichedRequests.length)
                    
                    // Show sample data
                    if (currentRequests.length > 0) {
                      const sampleRequest = currentRequests[0]
                      console.log('Sample request data:', {
                        id: sampleRequest.id,
                        employeeName: sampleRequest.employeeName,
                        employeeId: sampleRequest.employeeId,
                        email: sampleRequest.email,
                        department: sampleRequest.department,
                        employeeEnriched: sampleRequest.employeeEnriched,
                        allKeys: Object.keys(sampleRequest)
                      })
                    }
                    
                    alert(`✅ Employee Data Enrichment Analysis:\n\nTotal Requests: ${currentRequests.length}\nEnriched: ${enrichedRequests.length}\nNon-Enriched: ${nonEnrichedRequests.length}\n\nCheck console for sample data!`)
                  }}
                  className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                >
                  🧪 Test Enrichment
                </button>
                <button
                  onClick={async () => {
                    console.log('=== TEST EMPLOYEE TO ADMIN CONNECTION ===')
                    try {
                      // Step 1: Check what's on server
                      console.log('Step 1: Checking server data...')
                      const serverData = await salaryRequestAPI.getAll()
                      console.log('Server data found:', serverData.length, 'requests')
                      
                      if (serverData.length > 0) {
                        console.log('First request on server:', serverData[0])
                      }
                      
                      // Step 2: Check what's in local store
                      console.log('Step 2: Checking local data...')
                      const localData = getAllSalaryRequests()
                      console.log('Local data found:', localData.length, 'requests')
                      
                      // Step 3: Normalize and combine
                      const normalizedServer = serverData.map(req => ({
                        ...req,
                        id: req._id || req.id,
                        status: req.status || 'Pending'
                      }))
                      
                      const combined = [...normalizedServer, ...localData]
                      console.log('Combined data:', combined.length, 'requests')
                      
                      // Step 4: Update state
                      setSalaryRequests(combined)
                      
                      // Step 5: Show results
                      const pendingCount = combined.filter(req => req.status === 'Pending').length
                      const approvedCount = combined.filter(req => req.status === 'Approved').length
                      const rejectedCount = combined.filter(req => req.status === 'Rejected').length
                      
                      alert(`✅ Connection Test Complete!\n\nServer: ${serverData.length} requests\nLocal: ${localData.length} requests\nCombined: ${combined.length} requests\n\nStatus Breakdown:\nPending: ${pendingCount}\nApproved: ${approvedCount}\nRejected: ${rejectedCount}\n\nCheck yellow debug section!`)
                      
                    } catch (error) {
                      console.error('Connection test failed:', error)
                      alert(`❌ Connection Failed: ${error.message}`)
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                >
                  🔗 Test Connection
                </button>
              </div>
            </div>
            
            {/* Debug: Show All Requests */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">All Salary Requests (Debug)</h4>
              <div className="text-xs text-yellow-700">
                <p><strong>Total requests:</strong> {salaryRequests.length}</p>
                <p><strong>Pending:</strong> {salaryRequests.filter(req => req.status === 'Pending').length}</p>
                <p><strong>Approved:</strong> {salaryRequests.filter(req => req.status === 'Approved').length}</p>
                <p><strong>Rejected:</strong> {salaryRequests.filter(req => req.status === 'Rejected').length}</p>
                
                <div className="mt-3 p-2 bg-yellow-100 rounded">
                  <p className="font-semibold mb-1">🔍 Data Source Analysis:</p>
                  <p className="text-xs">• Server requests have MongoDB _id</p>
                  <p className="text-xs">• Local requests have numeric id</p>
                  <p className="text-xs">• Check console for detailed logs</p>
                </div>
                
                <button
                  onClick={() => {
                    console.log('=== DETAILED REQUEST ANALYSIS ===')
                    console.log('Current salaryRequests state:', salaryRequests)
                    console.log('Type:', typeof salaryRequests)
                    console.log('Is array:', Array.isArray(salaryRequests))
                    
                    if (salaryRequests.length === 0) {
                      console.log('❌ NO REQUESTS FOUND - This is the problem!')
                      alert('❌ No requests found! Click "🔗 Test Connection" to fetch data.')
                    } else {
                      console.log('✅ REQUESTS FOUND - Analyzing each request...')
                      salaryRequests.forEach((req, index) => {
                        console.log(`Request ${index + 1}:`, {
                          id: req.id,
                          _id: req._id,
                          employeeId: req.employeeId,
                          employeeName: req.employeeName,
                          status: req.status,
                          basicSalary: req.basicSalary,
                          department: req.department,
                          isFromServer: !!req._id,
                          isFromLocal: !req._id && typeof req.id === 'number'
                        })
                      })
                      
                      const pendingCount = salaryRequests.filter(req => req.status === 'Pending').length
                      alert(`✅ Found ${salaryRequests.length} requests (${pendingCount} pending). Details logged to console.`)
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                >
                  📊 Analyze Data
                </button>
                
                <div className="mt-2">
                  {salaryRequests.length === 0 ? (
                    <div className="p-2 bg-red-100 rounded text-red-700">
                      <p>❌ No requests found!</p>
                      <p className="text-xs">Click "🔗 Test Connection" above</p>
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {salaryRequests.map((req, index) => (
                        <div key={req.id || index} className="border-l-2 border-yellow-400 pl-2 bg-white p-1 rounded">
                          <p><strong>#{index + 1}:</strong> {req.employeeName} - {req.status}</p>
                          <p className="text-xs">ID: {req.id || req._id} | Emp: {req.employeeId} | Salary: ${req.basicSalary}</p>
                          <p className="text-xs">Dept: {req.department} | {req._id ? '🟢 Server' : '🔵 Local'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Salary Requests Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Pending Salary Requests</h3>
                <button
                  onClick={async () => {
                    console.log('=== MANUAL REFRESH FROM SERVER CLICKED ===')
                    try {
                      const [serverRequests, localRequests] = await Promise.all([
                        salaryRequestAPI.getAll(),
                        getAllSalaryRequests()
                      ])
                      console.log('Refreshed server salary requests:', serverRequests)
                      console.log('Refreshed local salary requests:', localRequests)
                      
                      const combinedRequests = [...serverRequests, ...localRequests]
                      setSalaryRequests(combinedRequests)
                      
                      const pendingCount = combinedRequests.filter(req => req.status === 'Pending').length
                      alert(`Refreshed! Found ${combinedRequests.length} total requests (${pendingCount} pending) from server and local`)
                    } catch (error) {
                      console.error('Error refreshing from server:', error)
                      // Fallback to local only
                      const localRequests = getAllSalaryRequests()
                      setSalaryRequests(localRequests)
                      alert(`Server error! Loaded ${localRequests.length} local requests only`)
                    }
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1"
                >
                  <FaCalendarAlt className="text-xs" />
                  <span>Refresh Requests</span>
                </button>
              </div>
              
              {salaryRequests.filter(req => req.status === 'Pending').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>No pending salary requests</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salaryRequests.filter(req => req.status === 'Pending').map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaUser className="text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {request.employeeName || request.name || `Employee ${request.employeeId || 'Unknown'}`}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.employeeId || `ID: ${request.id || 'Unknown'}`}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {request.email || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.department || 'Not specified'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">
                                ${request.basicSalary ? parseFloat(request.basicSalary).toLocaleString() : '0'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Net: ${request.netSalary ? parseFloat(request.netSalary).toLocaleString() : '0'}
                              </div>
                              {request.allowances && (
                                <div className="text-xs text-green-600">
                                  +${parseFloat(request.allowances).toLocaleString()} allowances
                                </div>
                              )}
                              {request.deductions && (
                                <div className="text-xs text-red-600">
                                  -${parseFloat(request.deductions).toLocaleString()} deductions
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.effectiveDate || 'Not set'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.requestedDate || 'Not set'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* All Requests Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">All Salary Requests</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-yellow-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {salaryRequests.filter(req => req.status === 'Pending').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaCheck className="text-green-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Approved</p>
                      <p className="text-2xl font-bold text-green-700">
                        {salaryRequests.filter(req => req.status === 'Approved').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FaTimes className="text-red-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm text-red-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-700">
                        {salaryRequests.filter(req => req.status === 'Rejected').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Records Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Salary Records</h3>
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-500">
                    API: {salaries.length} | Local: {getAllSalaryRecords().length} | Total: {allSalaries.length}
                  </span>
                  <button
                    onClick={() => {
                      console.log('=== REFRESH SALARY RECORDS ===')
                      const localRecords = getAllSalaryRecords()
                      const combined = [...salaries, ...localRecords]
                      setAllSalaries(combined)
                      alert(`Refreshed! API: ${salaries.length}, Local: ${localRecords.length}, Total: ${combined.length}`)
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              
              {allSalaries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaMoneyBillWave className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>No salary records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allSalaries.map((salary, index) => {
                        return (
                        <tr key={salary.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Salary</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.employeeId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.employeeName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.basicSalary || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.allowances || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(salary.deductions || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${parseFloat(salary.netSalary || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{salary.payDate || salary.effectiveDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              salary.status === 'Active' ? 'bg-green-100 text-green-800' :
                              salary.status === 'Processed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {salary.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">admin</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  console.log('=== EDIT CLICKED ==='); 
                                  handleEditSalary(salary);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-2 border border-blue-300 rounded bg-blue-50"
                                title="Edit"
                                style={{cursor: 'pointer', zIndex: 10}}
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => {
                                  console.log('=== DELETE CLICKED ===');
                                  console.log('Salary data:', salary);
                                  console.log('Index:', index);
                                  handleDeleteSalary(salary, index);
                                }}
                                className="text-red-600 hover:text-red-800 p-2 border border-red-300 rounded bg-red-50"
                                title="Delete"
                                style={{cursor: 'pointer', zIndex: 10, position: 'relative'}}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                      })}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">{activeSection}</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">This section is under development...</p>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-lg">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                  />
                ) : (
                  <FaUser className="text-purple-600 text-3xl" />
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                  <FaCamera className="text-sm" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData?.name || 'Admin'}</h1>
                <p className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{userData?.email || 'admin@company.com'}</span>
                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                    {userData?.role || 'Admin'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Last Login</p>
                <p className="text-sm text-gray-700 font-medium">{new Date().toLocaleString()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <FaUser className="text-purple-600 text-xl" />
                  )}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="absolute bottom-0 right-0 bg-purple-600 text-white px-2 py-1 rounded-full text-xs hover:bg-purple-700 transition-colors"
                  >
                    <FaCamera />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{userData?.name || 'Admin'}</h3>
                <p className="text-sm text-gray-600">{userData?.role || 'Admin'}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
