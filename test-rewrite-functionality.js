// Test the rewrite functionality end-to-end

const testMessages = [
  {
    name: 'Message with style issues only (should rewrite)',
    body: 'AMAZING SALE!!! BUY NOW at bit.ly/sale123'
  },
  {
    name: 'Message with missing opt-out (should rewrite)',
    body: 'Special offer on all products this weekend!'
  },
  {
    name: 'Finance-related message (should NOT rewrite)',
    body: 'Get approved for a $5,000 loan today! Low interest rates.'
  },
  {
    name: 'Prohibited content (should NOT rewrite)',
    body: 'Check out our casino games! Win big with gambling!'
  },
  {
    name: 'Clean message (no rewrite needed)',
    body: 'Your package has been delivered. Reply STOP to unsubscribe. -Acme Corp'
  }
];

console.log('🧪 Testing Rewrite Functionality\n');
console.log('='.repeat(80));

for (const test of testMessages) {
  console.log(`\n📝 ${test.name}`);
  console.log(`Message: "${test.body}"\n`);

  const response = await fetch('http://localhost:3001/api/check-compliance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageBody: test.body })
  });

  const data = await response.json();
  const summary = data.summary;

  console.log(`Status: ${summary.overallStatus.toUpperCase()}`);
  console.log(`Risk Level: ${summary.riskLevel.toUpperCase()}`);
  console.log(`Issues: ${summary.totalIssues}, Warnings: ${summary.totalWarnings}`);

  if (summary.detectedIntents && summary.detectedIntents.length > 0) {
    console.log(`Detected Intents: ${summary.detectedIntents.join(', ')}`);
  }

  console.log(`\n${summary.rewrittenMessage ? '✅' : '❌'} Rewrite Available: ${summary.rewrittenMessage ? 'YES' : 'NO'}`);

  if (summary.rewrittenMessage) {
    console.log(`\n✨ REWRITE:\n"${summary.rewrittenMessage}"`);
    if (summary.rewriteExplanation) {
      console.log(`\n💡 ${summary.rewriteExplanation}`);
    }
  } else if (summary.rewriteExplanation) {
    console.log(`\n⚠️  REASON:\n${summary.rewriteExplanation}`);
  }

  console.log('\n' + '-'.repeat(80));
}

console.log('\n✅ Rewrite functionality test complete!\n');
