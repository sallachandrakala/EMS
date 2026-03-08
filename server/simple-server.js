import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import connectToDatabase from './db/db.js'

// Connect to database
connectToDatabase()

const app = express()
const port = 5003

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}))

// Body parser with increased limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Health check
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }))

// API routes
app.use('/api/auth', authRouter)
app.use('/api/departments', departmentRouter)
app.use('/api/employees', employeeRouter)

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is Running on port ${port}`)
  console.log(`Server accessible at http://localhost:${port}`)
  console.log(`MongoDB Connected`)
})
