import { runRuleBasedChecks } from './policyRules.js';

console.log('🧪 Testing Expanded SHAFT Keywords\n');
console.log('═'.repeat(80));

const shaftTests = [
  {
    category: 'Cannabis',
    tests: [
      { msg: 'Buy THC gummies from our dispensary', shouldFlag: true },
      { msg: 'Cannabis edibles delivery in 30 minutes', shouldFlag: true },
      { msg: 'Delta-8 products available now', shouldFlag: true },
      { msg: 'Medical marijuana consultation', shouldFlag: true },
      { msg: 'I hate this cannabis of a situation', shouldFlag: false } // False positive check
    ]
  },
  {
    category: 'Adult Content (Sex)',
    tests: [
      { msg: 'Check out our OnlyFans exclusive content', shouldFlag: true },
      { msg: 'Escort services available 24/7', shouldFlag: true },
      { msg: 'Adult entertainment tonight', shouldFlag: true },
      { msg: 'Webcam girls live now', shouldFlag: true },
      { msg: 'Adult education classes starting soon', shouldFlag: false } // False positive check
    ]
  },
  {
    category: 'Gambling',
    tests: [
      { msg: 'Bet on sports online with our app', shouldFlag: true },
      { msg: 'Online casino bonus for new players', shouldFlag: true },
      { msg: 'Daily fantasy sports - place your bet', shouldFlag: true },
      { msg: 'Live betting available now', shouldFlag: true },
      { msg: 'I bet you will love this product', shouldFlag: false } // False positive check
    ]
  },
  {
    category: 'Hate Speech',
    tests: [
      { msg: 'White supremacy rally this weekend', shouldFlag: true },
      { msg: 'Neo-nazi propaganda materials', shouldFlag: true },
      { msg: 'Hate group meeting tonight', shouldFlag: true },
      { msg: 'I hate Mondays so much', shouldFlag: false } // False positive check
    ]
  },
  {
    category: 'Alcohol',
    tests: [
      { msg: 'Beer delivery in 30 minutes', shouldFlag: true },
      { msg: 'Buy whiskey online - liquor sale', shouldFlag: true },
      { msg: 'Alcohol delivery service available', shouldFlag: true },
      { msg: 'Wine sale this weekend only', shouldFlag: true },
      { msg: 'Rubbing alcohol for first aid', shouldFlag: false } // False positive check
    ]
  },
  {
    category: 'Firearms',
    tests: [
      { msg: 'AR-15 rifles for sale', shouldFlag: true },
      { msg: 'Buy ammo and bullets cheap', shouldFlag: true },
      { msg: 'Gun dealer - firearms available', shouldFlag: true },
      { msg: 'Ammunition sale this weekend', shouldFlag: true },
      { msg: 'Shot of espresso to start your day', shouldFlag: false } // False positive check
    ]
  },
  {
    category: 'Tobacco',
    tests: [
      { msg: 'Juul pods and vape juice available', shouldFlag: true },
      { msg: 'Buy cigarettes online - tobacco delivery', shouldFlag: true },
      { msg: 'Vape shop grand opening', shouldFlag: true },
      { msg: 'Disposable vape sale', shouldFlag: true },
      { msg: 'Tobacco Road restaurant menu', shouldFlag: true } // May flag - acceptable
    ]
  }
];

let totalTests = 0;
let passed = 0;
let failed = 0;

shaftTests.forEach(({ category, tests }) => {
  console.log(`\n📋 ${category.toUpperCase()}`);
  console.log('─'.repeat(80));

  tests.forEach(({ msg, shouldFlag }) => {
    totalTests++;
    const results = runRuleBasedChecks(msg);
    const flagged = results.violations.some(v =>
      v.category === 'prohibited_content' || v.subcategory
    );

    const testPassed = flagged === shouldFlag;
    if (testPassed) {
      passed++;
      console.log(`  ${shouldFlag ? '✅' : '✅'} "${msg.substring(0, 50)}${msg.length > 50 ? '...' : ''}"`);
      if (flagged && results.violations[0]) {
        console.log(`     └─ Detected: ${results.violations[0].subcategory || results.violations[0].description}`);
      }
    } else {
      failed++;
      console.log(`  ❌ "${msg.substring(0, 50)}${msg.length > 50 ? '...' : ''}"`);
      console.log(`     └─ Expected: ${shouldFlag ? 'FLAGGED' : 'NOT FLAGGED'}, Got: ${flagged ? 'FLAGGED' : 'NOT FLAGGED'}`);
    }
  });
});

console.log('\n' + '═'.repeat(80));
console.log(`\n📊 RESULTS: ${passed}/${totalTests} tests passed (${failed} failed)`);
console.log(`   Success Rate: ${((passed/totalTests) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 All SHAFT tests passed!\n');
} else {
  console.log(`\n⚠️  ${failed} test(s) need attention\n`);
}
