# SMS Compliance Checker

A web application that checks SMS message content against Twilio's messaging policies, US regulatory guidelines (TCPA, CTIA, HIPAA, PCI-DSS), and acceptable use policies. Uses a hybrid approach combining extensive rule-based checks with AI-powered analysis. This is an unofficial compliance tool that can be cloned to use as a starting point for compliance checks for SMS bodies prior to sending if a user wants to understand the likelihood that their message would be noncompliant. 

## 🚀 Key Features

### **Enhanced Compliance Detection**
- **Intent Detection System** - Automatically identifies the purpose of messages (loan solicitation, debt collection, crypto scams, etc.)
- **Forbidden Use Case Detection** - Flags prohibited intents like payday loans, credit repair schemes, MLM recruitment
- **13 Prohibited Content Categories** - SHAFT compliance, pharmaceuticals, financial scams, crypto scams, malware
- **10 Regulatory Patterns** - TCPA, HIPAA, PCI-DSS, GDPR, A2P 10DLC compliance

### **Detailed Risk Analysis**
- **Risk Explanations** - Clear explanation of why each issue matters
- **Penalty Information** - Specific fines and consequences (e.g., "up to $1,500 per TCPA violation")
- **Source Documentation** - Clickable links to official regulations and guidelines
- **Detected Intent Display** - Shows what the system thinks the message is trying to do

### **User-Friendly Interface**
- **"Get Compliant Rewrite" Button** - One-click access to compliant alternative versions
- **Expandable Explanations** - Detailed context for each violation
- **Learn More Links** - Direct links to FCC, Twilio, HIPAA, CFPB documentation
- **Visual Risk Indicators** - Color-coded severity levels with explanations

