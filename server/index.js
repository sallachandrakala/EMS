import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import connectToDatabase from './db/db.js'

connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)



const port = process.env.PORT || 5000
app.listen(port, () =>{
    console.log(`Server is Running on port ${port}`)
})

