import express from "express";
import Settings from "../models/Settings.js";

const router = express.Router();

// Get all settings
router.get("/", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
router.put("/", async (req, res) => {
    try {
        console.log('Updating settings:', req.body);
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        
        // Update all fields
        Object.assign(settings, req.body);
        settings.updatedAt = new Date();
        
        const updatedSettings = await settings.save();
        console.log('Settings updated successfully:', updatedSettings);
        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Reset settings to default
router.post("/reset", async (req, res) => {
    try {
        await Settings.deleteMany({});
        const defaultSettings = new Settings();
        await defaultSettings.save();
        console.log('Settings reset to default');
        res.json(defaultSettings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
