import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    designation: { type: String },
    department: { type: String },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    effectiveDate: { type: Date, required: true },
    paymentMethod: { type: String, enum: ['Bank Transfer', 'Cash', 'Check'], default: 'Bank Transfer' },
    status: { type: String, enum: ['Active', 'Inactive', 'On Hold'], default: 'Active' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
