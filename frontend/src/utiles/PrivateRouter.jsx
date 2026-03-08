import React from 'react'
import { useAuth} from '../context/authContext'
import { Navigate} from 'react-router-dom'

const PrivateRouter = ({children}) => {
  const {user, loading} = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }
  return user ? children : <Navigate to ="/login" />

  if (!user) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <div>PrivateRouter</div>
  )
}

export default PrivateRouter