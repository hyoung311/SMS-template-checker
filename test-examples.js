// Test examples for the SMS compliance checker
// Run these against the API to see how different messages are analyzed

export const TEST_MESSAGES = {
  compliant: {
    marketing: `Hi! Thanks for signing up for updates from Acme Co. We'll send you weekly deals. Reply STOP to unsubscribe. Msg&data rates may apply.`,
    transactional: `Your order #12345 has shipped! Track it here: https://acme.com/track/abc123. Questions? Call 1-800-555-0100.`,
    appointment: `Reminder: Your appointment with Dr. Smith is tomorrow at 2 PM. Reply YES to confirm or call 555-0100 to reschedule.`
  },

  nonCompliant: {
    missingOptOut: `Buy now and save 50%! Limited time offer. Visit our store today.`,
    gambling: `Join our poker tournament tonight! Huge cash prizes. Sign up at casino.com`,
    cannabis: `New CBD oil products in stock! High quality THC-free options available.`,
    urgency: `URGENT! ACT NOW!!! Your account will be suspended. Click here IMMEDIATELY: bit.ly/act123`,
    phishing: `Your bank account has been suspended. Verify your identity now to avoid closure: bit.ly/verify`,
    adultContent: `XXX Adult entertainment services available 24/7. Discreet billing.`,
    deceptive: `CONGRATULATIONS!!! You WON $1000!!! Claim your prize NOW before it expires!!!`,
    poorFormatting: `BUY NOW!!! HUGE SAVINGS!!! DON'T MISS OUT!!! LIMITED TIME ONLY!!!`
  },

  warnings: {
    shortenedUrl: `Check out our latest deals at bit.ly/deals123. Great savings!`,
    excessiveCaps: `SALE TODAY ONLY! EVERYTHING MUST GO! INCREDIBLE PRICES!`,
    multipleExclamations: `Amazing deals!!! Don't miss out!! Shop now!!!`
  }
};

// Test runner
async function runTests() {
  const baseUrl = 'http://localhost:3001';

  console.log('Testing SMS Compliance Checker API\n');
  console.log('=' .repeat(60));

  for (const [category, messages] of Object.entries(TEST_MESSAGES)) {
    console.log(`\n${category.toUpperCase()} MESSAGES:\n`);

    for (const [name, message] of Object.entries(messages)) {
      console.log(`Testing: ${name}`);
      console.log(`Message: "${message.substring(0, 60)}..."`);

      try {
        const response = await fetch(`${baseUrl}/api/check-compliance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageBody: message })
        });

        const result = await response.json();

        console.log(`Status: ${result.summary.overallStatus}`);
        console.log(`Risk Level: ${result.summary.riskLevel}`);
        console.log(`Issues: ${result.summary.totalIssues}`);
        console.log(`Warnings: ${result.summary.totalWarnings}`);

        if (result.summary.recommendations.length > 0) {
          console.log('Top recommendation:', result.summary.recommendations[0].suggestion);
        }

      } catch (error) {
        console.log(`Error: ${error.message}`);
      }

      console.log('-'.repeat(60));
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}
