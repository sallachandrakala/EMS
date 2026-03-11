// ============================================
// FORCE CLEAR ALL SALARY DATA
// ============================================
// INSTRUCTIONS:
// 1. Open your app in browser
// 2. Press F12 to open console
// 3. Copy this ENTIRE file
// 4. Paste into console
// 5. Press Enter
// ============================================

(function() {
    console.log('%c🗑️ FORCE CLEAR SALARY DATA SCRIPT', 'background: red; color: white; font-size: 20px; padding: 10px;');
    console.log('Starting aggressive clear...\n');

    // All possible salary-related keys
    const salaryKeys = [
        'salaryRequests',
        'salaryRecords',
        'admin_dashboard_salaries',
        'salary_requests',
        'employeeSalaries',
        'adminSalaries',
        'salaries',
        'salary',
        'employee_salaries',
        'admin_salaries'
    ];

    console.log('📦 STEP 1: Checking current storage...');
    let totalFound = 0;
    salaryKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                const parsed = JSON.parse(value);
                const count = Array.isArray(parsed) ? parsed.length : 1;
                console.log(`  ❌ ${key}: ${count} records`);
                totalFound += count;
            } catch (e) {
                console.log(`  ❌ ${key}: EXISTS`);
                totalFound++;
            }
        }
    });
    console.log(`  Total records found: ${totalFound}\n`);

    if (totalFound === 0) {
        console.log('%c✅ NO SALARY DATA FOUND!', 'background: green; color: white; font-size: 16px; padding: 5px;');
        console.log('Storage is already clean. If you still see data, it might be:');
        console.log('1. Cached in browser - try hard refresh (Ctrl+Shift+R)');
        console.log('2. Coming from API - check network tab');
        console.log('3. Hardcoded in code - check employeeData.js');
        return;
    }

    console.log('🗑️ STEP 2: Removing all salary keys...');
    salaryKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`  ✅ Removed: ${key}`);
    });

    console.log('\n🔍 STEP 3: Verifying removal...');
    let stillExists = 0;
    salaryKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
            console.log(`  ❌ STILL EXISTS: ${key}`);
            stillExists++;
        }
    });

    if (stillExists === 0) {
        console.log('%c✅ VERIFICATION PASSED!', 'background: green; color: white; font-size: 16px; padding: 5px;');
        console.log('All salary data has been removed from localStorage.\n');
    } else {
        console.log('%c❌ VERIFICATION FAILED!', 'background: red; color: white; font-size: 16px; padding: 5px;');
        console.log(`${stillExists} keys could not be removed.\n`);
    }

    console.log('📊 STEP 4: Checking all localStorage keys...');
    console.log('All keys in localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (key.toLowerCase().includes('salary') || key.toLowerCase().includes('salaries')) {
            console.log(`  ⚠️ FOUND: ${key} = ${value.substring(0, 50)}...`);
        }
    }

    console.log('\n🔄 STEP 5: Dispatching clear events...');
    try {
        window.dispatchEvent(new CustomEvent('clearAllSalaryData'));
        window.dispatchEvent(new CustomEvent('salaryDataUpdated'));
        console.log('  ✅ Events dispatched');
    } catch (e) {
        console.log('  ⚠️ Could not dispatch events:', e.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('%c🎉 CLEAR COMPLETE!', 'background: green; color: white; font-size: 20px; padding: 10px;');
    console.log('='.repeat(60));
    console.log('\nNEXT STEPS:');
    console.log('1. The page will reload in 3 seconds');
    console.log('2. After reload, check if Monthly Salary shows $0');
    console.log('3. If still showing old data, try:');
    console.log('   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)');
    console.log('   - Clear browser cache');
    console.log('   - Open in incognito/private mode');
    console.log('\n');

    // Show alert
    alert('✅ All salary data cleared from localStorage!\n\nPage will reload in 3 seconds.\n\nCheck console (F12) for details.');

    // Reload after 3 seconds
    let countdown = 3;
    const interval = setInterval(() => {
        console.log(`Reloading in ${countdown}...`);
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            console.log('🔄 Reloading now...');
            window.location.reload();
        }
    }, 1000);
})();
