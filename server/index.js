import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import settingsRouter from './routes/settings.js'
import connectToDatabase from './db/db.js'

connectToDatabase()
const app = express()
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Health check (so frontend/proxy can verify backend is up)
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/departments', departmentRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/salaries', salaryRouter)
app.use('/api/leaves', leaveRouter)
app.use('/api/settings', settingsRouter)



const port = process.env.PORT || 5000
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is Running on port ${port}`)
  console.log(`Server accessible at http://localhost:${port}`)
})

