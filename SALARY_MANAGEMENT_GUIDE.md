# Salary Management System - Complete Guide

## 🎯 Overview
This system allows employees to create salary requests and admins to manage them.

---

## 👤 EMPLOYEE FEATURES

### 1. Clear All Data
- **Button**: Red "Clear All Data" button in header
- **Action**: Deletes ALL salary data (admin + employee) from the system
- **Use Case**: Start fresh with new data
- **Confirmation**: Requires 2 confirmations to prevent accidents

### 2. Add Salary Request
- **Button**: Purple "Add Request" button
- **Fields You Can Enter**:
  - ✅ Employee ID (any ID you want - e.g., EMP001, EMP002, EMP999)
  - ✅ Employee Name (any name - e.g., Mohitha, Varshi, Keerthi)
  - ✅ Email (e.g., mohitha@gmail.com, varshi@gmail.com)
  - ✅ Department (e.g., IT, HR, Finance)
  - ✅ Basic Salary (amount)
  - ✅ Allowances (amount)
  - ✅ Deductions (amount)
  - ✅ Net Salary (auto-calculated)
  - ✅ Effective Date
  - ✅ Payment Method
  - ✅ Notes

- **Important**: ALL fields are editable! You can enter ANY name and ID you want.
- **Status**: Starts as "Pending" - waiting for admin approval
- **Where it goes**: Saved to localStorage → Shows in Admin Dashboard

### 3. Edit Salary Request
- **Button**: Blue edit icon on each row
- **Action**: Modify any field including name and employee ID
- **Changes**: Saved immediately and visible in admin dashboard

### 4. Delete Salary Request
- **Button**: Red trash icon on each row
- **Action**: Removes individual salary request
- **Confirmation**: Asks for confirmation before deleting

### 5. Edit Profile
- **Button**: "Edit Profile" in profile card
- **Fields**:
  - Full Name
  - Employee ID
  - Department
  - Email
  - Current Password (optional)
  - New Password (optional)
  - Confirm Password (optional)

---

## 👨‍💼 ADMIN FEATURES

### Admin Dashboard → Salary Section

#### View Options:
1. **All** - Shows all salary records and requests
2. **Pending Requests** - Shows only pending employee requests
3. **Approved** - Shows approved requests
4. **Rejected** - Shows rejected requests

#### Actions for Pending Requests:
- ✅ **Accept** (Green button) - Approves the request
- ❌ **Reject** (Red button) - Rejects the request
- 🗑️ **Delete** (Gray button) - Removes the request

#### Actions for Approved/Rejected Requests:
- 🗑️ **Delete** - Remove from system

#### Actions for Admin Salary Records:
- ✏️ **Edit** - Modify salary details
- 🗑️ **Delete** - Remove salary record

#### Additional Buttons:
- **Add Salary** - Admin creates salary record directly
- **Refresh Data** - Reload all data from storage
- **Debug Storage** - Check how many records are in storage
- **Employee View** - Test employee submission form

---

## 🔄 DATA FLOW

### Employee Creates Request:
1. Employee fills form with ANY name/ID they want
2. Clicks "Submit"
3. Data saved to `localStorage.salaryRequests`
4. Event dispatched to notify admin dashboard
5. Shows in employee's table as "Pending"

### Admin Sees Request:
1. Admin opens Salary Dashboard
2. Clicks "Refresh Data" if needed
3. Sees request in "Pending Requests" filter
4. Can Accept/Reject/Delete

### Admin Accepts Request:
1. Clicks green "Accept" button
2. Request moved to approved salaries
3. Status changed to "Approved"
4. Shows in "Approved" filter

---

## 💾 STORAGE LOCATIONS

### localStorage Keys:
- `salaryRequests` - All employee salary requests
- `admin_dashboard_salaries` - Admin-created salary records
- `salaryRecords` - Additional salary records
- `user` - Current logged-in user info

---

## 🧪 TESTING STEPS

### Test 1: Clear All Data
1. Click "Clear All Data" button
2. Confirm twice
3. Check: All tables should be empty
4. Check admin dashboard: Should be empty

### Test 2: Create New Request with Custom Name
1. Click "Add Request"
2. Enter:
   - Employee ID: `EMP999`
   - Name: `Mohitha`
   - Email: `mohitha@gmail.com`
   - Department: `IT`
   - Basic Salary: `50000`
   - Allowances: `10000`
   - Deductions: `5000`
3. Click "Submit"
4. Check: Should show in your table as "Pending"
5. Open browser console (F12) - should see logs

### Test 3: Admin Sees Request
1. Go to Admin Dashboard → Salary
2. Click "Refresh Data"
3. Click "Pending Requests" filter
4. Should see Mohitha's request
5. Click "Debug Storage" to verify

### Test 4: Admin Approves Request
1. Find Mohitha's request
2. Click green "Accept" button
3. Check: Status changes to "Approved"
4. Click "Approved" filter - should see it there

### Test 5: Edit Name in Request
1. Click blue edit icon on any request
2. Change name to "Varshi"
3. Change ID to "EMP888"
4. Click "Update"
5. Check: New name shows in table
6. Check admin dashboard: Should show new name

---

## 🐛 DEBUGGING

### If requests don't show in admin dashboard:
1. Open browser console (F12)
2. Click "Refresh Data" in admin dashboard
3. Look for logs: "📥 Loaded salary requests"
4. Click "Debug Storage" button
5. Check the alert shows correct count

### If name changes don't save:
1. Open console (F12)
2. Edit a request
3. Look for logs: "Employee Name in form:", "Updated data to save:"
4. Verify the name is in the logs
5. Check localStorage directly: Application → Local Storage → salaryRequests

### Manual localStorage Check:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('salaryRequests'))
JSON.parse(localStorage.getItem('admin_dashboard_salaries'))
```

---

## ✅ ALL FEATURES WORKING

- ✅ Clear all data (admin + employee)
- ✅ Create salary request with ANY name/ID
- ✅ Edit name and ID in requests
- ✅ Changes show in admin dashboard
- ✅ Admin can accept/reject/delete
- ✅ Real-time updates via events
- ✅ Comprehensive logging for debugging
- ✅ Single delete for individual records
- ✅ Profile editing with password change
- ✅ All fields editable in forms

---

## 📝 NOTES

- All data is stored in browser localStorage
- Clearing browser data will delete all salary records
- Each request has unique ID (timestamp-based)
- Events notify admin dashboard of changes
- Console logs help with debugging
- No backend server required - all client-side

---

## 🎉 SUCCESS!

Your salary management system is now fully functional with:
- Complete employee self-service
- Full admin control
- Flexible name/ID changes
- Clear all data option
- Real-time synchronization
