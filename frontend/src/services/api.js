// API base URL - Direct connection to backend for development
const API_BASE_URL = 'http://localhost:5000/api'

// Employee API functions
export const employeeAPI = {
  // Get all employees
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`)
      if (!response.ok) throw new Error('Failed to fetch employees')
      return await response.json()
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    }
  },

  // Create new employee
  create: async (employeeData) => {
    try {
      console.log('API: Creating employee with data:', employeeData) // Debug log
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
      })
      console.log('API: Response status:', response.status) // Debug log
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Error response:', errorText) // Debug log
        throw new Error(`Failed to create employee: ${errorText}`)
      }
      const result = await response.json()
      console.log('API: Employee created successfully:', result) // Debug log
      return result
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  },

  // Update employee
  update: async (id, employeeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
      })
      if (!response.ok) throw new Error('Failed to update employee')
      return await response.json()
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    }
  },

  // Delete employee
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete employee')
      return await response.json()
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  },

  // Update employee salary
  updateSalary: async (id, salaryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salaryData)
      })
      if (!response.ok) throw new Error('Failed to update salary')
      return await response.json()
    } catch (error) {
      console.error('Error updating salary:', error)
      throw error
    }
  }
}

// Salary API functions
export const salaryAPI = {
  // Get all salary records
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/salaries`)
      if (!response.ok) throw new Error('Failed to fetch salary records')
      return await response.json()
    } catch (error) {
      console.error('Error fetching salary records:', error)
      throw error
    }
  },

  // Get salary by employee ID
  getByEmployeeId: async (employeeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salaries/employee/${employeeId}`)
      if (!response.ok) throw new Error('Failed to fetch employee salary records')
      return await response.json()
    } catch (error) {
      console.error('Error fetching employee salary records:', error)
      throw error
    }
  },

  // Create new salary record
  create: async (salaryData) => {
    try {
      // Remove _id field if present to avoid MongoDB ObjectId error
      const { _id, ...cleanSalaryData } = salaryData
      console.log('API: Creating salary record with data:', cleanSalaryData)
      const response = await fetch(`${API_BASE_URL}/salaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanSalaryData)
      })
      console.log('API: Salary response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Error response:', errorText)
        throw new Error(`Failed to create salary record: ${errorText}`)
      }
      const result = await response.json()
      console.log('API: Salary record created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating salary record:', error)
      throw error
    }
  },

  // Update salary record
  update: async (id, salaryData) => {
    try {
      // Remove _id field if present to avoid MongoDB ObjectId error
      const { _id, ...cleanSalaryData } = salaryData
      const response = await fetch(`${API_BASE_URL}/salaries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanSalaryData)
      })
      if (!response.ok) throw new Error('Failed to update salary record')
      return await response.json()
    } catch (error) {
      console.error('Error updating salary record:', error)
      throw error
    }
  },

  // Delete salary record
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salaries/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete salary record')
      return await response.json()
    } catch (error) {
      console.error('Error deleting salary record:', error)
      throw error
    }
  }
}

// Leave API functions
export const leaveAPI = {
  // Get all leave requests
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaves`)
      if (!response.ok) throw new Error('Failed to fetch leave requests')
      return await response.json()
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      throw error
    }
  },

  // Get leave by employee ID
  getByEmployeeId: async (employeeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaves/employee/${employeeId}`)
      if (!response.ok) throw new Error('Failed to fetch employee leave requests')
      return await response.json()
    } catch (error) {
      console.error('Error fetching employee leave requests:', error)
      throw error
    }
  },

  // Create new leave request
  create: async (leaveData) => {
    try {
      console.log('API: Creating leave request with data:', leaveData)
      const response = await fetch(`${API_BASE_URL}/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData)
      })
      console.log('API: Leave response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Error response:', errorText)
        throw new Error(`Failed to create leave request: ${errorText}`)
      }
      const result = await response.json()
      console.log('API: Leave request created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating leave request:', error)
      throw error
    }
  },

  // Update leave request
  update: async (id, leaveData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaves/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData)
      })
      if (!response.ok) throw new Error('Failed to update leave request')
      return await response.json()
    } catch (error) {
      console.error('Error updating leave request:', error)
      throw error
    }
  },

  // Delete leave request
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaves/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete leave request')
      return await response.json()
    } catch (error) {
      console.error('Error deleting leave request:', error)
      throw error
    }
  }
}

