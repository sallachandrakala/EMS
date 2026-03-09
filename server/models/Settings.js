import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    emailNotifications: { type: Boolean, default: true },
    leaveRequests: { type: Boolean, default: true },
    salaryUpdates: { type: Boolean, default: false },
    databaseBackup: { type: Boolean, default: false },
    systemLogs: { type: Boolean, default: false },
    clearCache: { type: Boolean, default: false },
    adminName: { type: String, default: 'Admin User' },
    adminEmail: { type: String, default: 'admin@ems.com' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
