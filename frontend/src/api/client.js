import axios from 'axios'

// Dev: use same origin so Vite proxies /api to backend (http://127.0.0.1:5000).
// Production: set VITE_API_URL to your backend URL (e.g. https://api.example.com).
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
