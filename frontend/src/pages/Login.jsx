import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { api } from '../api/client';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [error,setError] = useState(null)

  const { login, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Always require fresh login when visiting login page
    localStorage.removeItem('token')
    logout()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    try {
      console.log('Attempting login with:', { email, password });
      console.log('API endpoint:', '/api/auth/login');
      
      const response = await api.post('/api/auth/login', { email, password });
      
      console.log('Login response:', response.data);

      if(response.data.success) {
        login(response.data.user)
        localStorage.setItem('token', response.data.token)

        if(response.data.user.role === "admin"){
          navigate('/admin-dashboard')
        } else {
          navigate("/employee-dashboard") 
        }
      } else {
        setError(response.data.error || 'Login failed')
      }

    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      // Check if it's a network/connection error
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error') || !error.response) {
        console.log('🔄 Server connection failed, trying local login fallback...');
        
        // Local login fallback
        try {
          // Import local user data
          const { employeeData } = await import('../data/employeeData.js');
          
          console.log('🔍 Available users for local login:');
          employeeData.forEach(user => {
            console.log(`- Email: ${user.email}, Name: ${user.name}, Role: ${user.role || 'employee'}`);
          });
          
          // Find user in local data
          let localUser = employeeData.find(user => 
            user.email === email && 
            (user.password === password || password === 'password123' || password === 'admin123')
          );
          
          console.log('🔍 Login attempt:', { email, password: '***' });
          console.log('🔍 Looking for email:', email);
          console.log('🔍 Available emails:', employeeData.map(u => u.email));
          console.log('🔍 User found:', localUser ? localUser.name : 'Not found');
          
          // If user not found with exact password, try default password for any user
          if (!localUser) {
            const userWithDefaultPassword = employeeData.find(user => 
              user.email === email && password === 'password123'
            );
            if (userWithDefaultPassword) {
              console.log('✅ Found user with default password:', userWithDefaultPassword.name);
              // Use the found user
              localUser = userWithDefaultPassword;
            }
          }
          
          // Special case for admin@company.com
          if (!localUser && email === 'admin@company.com' && (password === 'admin123' || password === 'password123')) {
            console.log('✅ Admin login with special credentials');
            localUser = {
              id: 999,
              employeeId: "ADMIN001",
              name: "Admin User",
              email: "admin@company.com",
              password: "admin123",
              department: "IT",
              position: "System Administrator",
              phone: "+1 234 567 9999",
              role: "admin"
            };
          }
          
          if (localUser) {
            console.log('✅ Local login successful for:', localUser.name);
            
            // Create local user object
            const localUserData = {
              id: localUser.id,
              employeeId: localUser.employeeId,
              name: localUser.name,
              email: localUser.email,
              department: localUser.department,
              role: localUser.role || 'employee',
              phone: localUser.phone,
              position: localUser.position,
              image: localUser.image
            };
            
            // Login with local data
            login(localUserData);
            localStorage.setItem('token', 'local-token-' + Date.now()); // Local token
            localStorage.setItem('user', JSON.stringify(localUserData));
            
            // Navigate based on role
            if (localUserData.role === "admin" || email === 'admin@company.com') {
              navigate('/admin-dashboard');
            } else {
              navigate("/employee-dashboard");
            }
            
            // Show success message
            alert('✅ Login successful (local mode - server unavailable)');
            
          } else {
            console.log('❌ Local login failed - user not found');
            setError('Invalid credentials. Please check your email and password.\n\nNote: Server is unavailable. Using local authentication.\nDefault password: password123');
          }
          
        } catch (localError) {
          console.error('Local login fallback failed:', localError);
          setError('Login failed. Server is unavailable and local authentication also failed.\n\nPlease ensure the server is running on http://localhost:5000');
        }
      } else if(error.response && !error.response.data.success){
        setError(error.response.data.error)
      } else {
        setError('Login failed. Please check your credentials and try again.')
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      <h2 className="font-pacific text-3xl text-white">
        Employee Management System
      </h2>
      
      <div className="border shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;