### **Hybrid Analysis Engine**
  - Rule-based checks for instant feedback on common violations
  - AI-powered nuanced policy analysis using Claude API
  - Combined recommendations and comprehensive risk assessment

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Anthropic API key (get one at https://console.anthropic.com/)

### Installation

1. **Clone and navigate to the project**
```bash
cd twilio-sms-compliance-checker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
```

4. **Start the server**
```bash
npm run dev
```

5. **Open the web app**

Open `index.html` in your browser, or serve it with:
```bash
# Using Python
python3 -m http.server 8000

# Then visit http://localhost:8000
```

The API will be running at `http://localhost:3001`

## Usage

### Web Interface

1. Open `index.html` in your browser
2. Paste your SMS message in the text area
3. Click "Check Compliance"
4. Review the comprehensive analysis:
   - **Compliance Status**: ✅ Compliant / ⚠️ Warning / ❌ Non-Compliant
   - **Risk Level**: Low / Medium / High / Critical with detailed explanation
   - **Detected Intent**: What the system thinks the message is trying to do
   - **Violations**: Each issue with:
     - Severity level (Critical / High / Medium / Low)
     - Detailed explanation of why it's a problem
     - Specific penalties and consequences
     - "Learn More" links to official documentation
     - Matched keywords that triggered the violation
   - **Warnings**: Lower-severity concerns with explanations
   - **Recommendations**: Specific suggestions for fixes
5. Click **"Get Compliant Rewrite"** to see a fully compliant alternative version

### API Usage

**Endpoint:** `POST /api/check-compliance`

**Request:**
```json
{
  "messageBody": "Your SMS message text here"
}
```

**Response:**
```json
{
  "messageBody": "Your SMS message text here",
  "messageLength": 27,
  "segmentCount": 1,
  "timestamp": "2026-05-29T10:00:00.000Z",
  "ruleBasedChecks": {
    "violations": [],
    "warnings": []
  },
  "aiAnalysis": {
    "isCompliant": true,
    "overallRisk": "low",
    "issues": [],
    "recommendations": []
  },
  "summary": {
    "overallStatus": "compliant",
    "riskLevel": "low",
    "totalIssues": 0,
    "totalWarnings": 0,
    "recommendations": [],
    "rewrittenMessage": null
  }
}
```

### Example: Test with a non-compliant message

**Loan Solicitation Detection:**
```bash
curl -X POST http://localhost:3001/api/check-compliance \
  -H "Content-Type: application/json" \
  -d '{
    "messageBody": "Get pre-approved for a quick loan today! Fast cash available."
  }'
```

**Example Response:**
```json
{
  "summary": {
    "overallStatus": "non-compliant",
    "riskLevel": "critical",
    "detectedIntents": ["loanSolicitation"]
  },
  "ruleBasedChecks": {
    "violations": [
      {
        "category": "forbidden_intent",
        "intentName": "loanSolicitation",
        "description": "Loan solicitation detected - FORBIDDEN use case",
        "explanation": "Loan solicitation, especially payday loans and unsolicited loan offers, is a prohibited use case. This violates Twilio AUP and CFPB regulations. Account suspension will likely result.",
        "sourceLinks": [
          "https://www.twilio.com/en-us/legal/aup",
          "https://www.consumerfinance.gov/"
        ],
        "matchedKeywords": ["quick loan", "fast cash"],
        "severity": "critical"
      }
    ]
  }
}
```

**More Test Examples:**
```bash
# Test PHI/HIPAA violation
curl -X POST http://localhost:3001/api/check-compliance \
  -H "Content-Type: application/json" \
  -d '{"messageBody": "Your diagnosis results are ready. Prescription for metformin available."}'

# Test crypto scam detection
curl -X POST http://localhost:3001/api/check-compliance \
  -H "Content-Type: application/json" \
  -d '{"messageBody": "Double your Bitcoin in 24 hours! Guaranteed returns on crypto investment."}'

# Test clean compliant message
curl -X POST http://localhost:3001/api/check-compliance \
  -H "Content-Type: application/json" \
  -d '{"messageBody": "Your package has been delivered. Reply STOP to unsubscribe. -Acme Corp"}'
```

## Project Structure

```
twilio-sms-compliance-checker/
├── server.js           # Express API server
├── policyRules.js      # Rule-based compliance checks
├── aiAnalyzer.js       # Claude AI integration
├── index.html          # React frontend (via CDN)
├── package.json        # Dependencies
├── .env.example        # Environment template
└── README.md           # This file
```

## 📋 Comprehensive Policy Coverage

### Prohibited Content (13 Categories)
- **SHAFT Compliance**: Sex, Hate, Alcohol, Firearms, Tobacco
- **Cannabis/Marijuana**: THC, CBD, dispensaries
- **Pharmaceuticals**: Prescription drugs, controlled substances
- **Deceptive Practices**: False urgency, misleading claims
- **Phishing**: Account compromise attempts, credential theft
- **Financial Scams**: Wire fraud, money laundering
- **Crypto Scams**: Investment fraud, "double your crypto"
- **Malware**: Security threats, malicious software

### Forbidden Use Cases (Intent Detection)
- ✋ **Loan Solicitation**: Payday loans, quick cash offers
- ✋ **Debt Collection**: FDCPA compliance required
- ✋ **Lead Generation**: Financial products without consent
- ✋ **Credit Repair**: "Fix your credit" schemes
- ✋ **MLM Recruitment**: Pyramid schemes, work-from-home scams
- ✋ **Get-Rich-Quick**: Guaranteed income schemes
- ✋ **Stock Manipulation**: Stock tips, insider trading
- ✋ **Crypto Investment**: Unsolicited crypto opportunities
- ⚠️ **Insurance/Mortgage**: Requires proper licensing

### Regulatory Requirements (10 Patterns)
- **TCPA Compliance**: Opt-out instructions, frequency disclosure
- **HIPAA Protection**: No PHI (Protected Health Information)
- **PCI-DSS**: No credit card numbers or SSNs
- **GDPR**: European privacy compliance
- **Sender Identification**: Clear company identification
- **A2P 10DLC**: High-volume messaging registration
- **Timing Guidelines**: Reasonable hours (8AM-9PM)
- **Shortened URLs**: Carrier filtering concerns

### Source Documentation
Every violation includes links to:
- 🔗 Twilio Acceptable Use Policy
- 🔗 FCC TCPA Guidelines
- 🔗 CTIA Best Practices
- 🔗 HIPAA/HHS Regulations
- 🔗 CFPB Financial Services
- 🔗 Fair Debt Collection Practices Act
- 🔗 PCI Security Standards
- 🔗 GDPR Documentation

## Architecture

The application uses a **hybrid approach** for maximum accuracy:

1. **Rule-Based Checks** (Fast, Deterministic)
   - Pattern matching for known violations
   - Keyword detection
   - Structural requirements (opt-out, URLs)

2. **AI Analysis** (Nuanced, Context-Aware)
   - Uses Claude Sonnet 4.6 with prompt caching
   - Understands context and intent
   - Generates compliant rewrites
   - Provides detailed explanations

3. **Combined Results**
   - Merges both analyses
   - Prioritizes critical issues
   - Provides actionable recommendations

## Development

### Run in development mode
```bash
npm run dev
```

### Environment Variables
- `ANTHROPIC_API_KEY` - Your Anthropic API key (required for AI analysis)
- `PORT` - Server port (default: 3001)

### Adding New Policy Rules

Edit `policyRules.js` to add new rule-based checks:

```javascript
export const PROHIBITED_CONTENT = {
  yourNewCategory: {
    keywords: ['keyword1', 'keyword2'],
    description: 'Description of the violation'
  }
};
```

### Customizing AI Analysis

Edit the `TWILIO_POLICIES` constant in `aiAnalyzer.js` to update the policy context sent to Claude.

## Limitations

- Rule-based checks may have false positives
- AI analysis requires an API key and internet connection
- Maximum message length: 1600 characters
- Does not validate phone numbers or sender IDs
- Does not check actual consent records

## Future Enhancements

- [ ] Save analysis history
- [ ] Batch message checking
- [ ] Export reports (PDF/CSV)
- [ ] Industry-specific templates
- [ ] Integration with Twilio API
- [ ] Message testing with actual sends
- [ ] A/B testing suggestions

## License

MIT

## Support

For issues or questions:
- Check Twilio's official documentation: https://www.twilio.com/docs/messaging/compliance
- Review CTIA guidelines: https://www.ctia.org/
- Consult with legal counsel for compliance questions

---

Built with Node.js, Express, React, and Claude AI
