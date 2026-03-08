import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminSidebar from '../componets/dashboard/AdminSidebar'
import AdminSummary from '../componets/dashboard/AdminSummary'
import Employee from '../componets/dashboard/Employee'
import Department from '../componets/dashboard/Department'
import Leave from '../componets/dashboard/Leave'
import Salary from '../componets/dashboard/Salary'
import Settings from '../componets/dashboard/Settings'

const AdminDashboard = () => {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col ml-64">
                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<AdminSummary />} />
                        <Route path="/employees" element={<Employee />} />
                        <Route path="/departments" element={<Department />} />
                        <Route path="/leave" element={<Leave />} />
                        <Route path="/salary" element={<Salary />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
export default AdminDashboard