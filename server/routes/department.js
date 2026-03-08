import express from 'express'
import Department from '../models/Department.js'

const router = express.Router()

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 })
    res.json(departments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new department
router.post('/', async (req, res) => {
  try {
    const { name, head, description } = req.body
    
    if (!name || !head) {
      return res.status(400).json({ message: 'Name and head are required' })
    }

    const department = new Department({
      name,
      head,
      description
    })

    const savedDepartment = await department.save()
    res.status(201).json(savedDepartment)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department name already exists' })
    }
    res.status(500).json({ message: error.message })
  }
})

// Update department
router.put('/:id', async (req, res) => {
  try {
    const { name, head, description } = req.body
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, head, description },
      { new: true, runValidators: true }
    )

    if (!department) {
      return res.status(404).json({ message: 'Department not found' })
    }

    res.json(department)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department name already exists' })
    }
    res.status(500).json({ message: error.message })
  }
})

// Delete department
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id)
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' })
    }

    res.json({ message: 'Department deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
