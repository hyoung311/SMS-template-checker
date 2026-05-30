import { runRuleBasedChecks } from './policyRules.js';

// Test various finance-related messages
const financeTestMessages = [
  {
    name: 'Direct Loan Offer',
    body: 'You are approved for a $5,000 loan! Apply today.'
  },
  {
    name: 'Credit Card Offer',
    body: 'Apply for credit card with low interest rates. Get approved instantly!'
  },
  {
    name: 'Investment Opportunity',
    body: 'Open an investment account today. Start building your portfolio.'
  },
  {
    name: 'Financial Services',
    body: 'Need financial advice? Our financial consultants can help with wealth management.'
  },
  {
    name: 'Financing Available',
    body: 'Financing available for your purchase. Pay over time with low APR.'
  },
  {
    name: 'Money Transfer',
    body: 'Send money to friends instantly. Transfer funds with no fees.'
  },
  {
    name: 'Banking Account',
    body: 'Open a savings account today. High interest rates on all balances.'
  },
  {
    name: 'Trading Platform',
    body: 'Join our forex trading platform. Investment opportunity with guaranteed returns.'
  },
  {
    name: 'Credit Score Service',
    body: 'Check your credit score for free. Get your credit report instantly.'
  },
  {
    name: 'Generic Finance',
    body: 'Financial services available. Contact us for financial planning assistance.'
  },
  {
    name: 'Clean Non-Finance',
    body: 'Your order has shipped! Track your package at example.com. Reply STOP to opt out.'
  }
];

console.log('🧪 Testing Finance-Related Rule\n');
console.log('='.repeat(80));

financeTestMessages.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log(`Message: "${test.body}"\n`);

  const results = runRuleBasedChecks(test.body);

  const financeViolation = results.violations.find(v =>
    v.intentName === 'financeRelated' ||
    v.intentName === 'loanSolicitation' ||
    v.category === 'forbidden_intent'
  );

  if (financeViolation) {
    console.log(`   ❌ FINANCE-RELATED DETECTED`);
    console.log(`   Severity: ${financeViolation.severity.toUpperCase()}`);
    console.log(`   Description: ${financeViolation.description}`);
    if (financeViolation.matchedKeywords && financeViolation.matchedKeywords.length > 0) {
      console.log(`   Matched Keywords: ${financeViolation.matchedKeywords.join(', ')}`);
    }
    if (financeViolation.matchedPatterns > 0) {
      console.log(`   Matched Patterns: ${financeViolation.matchedPatterns}`);
    }
  } else {
    console.log(`   ✅ No finance violation detected`);
  }

  console.log(`   Total Violations: ${results.violations.length}`);
  console.log(`   Total Warnings: ${results.warnings.length}`);
  console.log(`   Detected Intents: ${results.intents.join(', ') || 'None'}`);

  console.log('\n' + '-'.repeat(80));
});

console.log('\n✅ Finance rule test complete!\n');
