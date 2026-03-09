import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new employee
router.post("/", async (req, res) => {
    try {
        console.log('Received employee data:', req.body);
        const employee = new Employee(req.body);
        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        console.error('Employee creation error details:', error);
        console.error('Validation errors:', error.errors);
        res.status(400).json({ error: error.message });
    }
});

// Update employee
router.put("/:id", async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete employee
router.delete("/:id", async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
