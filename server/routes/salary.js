import express from "express";
import Salary from "../models/Salary.js";

const router = express.Router();

// Get all salary records
router.get("/", async (req, res) => {
    try {
        const salaries = await Salary.find().sort({ createdAt: -1 });
        res.json(salaries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get salary by employee ID
router.get("/employee/:employeeId", async (req, res) => {
    try {
        const salaries = await Salary.find({ employeeId: req.params.employeeId }).sort({ createdAt: -1 });
        res.json(salaries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new salary record
router.post("/", async (req, res) => {
    try {
        console.log('Received salary data:', req.body);
        const salary = new Salary(req.body);
        const newSalary = await salary.save();
        console.log('Salary saved successfully:', newSalary);
        res.status(201).json(newSalary);
    } catch (error) {
        console.error('Error saving salary:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update salary record
router.put("/:id", async (req, res) => {
    try {
        const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!salary) {
            return res.status(404).json({ error: "Salary record not found" });
        }
        res.json(salary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete salary record
router.delete("/:id", async (req, res) => {
    try {
        console.log('Attempting to delete salary with ID:', req.params.id);
        
        // Check if ID is a valid MongoDB ObjectId format
        const isValidObjectId = req.params.id.length === 24 && /^[0-9a-fA-F]{24}$/.test(req.params.id);
        
        if (!isValidObjectId) {
            console.log('Invalid ObjectId format provided:', req.params.id);
            return res.status(400).json({ error: "Invalid ID format. Expected MongoDB ObjectId." });
        }
        
        const salary = await Salary.findByIdAndDelete(req.params.id);
        if (!salary) {
            console.log('Salary record not found with ID:', req.params.id);
            return res.status(404).json({ error: "Salary record not found" });
        }
        
        console.log('Salary record deleted successfully:', salary._id);
        res.json({ message: "Salary record deleted successfully" });
    } catch (error) {
        console.error('Error deleting salary record:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
