// Update all employees data
export const updateAllEmployees = (updatedData) => {
  // Update employees with new data
  const updatedEmployees = employeeData.map(employee => {
    const updateData = updatedData.find(update => update.employeeId === employee.employeeId);
    if (updateData) {
      return {
        ...employee,
        ...updateData
      };
    }
    return employee;
  });
  
  return updatedEmployees;
};

// Update specific employee
export const updateEmployee = (employeeId, updates) => {
  const employeeIndex = employeeData.findIndex(emp => emp.employeeId === employeeId);
  if (employeeIndex !== -1) {
    employeeData[employeeIndex] = { ...employeeData[employeeIndex], ...updates };
  }
  
  return employeeData[employeeIndex];
};

// Update salary for all employees
export const updateAllSalaries = (updatedSalaries) => {
  return updatedSalaries;
};

// Update leave requests for all employees
export const updateAllLeaveRequests = (updatedLeaves) => {
  return updatedLeaves;
};

// Get updated employee data
export const getUpdatedEmployees = () => {
  return employeeData;
};

// Get updated salary records
export const getUpdatedSalaryRecords = () => {
  return salaryRecords;
};

// Get updated leave requests
export const getUpdatedLeaveRequests = () => {
  return leaveRequests;
};

// Bulk update operations
export const bulkUpdateEmployees = (updates) => {
  updates.forEach(update => {
    const employeeIndex = employeeData.findIndex(emp => emp.employeeId === update.employeeId);
    if (employeeIndex !== -1) {
      employeeData[employeeIndex] = { ...employeeData[employeeIndex], ...update.data };
    }
  });
  
  return employeeData;
};