// Settings API functions
export const settingsAPI = {
  // Get all settings
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`)
      if (!response.ok) throw new Error('Failed to fetch settings')
      return await response.json()
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  },

  // Update settings
  update: async (settingsData) => {
    try {
      console.log('API: Updating settings with data:', settingsData)
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData)
      })
      console.log('API: Settings response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Error response:', errorText)
        throw new Error(`Failed to update settings: ${errorText}`)
      }
      const result = await response.json()
      console.log('API: Settings updated successfully:', result)
      return result
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  // Reset settings to default
  reset: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/reset`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to reset settings')
      return await response.json()
    } catch (error) {
      console.error('Error resetting settings:', error)
      throw error
    }
  }
}

// Salary Request API functions
export const salaryRequestAPI = {
  // Get all salary requests
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary-requests`)
      if (!response.ok) throw new Error('Failed to fetch salary requests')
      return await response.json()
    } catch (error) {
      console.error('Error fetching salary requests:', error)
      throw error
    }
  },

  // Get salary requests by employee ID
  getByEmployeeId: async (employeeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary-requests/employee/${employeeId}`)
      if (!response.ok) throw new Error('Failed to fetch employee salary requests')
      return await response.json()
    } catch (error) {
      console.error('Error fetching employee salary requests:', error)
      throw error
    }
  },

  // Get pending salary requests
  getPending: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary-requests/pending`)
      if (!response.ok) throw new Error('Failed to fetch pending salary requests')
      return await response.json()
    } catch (error) {
      console.error('Error fetching pending salary requests:', error)
      throw error
    }
  },

  // Create new salary request
  create: async (requestData) => {
    try {
      console.log('API: Creating salary request with data:', requestData)
      const response = await fetch(`${API_BASE_URL}/salary-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      console.log('API: Salary request response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Error response:', errorText)
        throw new Error(`Failed to create salary request: ${errorText}`)
      }
      const result = await response.json()
      console.log('API: Salary request created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating salary request:', error)
      throw error
    }
  },

  // Update salary request status
  update: async (id, requestData) => {
    try {
      console.log('API: Updating salary request with ID:', id, 'and data:', requestData)
      const response = await fetch(`${API_BASE_URL}/salary-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      console.log('API: Salary request update response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Error response:', errorText)
        throw new Error(`Failed to update salary request: ${errorText}`)
      }
      const result = await response.json()
      console.log('API: Salary request updated successfully:', result)
      return result
    } catch (error) {
      console.error('Error updating salary request:', error)
      throw error
    }
  },

  // Delete salary request
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary-requests/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete salary request')
      return await response.json()
    } catch (error) {
      console.error('Error deleting salary request:', error)
      throw error
    }
  }
}

// Department API functions
export const departmentAPI = {
  // Get all departments
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`)
      if (!response.ok) throw new Error('Failed to fetch departments')
      return await response.json()
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  },

  // Create new department
  create: async (departmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData)
      })
      if (!response.ok) throw new Error('Failed to create department')
      return await response.json()
    } catch (error) {
      console.error('Error creating department:', error)
      throw error
    }
  },

  // Update department
  update: async (id, departmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData)
      })
      if (!response.ok) throw new Error('Failed to update department')
      return await response.json()
    } catch (error) {
      console.error('Error updating department:', error)
      throw error
    }
  },

  // Delete department
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete department')
      return await response.json()
    } catch (error) {
      console.error('Error deleting department:', error)
      throw error
    }
  }
}
