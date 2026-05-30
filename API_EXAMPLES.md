# API Examples

Complete request/response examples for the compliance checker API.

## Endpoint

```
POST http://localhost:3001/api/check-compliance
Content-Type: application/json
```

---

## Example 1: Compliant Marketing Message

### Request
```json
{
  "messageBody": "Hi! Thanks for signing up for updates from Acme Co. We'll send you weekly deals. Reply STOP to unsubscribe. Msg&data rates may apply."
}
```

### Response
```json
{
  "messageBody": "Hi! Thanks for signing up for updates from Acme Co. We'll send you weekly deals. Reply STOP to unsubscribe. Msg&data rates may apply.",
  "messageLength": 139,
  "segmentCount": 1,
  "timestamp": "2026-05-29T12:00:00.000Z",
  "ruleBasedChecks": {
    "violations": [],
    "warnings": []
  },
  "aiAnalysis": {
    "isCompliant": true,
    "overallRisk": "low",
    "issues": [],
    "recommendations": [],
    "rewrittenMessage": null
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

---

## Example 2: Missing Opt-Out (High Priority)

### Request
```json
{
  "messageBody": "Buy now and save 50%! Limited time offer. Visit our store today."
}
```

### Response
```json
{
  "messageBody": "Buy now and save 50%! Limited time offer. Visit our store today.",
  "messageLength": 68,
  "segmentCount": 1,
  "timestamp": "2026-05-29T12:00:00.000Z",
  "ruleBasedChecks": {
    "violations": [
      {
        "category": "regulatory",
        "checkName": "missingOptOut",
        "description": "Missing opt-out instructions (required for marketing messages)",
        "severity": "high"
      }
    ],
    "warnings": []
  },
  "aiAnalysis": {
    "isCompliant": false,
    "overallRisk": "high",
    "issues": [
      {
        "category": "TCPA Compliance",
        "severity": "high",
        "description": "Marketing message lacks required opt-out mechanism",
        "policyReference": "TCPA requires clear opt-out instructions for all marketing SMS"
      },
      {
        "category": "Best Practices",
        "severity": "medium",
        "description": "Urgency language may reduce deliverability",
        "policyReference": "Carriers filter messages with urgency tactics"
      }
    ],
    "recommendations": [
      {
        "issue": "Missing opt-out instructions",
        "suggestion": "Add 'Reply STOP to unsubscribe' at the end of the message",
        "rewriteExample": "Buy now and save 50%! Visit our store today. Reply STOP to opt-out."
      },
      {
        "issue": "Urgency-based language",
        "suggestion": "Consider softening 'Limited time' to be more informational",
        "rewriteExample": "Save 50% on select items this week!"
      }
    ],
    "rewrittenMessage": "Save 50% on select items! Visit our store today. From Acme Co. Reply STOP to unsubscribe. Msg rates may apply."
  },
  "summary": {
    "overallStatus": "non-compliant",
    "riskLevel": "high",
    "totalIssues": 3,
    "totalWarnings": 0,
    "recommendations": [
      {
        "source": "rule-based",
        "issue": "Missing opt-out instructions (required for marketing messages)",
        "suggestion": "Add opt-out instructions like \"Reply STOP to unsubscribe\" at the end of your message."
      },
      {
        "source": "ai",
        "issue": "Missing opt-out instructions",
        "suggestion": "Add 'Reply STOP to unsubscribe' at the end of the message",
        "rewriteExample": "Buy now and save 50%! Visit our store today. Reply STOP to opt-out."
      },
      {
        "source": "ai",
        "issue": "Urgency-based language",
        "suggestion": "Consider softening 'Limited time' to be more informational",
        "rewriteExample": "Save 50% on select items this week!"
      }
    ],
    "rewrittenMessage": "Save 50% on select items! Visit our store today. From Acme Co. Reply STOP to unsubscribe. Msg rates may apply."
  }
}
```

---

## Example 3: Prohibited Content (Critical)

### Request
```json
{
  "messageBody": "Join our poker tournament tonight! Huge cash prizes. Sign up at casino.com"
}
```

### Response
```json
{
  "messageBody": "Join our poker tournament tonight! Huge cash prizes. Sign up at casino.com",
  "messageLength": 83,
  "segmentCount": 1,
  "timestamp": "2026-05-29T12:00:00.000Z",
  "ruleBasedChecks": {
    "violations": [
      {
        "category": "prohibited_content",
        "subcategory": "gambling",
        "description": "Gambling services",
        "matchedKeywords": ["casino", "poker"],
        "severity": "critical"
      },
      {
        "category": "regulatory",
        "checkName": "missingOptOut",
        "description": "Missing opt-out instructions (required for marketing messages)",
        "severity": "high"
      }
    ],
    "warnings": []
  },
  "aiAnalysis": {
    "isCompliant": false,
    "overallRisk": "critical",
    "issues": [
      {
        "category": "Prohibited Content",
        "severity": "critical",
        "description": "Gambling-related content violates Twilio's Acceptable Use Policy",
        "policyReference": "AUP Section 4.2 - Gambling services are prohibited"
      },
      {
        "category": "SHAFT Violation",
        "severity": "critical",
        "description": "Message promotes gambling, part of prohibited SHAFT content",
        "policyReference": "Twilio prohibits Sex, Hate, Alcohol, Firearms, and Tobacco content"
      }
    ],
    "recommendations": [
      {
        "issue": "Gambling content",
        "suggestion": "Remove all gambling-related content. Consider an alternative message type.",
        "rewriteExample": "This type of content cannot be sent via Twilio SMS"
      }
    ],
    "rewrittenMessage": null
  },
  "summary": {
    "overallStatus": "non-compliant",
    "riskLevel": "critical",
    "totalIssues": 4,
    "totalWarnings": 0,
    "recommendations": [
      {
        "source": "rule-based",
        "issue": "Gambling services",
        "suggestion": "Remove references to Gambling services. This content violates Twilio's Acceptable Use Policy."
      },
      {
        "source": "rule-based",
        "issue": "Missing opt-out instructions (required for marketing messages)",
        "suggestion": "Add opt-out instructions like \"Reply STOP to unsubscribe\" at the end of your message."
      },
      {
        "source": "ai",
        "issue": "Gambling content",
        "suggestion": "Remove all gambling-related content. Consider an alternative message type.",
        "rewriteExample": "This type of content cannot be sent via Twilio SMS"
      }
    ],
    "rewrittenMessage": null
  }
}
```

---

## Example 4: Multiple Warnings (Low Risk)

### Request
```json
{
  "messageBody": "CHECK OUT our AMAZING DEALS!!! Visit bit.ly/sale123 NOW!!!"
}
```

### Response
```json
{
  "messageBody": "CHECK OUT our AMAZING DEALS!!! Visit bit.ly/sale123 NOW!!!",
  "messageLength": 59,
  "segmentCount": 1,
  "timestamp": "2026-05-29T12:00:00.000Z",
  "ruleBasedChecks": {
    "violations": [
      {
        "category": "regulatory",
        "checkName": "missingOptOut",
        "description": "Missing opt-out instructions (required for marketing messages)",
        "severity": "high"
      }
    ],
    "warnings": [
      {
        "category": "regulatory",
        "checkName": "shortenedUrls",
        "description": "Shortened URLs (discouraged by carriers, can be blocked)",
        "severity": "medium"
      },
      {
        "category": "regulatory",
        "checkName": "excessiveCaps",
        "description": "Excessive use of capital letters",
        "severity": "low"
      },
      {
        "category": "regulatory",
        "checkName": "multipleExclamations",
        "description": "Multiple exclamation marks (spam indicator)",
        "severity": "low"
      }
    ]
  },
  "aiAnalysis": {
    "isCompliant": false,
    "overallRisk": "medium",
    "issues": [
      {
        "category": "Deliverability",
        "severity": "high",
        "description": "Multiple spam indicators present - likely to be filtered",
        "policyReference": "Carrier spam filters target excessive caps, punctuation, and shortened URLs"
      },
      {
        "category": "Best Practices",
        "severity": "medium",
        "description": "Message formatting reduces professionalism and trust",
        "policyReference": "CTIA Short Code Monitoring guidelines"
      }
    ],
    "recommendations": [
      {
        "issue": "Excessive capitalization and punctuation",
        "suggestion": "Use normal sentence case and reduce exclamation marks to one or none",
        "rewriteExample": "Check out our amazing deals! Visit our website today."
      },
      {
        "issue": "Shortened URL",
        "suggestion": "Use your full domain name for better trust and deliverability",
        "rewriteExample": "Visit deals.yourcompany.com/spring-sale"
      },
      {
        "issue": "Missing opt-out",
        "suggestion": "Add compliant opt-out language",
        "rewriteExample": "Reply STOP to unsubscribe"
      }
    ],
    "rewrittenMessage": "Check out our amazing deals! Visit deals.acme.com/sale Reply STOP to opt-out. Msg&data rates apply."
  },
  "summary": {
    "overallStatus": "non-compliant",
    "riskLevel": "medium",
    "totalIssues": 3,
    "totalWarnings": 3,
    "recommendations": [
      {
        "source": "rule-based",
        "issue": "Missing opt-out instructions (required for marketing messages)",
        "suggestion": "Add opt-out instructions like \"Reply STOP to unsubscribe\" at the end of your message."
      },
      {
        "source": "ai",
        "issue": "Excessive capitalization and punctuation",
        "suggestion": "Use normal sentence case and reduce exclamation marks to one or none",
        "rewriteExample": "Check out our amazing deals! Visit our website today."
      },
      {
        "source": "ai",
        "issue": "Shortened URL",
        "suggestion": "Use your full domain name for better trust and deliverability",
        "rewriteExample": "Visit deals.yourcompany.com/spring-sale"
      },
      {
        "source": "ai",
        "issue": "Missing opt-out",
        "suggestion": "Add compliant opt-out language",
        "rewriteExample": "Reply STOP to unsubscribe"
      }
    ],
    "rewrittenMessage": "Check out our amazing deals! Visit deals.acme.com/sale Reply STOP to opt-out. Msg&data rates apply."
  }
}
```

---

## Example 5: Transactional Message (Compliant)

### Request
```json
{
  "messageBody": "Your order #12345 has shipped! Track it here: https://acme.com/track/abc123. Questions? Call 1-800-555-0100."
}
```

### Response
```json
{
  "messageBody": "Your order #12345 has shipped! Track it here: https://acme.com/track/abc123. Questions? Call 1-800-555-0100.",
  "messageLength": 117,
  "segmentCount": 1,
  "timestamp": "2026-05-29T12:00:00.000Z",
  "ruleBasedChecks": {
    "violations": [],
    "warnings": []
  },
  "aiAnalysis": {
    "isCompliant": true,
    "overallRisk": "low",
    "issues": [],
    "recommendations": [
      {
        "issue": "Transactional best practice",
        "suggestion": "Consider adding company name for clarity",
        "rewriteExample": "Your Acme Co order #12345 has shipped!"
      }
    ],
    "rewrittenMessage": null
  },
  "summary": {
    "overallStatus": "compliant",
    "riskLevel": "low",
    "totalIssues": 0,
    "totalWarnings": 0,
    "recommendations": [
      {
        "source": "ai",
        "issue": "Transactional best practice",
        "suggestion": "Consider adding company name for clarity",
        "rewriteExample": "Your Acme Co order #12345 has shipped!"
      }
    ],
    "rewrittenMessage": null
  }
}
```

---

## Example 6: Error - Empty Message

### Request
```json
{
  "messageBody": ""
}
```

### Response
```json
{
  "error": "messageBody cannot be empty"
}
```

**Status Code:** 400

---

## Example 7: Error - Message Too Long

### Request
```json
{
  "messageBody": "A".repeat(1601)
}
```

### Response
```json
{
  "error": "messageBody too long (max 1600 characters for SMS)"
}
```

**Status Code:** 400

---

## Using cURL

### Basic check
```bash
curl -X POST http://localhost:3001/api/check-compliance \
  -H "Content-Type: application/json" \
  -d '{"messageBody": "Your message here"}'
