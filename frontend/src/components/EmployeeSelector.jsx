import React from 'react';
import { employeeData } from '../data/employeeData';

const EmployeeSelector = ({ currentEmployee, onEmployeeChange }) => {
  const handleEmployeeChange = (e) => {
    const selectedEmployee = employeeData.find(emp => emp.employeeId === e.target.value);
    onEmployeeChange(selectedEmployee);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Employee
      </label>
      <select
        value={currentEmployee?.employeeId || ''}
        onChange={handleEmployeeChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">Choose an employee...</option>
        {employeeData.map(employee => (
          <option key={employee.id} value={employee.employeeId}>
            {employee.name} - {employee.employeeId} ({employee.department})
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmployeeSelector;
