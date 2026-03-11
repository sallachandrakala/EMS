import mongoose from "mongoose";

const salaryRequestSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        ref: 'Employee'
    },
    employeeName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    },
    effectiveDate: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'Bank Transfer'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    requestedDate: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    adminNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const SalaryRequest = mongoose.model('SalaryRequest', salaryRequestSchema);

export default SalaryRequest;