```

### Pretty print response
```bash
curl -X POST http://localhost:3001/api/check-compliance \
  -H "Content-Type: application/json" \
  -d '{"messageBody": "Your message here"}' | jq
```

### Save response to file
```bash
curl -X POST http://localhost:3001/api/check-compliance \
  -H "Content-Type: application/json" \
  -d '{"messageBody": "Your message here"}' \
  -o response.json
```

---

## Using JavaScript (fetch)

```javascript
async function checkCompliance(message) {
  const response = await fetch('http://localhost:3001/api/check-compliance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageBody: message })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return await response.json();
}

// Usage
const result = await checkCompliance("Your SMS message here");
console.log('Status:', result.summary.overallStatus);
console.log('Risk:', result.summary.riskLevel);
console.log('Issues:', result.summary.totalIssues);
```

---

## Using Python (requests)

```python
import requests

def check_compliance(message):
    response = requests.post(
        'http://localhost:3001/api/check-compliance',
        json={'messageBody': message}
    )
    response.raise_for_status()
    return response.json()

# Usage
result = check_compliance("Your SMS message here")
print(f"Status: {result['summary']['overallStatus']}")
print(f"Risk: {result['summary']['riskLevel']}")
print(f"Issues: {result['summary']['totalIssues']}")
```

---

## Response Field Descriptions

### Top Level
- `messageBody` - The original message that was analyzed
- `messageLength` - Character count
- `segmentCount` - Number of SMS segments (160 chars each)
- `timestamp` - When the check was performed
- `ruleBasedChecks` - Results from pattern matching
- `aiAnalysis` - Results from Claude API analysis
- `summary` - Aggregated results from both sources

### summary Object
- `overallStatus` - "compliant", "warning", or "non-compliant"
- `riskLevel` - "low", "medium", "high", or "critical"
- `totalIssues` - Count of violations
- `totalWarnings` - Count of warnings
- `recommendations` - Array of suggested fixes
- `rewrittenMessage` - AI-generated compliant version (or null)

### Severity Levels
- **critical** - Prohibited content, will not be delivered
- **high** - Regulatory violation, likely blocked
- **medium** - Deliverability issues, may be filtered
- **low** - Best practice suggestions

---

## Integration Tips

1. **Cache results** for identical messages
2. **Rate limit** to avoid API costs
3. **Handle errors** gracefully (network, API key)
4. **Log violations** for compliance auditing
5. **Monitor costs** via Anthropic console
6. **Use batch mode** for bulk checks (future feature)

---

For more examples, run `node test-examples.js` after starting the server.
