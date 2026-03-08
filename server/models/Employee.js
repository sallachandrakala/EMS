import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String },
    maritalStatus: { type: String },
    designation: { type: String },
    department: { type: String },
    salary: { type: Number },
    password: { type: String },
    role: { type: String },
    image: { type: String },
    status: { type: String, default: 'Active' },
    basicSalary: { type: Number },
    allowances: { type: Number },
    netSalary: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
