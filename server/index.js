import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import connectToDatabase from './db/db.js'

connectToDatabase()
const app = express()
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(express.json())

// Health check (so frontend/proxy can verify backend is up)
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }))
app.use('/api/auth', authRouter)



const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`)
})

