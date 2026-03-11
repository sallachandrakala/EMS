// ========================================
// COMPLETE SALARY DATA CLEAR SCRIPT
// ========================================
// Copy and paste this entire script into your browser console (F12)
// Then press Enter to execute

console.log('🗑️ Starting complete salary data clear...');

// Step 1: Clear all salary-related localStorage keys
const keysToRemove = [
  'salaryRequests',
  'salaryRecords', 
  'admin_dashboard_salaries',
  'salary_requests',
  'employeeSalaries',
  'adminSalaries'
];

console.log('📦 Removing localStorage keys...');
keysToRemove.forEach(key => {
  const before = localStorage.getItem(key);
  localStorage.removeItem(key);
  const after = localStorage.getItem(key);
  console.log(`  - ${key}: ${before ? 'REMOVED' : 'was already empty'} → ${after === null ? '✅ NULL' : '❌ STILL EXISTS'}`);
});

// Step 2: Verify all keys are removed
console.log('\n🔍 Verification:');
let allCleared = true;
keysToRemove.forEach(key => {
  const value = localStorage.getItem(key);
  if (value !== null) {
    console.log(`  ❌ ${key} still exists:`, value);
    allCleared = false;
  } else {
    console.log(`  ✅ ${key} is null`);
  }
});

// Step 3: Dispatch events to notify all components
console.log('\n📡 Dispatching clear events...');
window.dispatchEvent(new CustomEvent('clearAllSalaryData'));
window.dispatchEvent(new CustomEvent('salaryDataUpdated'));
console.log('  ✅ Events dispatched');

// Step 4: Show results
console.log('\n' + '='.repeat(50));
if (allCleared) {
  console.log('✅ SUCCESS! All salary data has been cleared.');
  console.log('📊 Current storage state:');
  console.log('  - salaryRequests:', localStorage.getItem('salaryRequests'));
  console.log('  - salaryRecords:', localStorage.getItem('salaryRecords'));
  console.log('  - admin_dashboard_salaries:', localStorage.getItem('admin_dashboard_salaries'));
  console.log('\n🔄 Page will reload in 2 seconds...');
  
  // Show alert
  alert('✅ All salary data cleared successfully!\n\nThe page will reload now.');
  
  // Reload page after 2 seconds
  setTimeout(() => {
    location.reload();
  }, 2000);
} else {
  console.error('❌ FAILED! Some data could not be cleared.');
  console.log('Try manually clearing from Application → Local Storage');
}
console.log('='.repeat(50));
