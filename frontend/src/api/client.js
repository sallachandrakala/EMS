import axios from 'axios'

// Use Vite proxy for development
const baseURL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')

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
