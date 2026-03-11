import express from "express";
import SalaryRequest from "../models/SalaryRequest.js";

const router = express.Router();

// Get all salary requests
router.get("/", async (req, res) => {
    try {
        const requests = await SalaryRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get salary requests by employee ID
router.get("/employee/:employeeId", async (req, res) => {
    try {
        const requests = await SalaryRequest.find({ employeeId: req.params.employeeId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get pending salary requests
router.get("/pending", async (req, res) => {
    try {
        const requests = await SalaryRequest.find({ status: 'Pending' }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new salary request
router.post("/", async (req, res) => {
    try {
        console.log('Received salary request data:', req.body);
        const salaryRequest = new SalaryRequest(req.body);
        const newRequest = await salaryRequest.save();
        console.log('Salary request saved successfully:', newRequest);
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error saving salary request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update salary request status (approve/reject)
router.put("/:id", async (req, res) => {
    try {
        const request = await SalaryRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!request) {
            return res.status(404).json({ error: "Salary request not found" });
        }
        
        // If approved, create a salary record
        if (req.body.status === 'Approved') {
            const Salary = (await import('../models/Salary.js')).default;
            const salaryRecord = new Salary({
                employeeId: request.employeeId,
                employeeName: request.employeeName,
                department: request.department,
                basicSalary: request.basicSalary,
                allowances: request.allowances,
                deductions: request.deductions,
                netSalary: request.netSalary,
                payDate: request.effectiveDate,
                paymentMethod: request.paymentMethod,
                status: 'Active',
                notes: request.notes
            });
            await salaryRecord.save();
            console.log('Salary record created from approved request:', salaryRecord);
        }
        
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete salary request
router.delete("/:id", async (req, res) => {
    try {
        const request = await SalaryRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ error: "Salary request not found" });
        }
        res.json({ message: "Salary request deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
