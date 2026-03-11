import axios from 'axios'

// Use backend server URL for development
const baseURL = import.meta.env.DEV ? 'http://localhost:5000' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Optional: attach token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
