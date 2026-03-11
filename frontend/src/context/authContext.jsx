import React, { createContext, useMemo, useState, useContext, useEffect } from 'react'
import { api } from '../api/client'

const userContext = createContext()

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
     
    // Mock users with same access level for all employees
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@company.com",
        password: "password123",
        role: "employee", // All employees have same role
        employeeId: "EMP001"
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@company.com",
        password: "password123",
        role: "employee", // All employees have same role
        employeeId: "EMP002"
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert.johnson@company.com",
        password: "password123",
        role: "employee", // All employees have same role
        employeeId: "EMP003"
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        password: "password123",
        role: "employee", // All employees have same role
        employeeId: "EMP004"
      },
      {
        id: 5,
        name: "Admin User",
        email: "admin@company.com",
        password: "admin123",
        role: "admin", // Admin user for system administration
        employeeId: "ADMIN001"
      }
    ];

    const login = (user) => {
        setUser(user)
        // token already stored in Login.jsx; we only keep it in memory here
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("token")
    }

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData }
        setUser(updatedUser)
        // Also update in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return updatedUser
    }

    useEffect(() => {
        // Try to restore user from localStorage
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        if (storedUser && token) {
            try {
                const userData = JSON.parse(storedUser)
                console.log('Restoring user from localStorage:', userData)
                setUser(userData)
            } catch (error) {
                console.error('Failed to parse stored user:', error)
                localStorage.removeItem('user')
            }
        }
        
        setLoading(false)
    }, [])

    const value = useMemo(() => ({ user, loading, login, logout, updateUser }), [user, loading])

    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => useContext(userContext)

export default AuthContext