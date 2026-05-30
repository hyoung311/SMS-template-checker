import { runRuleBasedChecks } from './policyRules.js';

// Test messages covering different violation types
const testMessages = [
  {
    name: 'Loan Solicitation',
    body: 'Get pre-approved for a quick loan today! Fast cash available now.'
  },
  {
    name: 'PHI Violation',
    body: 'Your medical test results show diagnosis of diabetes. Prescription for metformin ready.'
  },
  {
    name: 'Missing Opt-Out',
    body: 'Special offer! 50% off all products this weekend only.'
  },
  {
    name: 'Phishing with Shortened URL',
    body: 'Your account has been suspended. Verify immediately at bit.ly/account123'
  },
  {
    name: 'Clean Message',
    body: 'Your package has been delivered. Reply STOP to unsubscribe.'
  },
  {
    name: 'Debt Collection',
    body: 'You owe $5000 in outstanding debt. Pay now to avoid legal action.'
  },
  {
    name: 'Crypto Scam',
    body: 'Double your crypto in 24 hours! Bitcoin trading opportunity guaranteed returns.'
  }
];

console.log('🧪 Testing Enhanced Rule-Based Checks\n');
console.log('='.repeat(80));

testMessages.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log(`Message: "${test.body}"\n`);

  const results = runRuleBasedChecks(test.body);

  console.log(`📊 Results:`);
  console.log(`   Violations: ${results.violations.length}`);
  console.log(`   Warnings: ${results.warnings.length}`);
  console.log(`   Detected Intents: ${results.intents.join(', ') || 'None'}`);

  if (results.violations.length > 0) {
    console.log(`\n   ⛔ Violations:`);
    results.violations.forEach((v, i) => {
      console.log(`   ${i + 1}. [${v.severity.toUpperCase()}] ${v.description}`);
      if (v.explanation) {
        console.log(`      💡 ${v.explanation}`);
      }
      if (v.sourceLinks && v.sourceLinks.length > 0) {
        console.log(`      🔗 Sources: ${v.sourceLinks.join(', ')}`);
      }
      if (v.matchedKeywords && v.matchedKeywords.length > 0) {
        console.log(`      🎯 Matched: ${v.matchedKeywords.join(', ')}`);
      }
    });
  }

  if (results.warnings.length > 0) {
    console.log(`\n   ⚠️  Warnings:`);
    results.warnings.forEach((w, i) => {
      console.log(`   ${i + 1}. [${w.severity.toUpperCase()}] ${w.description}`);
      if (w.explanation) {
        console.log(`      💡 ${w.explanation}`);
      }
      if (w.sourceLinks && w.sourceLinks.length > 0) {
        console.log(`      🔗 Sources: ${w.sourceLinks.join(', ')}`);
      }
    });
  }

  console.log('\n' + '-'.repeat(80));
});

console.log('\n✅ Test complete!\n');
