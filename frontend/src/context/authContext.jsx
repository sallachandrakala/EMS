import React, { createContext, useMemo, useState, useContext, useEffect } from 'react'
import { api } from '../api/client'

const userContext = createContext()

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
     
    const login = (user) => {
        setUser(user)
        // token already stored in Login.jsx; we only keep it in memory here
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("token")
    }

    useEffect(() => {
        // Require explicit login each time (no auto-session restore)
        setLoading(false)
    }, [])

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => useContext(userContext)

export default AuthContext