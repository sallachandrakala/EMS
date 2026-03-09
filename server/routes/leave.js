import express from "express";
import Leave from "../models/Leave.js";

const router = express.Router();

// Get all leave requests
router.get("/", async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leave by employee ID
router.get("/employee/:employeeId", async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.params.employeeId }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new leave request
router.post("/", async (req, res) => {
    try {
        console.log('Received leave data:', req.body);
        const leave = new Leave(req.body);
        const newLeave = await leave.save();
        console.log('Leave request saved successfully:', newLeave);
        res.status(201).json(newLeave);
    } catch (error) {
        console.error('Error saving leave request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update leave request
router.put("/:id", async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!leave) {
            return res.status(404).json({ error: "Leave request not found" });
        }
        res.json(leave);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete leave request
router.delete("/:id", async (req, res) => {
    try {
        const leave = await Leave.findByIdAndDelete(req.params.id);
        if (!leave) {
            return res.status(404).json({ error: "Leave request not found" });
        }
        res.json({ message: "Leave request deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
