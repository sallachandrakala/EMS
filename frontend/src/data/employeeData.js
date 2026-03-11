// Employee Data Store
export const employeeData = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "IT",
    position: "Software Developer",
    phone: "+1 234 567 8900",
    address: "123 Main St, New York, NY",
    joinDate: "2023-01-01",
    bloodGroup: "O+",
    maritalStatus: "Single",
    emergencyContact: "+1 987 654 3210",
    salary: 12500,
    leaveBalance: 15,
    leaveUsed: 5,
    attendance: 98,
    pendingTasks: 3,
    overdueTasks: 1
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "HR",
    position: "HR Manager",
    phone: "+1 234 567 8901",
    address: "456 Oak Ave, New York, NY",
    joinDate: "2022-06-15",
    bloodGroup: "A+",
    maritalStatus: "Married",
    emergencyContact: "+1 987 654 3211",
    salary: 15000,
    leaveBalance: 20,
    leaveUsed: 8,
    attendance: 96,
    pendingTasks: 5,
    overdueTasks: 2
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    department: "Finance",
    position: "Financial Analyst",
    phone: "+1 234 567 8902",
    address: "789 Pine St, New York, NY",
    joinDate: "2021-03-20",
    bloodGroup: "B+",
    maritalStatus: "Married",
    emergencyContact: "+1 987 654 3212",
    salary: 13500,
    leaveBalance: 18,
    leaveUsed: 7,
    attendance: 94,
    pendingTasks: 2,
    overdueTasks: 0
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    phone: "+1 234 567 8903",
    address: "321 Elm Dr, New York, NY",
    joinDate: "2020-09-10",
    bloodGroup: "AB+",
    maritalStatus: "Single",
    emergencyContact: "+1 987 654 3213",
    salary: 14500,
    leaveBalance: 22,
    leaveUsed: 3,
    attendance: 99,
    pendingTasks: 4,
    overdueTasks: 1
  }
];

// Leave Requests Data
export const leaveRequests = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "John Doe",
    leaveType: "Annual",
    fromDate: "2024-12-15",
    toDate: "2024-12-17",
    reason: "Family vacation",
    status: "Approved",
    appliedDate: "2024-12-01"
  },
  {
    id: 2,
    employeeId: "EMP001",
    employeeName: "John Doe",
    leaveType: "Sick",
    fromDate: "2024-11-20",
    toDate: "2024-11-21",
    reason: "Medical appointment",
    status: "Pending",
    appliedDate: "2024-11-15"
  },
  {
    id: 3,
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    leaveType: "Annual",
    fromDate: "2024-12-20",
    toDate: "2024-12-25",
    reason: "Holiday trip",
    status: "Approved",
    appliedDate: "2024-11-20"
  },
  {
    id: 4,
    employeeId: "EMP003",
    employeeName: "Robert Johnson",
    leaveType: "Personal",
    fromDate: "2024-12-10",
    toDate: "2024-12-11",
    reason: "Personal work",
    status: "Rejected",
    appliedDate: "2024-12-05"
  }
];

// Salary Records Data
export let salaryRecords = [];

// Get current employee data
export const getCurrentEmployee = (employeeId) => {
  return employeeData.find(emp => emp.employeeId === employeeId);
};

// Get employee leave requests
export const getEmployeeLeaveRequests = (employeeId) => {
  return leaveRequests.filter(leave => leave.employeeId === employeeId);
};

// Add new leave request
export const addLeaveRequest = (leaveData) => {
  const newLeave = {
    id: leaveRequests.length + 1,
    ...leaveData,
    appliedDate: new Date().toISOString().split('T')[0]
  };
  leaveRequests.push(newLeave);
  return newLeave;
};

// Update leave request
export const updateLeaveRequest = (id, updatedData) => {
  const index = leaveRequests.findIndex(leave => leave.id === id);
  if (index !== -1) {
    leaveRequests[index] = { ...leaveRequests[index], ...updatedData };
    return leaveRequests[index];
  }
  return null;
};

