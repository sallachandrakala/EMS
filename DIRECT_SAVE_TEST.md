# Direct Save Test - Copy and Paste into Browser Console

Open your Employee Salary Management page, press F12, and paste this code:

```javascript
// TEST: Direct save to localStorage
console.clear();
console.log('🧪 TESTING DIRECT SAVE TO LOCALSTORAGE');

const testData = {
    id: Date.now(),
    _id: Date.now().toString(),
    employeeId: 'TEST001',
    employeeName: 'Test Employee',
    email: 'test@test.com',
    department: 'IT',
    basicSalary: 50000,
    allowances: 10000,
    deductions: 5000,
    netSalary: 55000,
    effectiveDate: new Date().toISOString().split('T')[0],
    requestedDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    notes: 'Test request',
    status: 'Pending',
    submittedBy: 'employee',
    submittedAt: new Date().toISOString()
};

console.log('Test data created:', testData);

// Get existing
let requests = [];
const stored = localStorage.getItem('salaryRequests');
if (stored) {
    requests = JSON.parse(stored);
}
console.log('Current requests:', requests.length);

// Add new
requests.push(testData);
console.log('After push:', requests.length);

// Save
localStorage.setItem('salaryRequests', JSON.stringify(requests));
console.log('✅ SAVED!');

// Verify
const verify = JSON.parse(localStorage.getItem('salaryRequests'));
console.log('✅ VERIFIED:', verify.length, 'requests');
console.log('Last request:', verify[verify.length - 1]);

alert('✅ Test data saved!\n\nRequests in storage: ' + verify.length + '\n\nNow reload the page to see it in the table.');

// Reload page
setTimeout(() => location.reload(), 2000);
```

## What This Does:
1. Creates test salary request data
2. Saves it directly to localStorage
3. Verifies it was saved
4. Reloads the page
5. You should see the test data in the table

## If This Works:
The problem is in the form submit handler, not localStorage.

## If This Doesn't Work:
There's a browser/localStorage issue.
