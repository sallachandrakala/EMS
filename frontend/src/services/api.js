// API base URL - Using Vite proxy for development
const API_BASE_URL = '/api'

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
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
      })
      if (!response.ok) throw new Error('Failed to create employee')
      return await response.json()
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
