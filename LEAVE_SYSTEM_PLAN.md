# Leave System - Same as Salary System

## What Needs to be Done:

### 1. Employee Leave Page (Like Salary Management)
- ✅ Employee can create leave requests
- ✅ Store in localStorage (key: `leaveRequests`)
- ✅ Show all leave requests in table
- ✅ Can edit/delete own requests
- ✅ Status shows: Pending, Approved, Rejected

### 2. Admin Leave Dashboard (Like Salary Dashboard)
- ✅ Admin sees ALL leave requests
- ✅ Filter buttons: All, Pending, Approved, Rejected
- ✅ Accept button (green) - changes status to Approved
- ✅ Reject button (red) - changes status to Rejected
- ✅ Delete button - removes request
- ✅ Real-time updates when employee submits

### 3. Data Flow:
```
Employee creates leave request
    ↓
Saved to localStorage.leaveRequests
    ↓
Event dispatched: 'newLeaveRequest'
    ↓
Admin dashboard listens and reloads
    ↓
Admin sees request in "Pending" filter
    ↓
Admin clicks Accept/Reject
    ↓
Status updated in localStorage
    ↓
Employee sees updated status
```

### 4. localStorage Structure:
```javascript
leaveRequests = [
  {
    id: timestamp,
    _id: timestamp.toString(),
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    email: 'john@company.com',
    department: 'IT',
    leaveType: 'Sick Leave',
    fromDate: '2024-01-01',
    toDate: '2024-01-03',
    reason: 'Medical',
    status: 'Pending', // or 'Approved' or 'Rejected'
    appliedDate: '2024-01-01',
    submittedBy: 'employee',
    submittedAt: timestamp
  }
]
```

## Files to Modify:
1. `frontend/src/componets/dashboard/Leave.jsx` - Make it use localStorage
2. Create admin leave management component (or add to existing admin dashboard)

## Implementation Steps:
1. Update Leave.jsx to save to localStorage
2. Add event dispatching
3. Create admin leave view with filters
4. Add Accept/Reject buttons
5. Test employee → admin flow
