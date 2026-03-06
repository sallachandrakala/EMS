import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const verifyUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization
    const token = typeof header === 'string' ? header.split(' ')[1] : undefined

    if (!token) {
      return res.status(401).json({ success: false, error: 'Token Not Provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY)

    const dbUser = await User.findById(decoded._id).select('-password')
    if (!dbUser) {
      return res.status(401).json({ success: false, error: 'User Not Found' })
    }

    req.user = dbUser
    next()
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token Not Valid' })
  }
}

export default verifyUser
