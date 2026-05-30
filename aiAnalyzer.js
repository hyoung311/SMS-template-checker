import Anthropic from '@anthropic-ai/sdk';

const TWILIO_POLICIES = `
# Twilio Messaging Policy Summary

## Acceptable Use Policy (AUP)
- Prohibited: Illegal content, adult content, gambling, cannabis/marijuana, deceptive practices
- Prohibited: Spam, phishing, malware, fraud
- Prohibited: SHAFT content (Sex, Hate, Alcohol, Firearms, Tobacco)
- Source: https://www.twilio.com/en-us/legal/aup

## FORBIDDEN USE CASES - CRITICAL
- LOAN SOLICITATION: Payday loans, quick cash loans, unsolicited loan offers
- DEBT COLLECTION: Third-party debt collection messages (requires FDCPA compliance)
- LEAD GENERATION: Financial product lead generation without proper consent
- CREDIT REPAIR: Credit repair or credit fixing schemes
- MLM/PYRAMID SCHEMES: Multi-level marketing recruitment
- STOCK MANIPULATION: Stock tips, penny stock alerts, insider trading
- GET-RICH-QUICK: Guaranteed income schemes, work-from-home scams
- CRYPTOCURRENCY SCAMS: Unsolicited crypto investment offers
- Source: https://www.twilio.com/en-us/legal/aup

## US Regulatory Guidelines (TCPA, CTIA)
- Required: Prior express written consent for marketing messages
- Required: Clear opt-out mechanism (e.g., "Reply STOP to unsubscribe")
- Required: Message frequency disclosure for recurring campaigns
- Required: Sender identification
- Prohibited: Calls/texts to numbers on Do Not Call registry without consent
- Prohibited: Auto-dialing cell phones without prior consent
- Penalties: Up to $1,500 per violation (TCPA)
- Source: https://www.fcc.gov/general/telecommunications-consumers-division-consumer-inquiries-and-complaints-center

## Financial Services Regulations
- REQUIRES special compliance for: loans, debt collection, credit repair, insurance, mortgages
- Must comply with: CFPB regulations, state lending laws, FDCPA
- Source: https://www.consumerfinance.gov/

## Healthcare (HIPAA)
- HIPAA compliance required, no PHI (Protected Health Information) via SMS
- PHI includes: diagnoses, test results, prescription info, SSN, medical record numbers
- Penalties: Up to $50,000 per violation
- Source: https://www.hhs.gov/hipaa/for-professionals/index.html

## Data Privacy Regulations
- PCI-DSS: No credit card numbers, CVV, or full account numbers in SMS
- GDPR: European users require explicit consent, right to erasure
- CCPA: California residents have additional privacy rights
- Source: https://www.pcisecuritystandards.org/

## Messaging Best Practices
- Avoid: Shortened URLs (bit.ly, tinyurl) - carriers may block
- Avoid: Excessive capitalization or special characters
- Avoid: Urgency tactics ("ACT NOW", "LIMITED TIME")
- Avoid: Multiple exclamation marks
- Include: Clear company identification
- Include: Customer care contact info for transactional messages
- Timing: Send messages during reasonable hours (8am-9pm recipient's timezone)
- Source: https://www.ctia.org/the-wireless-industry/industry-commitments-best-practices

## Age-Gated Content
- Requires robust age verification for: Alcohol, tobacco, cannabis, gambling, adult content
- Source: https://www.twilio.com/en-us/legal/aup

## A2P 10DLC Registration
- Required for: Application-to-Person messaging in the US
- Required for: High-volume or marketing campaigns
- Source: https://www.twilio.com/docs/sms/a2p-10dlc
`;

export async function analyzeWithAI(messageBody, apiKey) {
  const anthropic = new Anthropic({ apiKey });

  const prompt = `You are a Twilio SMS compliance expert. Analyze the following SMS message for compliance with Twilio's policies.

SMS Message:
"""
${messageBody}
"""

Policies to check against:
${TWILIO_POLICIES}

Provide your analysis in the following JSON format:
{
  "isCompliant": boolean,
  "overallRisk": "low" | "medium" | "high" | "critical",
  "riskExplanation": string (explain WHY this risk level, what could happen, potential penalties),
  "detectedIntent": string (what is the primary purpose/intent of this message),
  "issues": [
    {
      "category": string,
      "severity": "low" | "medium" | "high" | "critical",
      "description": string,
      "explanation": string (detailed explanation of why this is an issue),
      "policyReference": string,
      "sourceLinks": [string] (array of relevant documentation URLs)
    }
  ],
  "warnings": [
    {
      "category": string,
      "severity": "low" | "medium",
      "description": string,
      "explanation": string (why this is a concern),
      "sourceLinks": [string] (array of relevant documentation URLs)
    }
  ],
  "recommendations": [
    {
      "issue": string,
      "suggestion": string,
      "rewriteExample": string (compliant alternative wording)
    }
  ],
  "compliantRewrite": string (fully rewritten compliant version, or null if compliant)
}

IMPORTANT INSTRUCTIONS:
1. Be extremely thorough in detecting intent - identify loan solicitation, debt collection, financial scams, MLM schemes, etc.
2. For moderate, high, or critical risk: provide detailed riskExplanation including potential consequences and penalties
3. Include sourceLinks for EVERY issue and warning - use the URLs from the policy summary above
4. Provide specific rewriteExample for each recommendation
5. If the message has compliance issues, provide a compliantRewrite that fixes ALL problems
6. Consider context and intent, but be strict about forbidden use cases (loans, debt collection, etc.)
7. Flag suspicious patterns even if not explicitly prohibited`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: [
        {
          type: 'text',
          text: 'You are an expert in Twilio messaging policies and telecommunications regulations. Provide accurate, actionable compliance feedback.',
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
              cache_control: { type: 'ephemeral' }
            }
          ]
        }
      ]
    });

    // Extract JSON from the response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
}
