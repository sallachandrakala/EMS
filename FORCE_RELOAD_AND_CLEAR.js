// ============================================
// FORCE RELOAD AND CLEAR - BYPASS CACHE
// ============================================
// This script will:
// 1. Clear all salary data
// 2. Clear browser cache
// 3. Force reload from server
// ============================================

console.clear();
console.log('%c🔥 FORCE RELOAD AND CLEAR SCRIPT', 'background: red; color: white; font-size: 20px; padding: 10px;');

// Step 1: Clear all salary data
console.log('\n📦 STEP 1: Clearing all salary data from localStorage...');
const salaryKeys = [
    'salaryRequests',
    'salaryRecords',
    'admin_dashboard_salaries',
    'salary_requests',
    'employeeSalaries',
    'adminSalaries'
];

salaryKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`  ✅ Removed: ${key}`);
});

// Step 2: Verify cleared
console.log('\n🔍 STEP 2: Verifying removal...');
let allCleared = true;
salaryKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
        console.log(`  ❌ STILL EXISTS: ${key}`);
        allCleared = false;
    } else {
        console.log(`  ✅ NULL: ${key}`);
    }
});

if (allCleared) {
    console.log('\n%c✅ ALL DATA CLEARED!', 'background: green; color: white; font-size: 16px; padding: 5px;');
} else {
    console.log('\n%c❌ SOME DATA STILL EXISTS!', 'background: red; color: white; font-size: 16px; padding: 5px;');
}

// Step 3: Clear service worker cache (if exists)
console.log('\n🗑️ STEP 3: Clearing service worker cache...');
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
            registration.unregister();
            console.log('  ✅ Unregistered service worker');
        });
    });
}

// Step 4: Clear cache storage
console.log('\n🗑️ STEP 4: Clearing cache storage...');
if ('caches' in window) {
    caches.keys().then(names => {
        names.forEach(name => {
            caches.delete(name);
            console.log(`  ✅ Deleted cache: ${name}`);
        });
    });
}

// Step 5: Show alert and reload
console.log('\n🔄 STEP 5: Reloading page...');
console.log('Page will reload in 2 seconds with cache bypass...');

alert('✅ All salary data cleared!\n\n' +
      'Browser cache will be bypassed.\n\n' +
      'Page will reload in 2 seconds.\n\n' +
      'After reload, press Ctrl+Shift+R to ensure fresh load.');

setTimeout(() => {
    console.log('🔄 Reloading NOW with cache bypass...');
    // Force reload bypassing cache
    window.location.reload(true);
}, 2000);
