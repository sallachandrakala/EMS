import React from 'react'
import { useAuth } from '../../context/authContext'

const Navbar = () => {
    const { user, logout } = useAuth()

    const handleLogout = () => {
        // Use the logout function from context
        logout()
    }

    return (
        <div className="flex justify-between items-center h-12 bg-teal-600 text-white px-4">
            <p className="font-semibold">Welcome Admin!</p>
            <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar