import React from 'react'
import { useAuth} from '../contextauthContext'
 
const RoleBaseRoute = ({children, requiredRole}) => {
    const {user, loading} = useAuth() 
    
    if(loading) {
        <div>Loading..</div>

    }
    if(!requiredRole.includes(user.role)) {
        <Navigate to ="/unauthorized"/>

    }
    return user ? children : <Navigate to = "/login"/>
}

export default RoleBaseRoutes