// Delete leave request
export const deleteLeaveRequest = (id) => {
  const index = leaveRequests.findIndex(leave => leave.id === id);
  if (index !== -1) {
    const deleted = leaveRequests.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// Update salary record
export const updateSalaryData = (id, updatedData) => {
  console.log('updateSalaryData called with ID:', id, 'and data:', updatedData)
  
  const index = salaryRecords.findIndex(salary => 
    (salary.id === id) || (salary._id === id)
  );
  
  if (index !== -1) {
    console.log('Found salary record at index:', index)
    salaryRecords[index] = { ...salaryRecords[index], ...updatedData };
    console.log('Updated salary record:', salaryRecords[index])
    console.log('All salary records after update:', salaryRecords.length)
    return salaryRecords[index];
  } else {
    console.log('Salary record not found with ID:', id)
    return null;
  }
};

// DISABLED: Save data to localStorage after any update - was causing issues with clear
export const saveDataToStorage = () => {
  // DISABLED - DO NOT AUTO-SAVE
  console.log('⚠️ saveDataToStorage is disabled to allow clearing data')
  return;
  
  // try {
  //   localStorage.setItem('salaryRecords', JSON.stringify(salaryRecords))
  //   localStorage.setItem('salaryRequests', JSON.stringify(salaryRequests))
  //   localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests))
  //   console.log('💾 Data saved to localStorage')
  // } catch (error) {
  //   console.error('Error saving data to localStorage:', error)
  // }
};

// Function to clear all salary data (arrays and localStorage)
export const clearAllSalaryData = () => {
  console.log('🗑️ Clearing all salary data from arrays and localStorage...');
  
  // Clear the arrays
  salaryRecords.length = 0;
  salaryRequests.length = 0;
  
  // Clear localStorage
  localStorage.removeItem('salaryRequests');
  localStorage.removeItem('salaryRecords');
  localStorage.removeItem('admin_dashboard_salaries');
  localStorage.removeItem('salary_requests');
  
  console.log('✅ All salary data cleared!');
  console.log('salaryRecords array length:', salaryRecords.length);
  console.log('salaryRequests array length:', salaryRequests.length);
};

// DISABLED: Auto-save was preventing clear from working
// Auto-save data when arrays change
// const originalPush = Array.prototype.push
// const originalSplice = Array.prototype.splice

// Array.prototype.push = function(...args) {
//   const result = originalPush.apply(this, args)
//   saveDataToStorage()
//   return result
// }

// Array.prototype.splice = function(...args) {
//   const result = originalSplice.apply(this, args)
//   saveDataToStorage()
//   return result
// }

// Add new salary record
export const addSalaryRecord = (salaryData) => {
  console.log('addSalaryRecord called with data:', salaryData)
  const newSalary = {
    id: salaryRecords.length + 1,
    ...salaryData
  };
  console.log('New salary record to add:', newSalary)
  salaryRecords.push(newSalary);
  console.log('Salary records after adding:', salaryRecords)
  return newSalary;
};

// Update salary record
export const updateSalaryRecord = (id, updatedData) => {
  console.log('updateSalaryRecord called with ID:', id, 'and data:', updatedData)
  console.log('Current salaryRecords:', salaryRecords)
  
  const index = salaryRecords.findIndex(salary => salary.id === id || salary._id === id);
  console.log('Found index:', index)
  
  if (index !== -1) {
    console.log('Original record:', salaryRecords[index])
    salaryRecords[index] = { ...salaryRecords[index], ...updatedData };
    console.log('Updated record:', salaryRecords[index])
    return salaryRecords[index];
  }
  console.log('Record not found with ID:', id)
  return null;
};

// Delete salary record
export const deleteSalaryRecord = (id) => {
  const index = salaryRecords.findIndex(salary => salary.id === id || salary._id === id);
  if (index !== -1) {
    const deleted = salaryRecords.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// Get all salary records (for admin)
export const getAllSalaryRecords = () => {
  return salaryRecords;
};

// Get employee salary records
export const getEmployeeSalaryRecords = (employeeId) => {
  return salaryRecords.filter(salary => salary.employeeId === employeeId);
};

// Salary Requests Data
export let salaryRequests = [];

// Add new salary request
export const addSalaryRequest = (requestData) => {
  const newRequest = {
    id: salaryRequests.length + 1,
    ...requestData,
    status: "Pending",
    requestedDate: new Date().toISOString().split('T')[0]
  };
  salaryRequests.push(newRequest);
  return newRequest;
};

// Get all salary requests (for admin)
export const getAllSalaryRequests = () => {
  return salaryRequests;
};

// Get employee salary requests
export const getEmployeeSalaryRequests = (employeeId) => {
  return salaryRequests.filter(request => request.employeeId === employeeId);
};

// Update salary request status (for admin approval/rejection)
export const updateSalaryRequestStatus = (id, status, adminNotes = '') => {
  console.log('updateSalaryRequestStatus called with ID:', id, 'status:', status)
  const index = salaryRequests.findIndex(request => request.id === id);
  console.log('Found request index:', index)
  
  if (index !== -1) {
    console.log('Original request:', salaryRequests[index])
    salaryRequests[index] = {
      ...salaryRequests[index],
      status,
      adminNotes,
      processedDate: new Date().toISOString().split('T')[0]
    };
    console.log('Updated request:', salaryRequests[index])
    
    // If approved, convert to actual salary record
    if (status === "Approved") {
      console.log('Approving request - converting to salary record...')
      const approvedRequest = salaryRequests[index];
      const newSalaryRecord = {
        employeeId: approvedRequest.employeeId,
        employeeName: approvedRequest.employeeName,
        email: `${approvedRequest.employeeName.toLowerCase().replace(' ', '.')}@company.com`,
        department: approvedRequest.department,
        basicSalary: approvedRequest.basicSalary,
        allowances: approvedRequest.allowances,
        deductions: approvedRequest.deductions,
        netSalary: approvedRequest.netSalary,
        payDate: approvedRequest.effectiveDate,
        effectiveDate: approvedRequest.effectiveDate,
        paymentMethod: approvedRequest.paymentMethod,
        status: "Active",
        notes: approvedRequest.notes
      };
      console.log('Creating new salary record:', newSalaryRecord)
      const result = addSalaryRecord(newSalaryRecord);
      console.log('Salary record creation result:', result)
      console.log('Current salary records:', salaryRecords)
    }
    
    return salaryRequests[index];
  }
  console.log('Request not found with ID:', id)
  return null;
};

// Delete salary request
export const deleteSalaryRequest = (id) => {
  const index = salaryRequests.findIndex(request => request.id === id);
  if (index !== -1) {
    const deleted = salaryRequests.splice(index, 1)[0];
    return deleted;
  }
  return null;
};
