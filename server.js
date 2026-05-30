import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runRuleBasedChecks } from './policyRules.js';
import { analyzeWithAI } from './aiAnalyzer.js';
import { generateCompliantRewrite, generateRecommendations } from './rewriteGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main compliance check endpoint
app.post('/api/check-compliance', async (req, res) => {
  try {
    const { messageBody, messageType = 'marketing' } = req.body;

    if (!messageBody || typeof messageBody !== 'string') {
      return res.status(400).json({ error: 'messageBody is required and must be a string' });
    }

    if (messageBody.length === 0) {
      return res.status(400).json({ error: 'messageBody cannot be empty' });
    }

    if (messageBody.length > 1600) {
      return res.status(400).json({ error: 'messageBody too long (max 1600 characters for SMS)' });
    }

    // Step 1: Run rule-based checks with message type
    const ruleBasedResults = runRuleBasedChecks(messageBody, messageType);

    // Step 2: Run AI analysis for nuanced policy review
    let aiAnalysis = null;
    try {
      if (process.env.ANTHROPIC_API_KEY) {
        aiAnalysis = await analyzeWithAI(messageBody, process.env.ANTHROPIC_API_KEY);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Continue with rule-based results even if AI fails
    }

    // Step 3: Combine results
    const response = {
      messageBody,
      messageLength: messageBody.length,
      segmentCount: Math.ceil(messageBody.length / 160),
      timestamp: new Date().toISOString(),
      ruleBasedChecks: ruleBasedResults,
      aiAnalysis: aiAnalysis || { note: 'AI analysis unavailable - check ANTHROPIC_API_KEY' },
      summary: generateSummary(ruleBasedResults, aiAnalysis, messageBody)
    };

    res.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

function generateSummary(ruleBasedResults, aiAnalysis, messageBody) {
  const hasRuleViolations = ruleBasedResults.violations.length > 0;
  const hasRuleWarnings = ruleBasedResults.warnings.length > 0;
  const aiSaysNonCompliant = aiAnalysis && !aiAnalysis.isCompliant;

  let overallStatus = 'compliant';
  let riskLevel = 'low';

  if (hasRuleViolations || aiSaysNonCompliant) {
    overallStatus = 'non-compliant';
    riskLevel = aiAnalysis?.overallRisk || 'high';
  } else if (hasRuleWarnings || (aiAnalysis && aiAnalysis.issues?.length > 0)) {
    overallStatus = 'warning';
    riskLevel = 'medium';
  }

  // Generate recommendations using the new recommendation generator
  const allRecommendations = generateRecommendations(
    ruleBasedResults.violations,
    ruleBasedResults.warnings,
    messageBody
  );

  // Add AI recommendations if available
  if (aiAnalysis?.recommendations) {
    allRecommendations.push(...aiAnalysis.recommendations.map(r => ({
      source: 'ai',
      ...r
    })));
  }

  // Generate compliant rewrite
  let rewrittenMessage = null;
  let rewriteExplanation = null;

  // First try AI rewrite if available
  if (aiAnalysis?.rewrittenMessage || aiAnalysis?.compliantRewrite) {
    rewrittenMessage = aiAnalysis.rewrittenMessage || aiAnalysis.compliantRewrite;
    rewriteExplanation = 'AI-generated compliant version';
  } else if (hasRuleViolations || hasRuleWarnings) {
    // Fallback to rule-based rewrite
    const rewriteResult = generateCompliantRewrite(
      messageBody,
      ruleBasedResults.violations,
      ruleBasedResults.warnings
    );
    rewrittenMessage = rewriteResult.rewrittenMessage;
    rewriteExplanation = rewriteResult.explanation;
  }

  return {
    overallStatus,
    riskLevel,
    totalIssues: ruleBasedResults.violations.length + (aiAnalysis?.issues?.length || 0),
    totalWarnings: ruleBasedResults.warnings.length,
    detectedIntents: ruleBasedResults.intents || [],
    riskExplanation: aiAnalysis?.riskExplanation || null,
    recommendations: allRecommendations,
    rewrittenMessage,
    rewriteExplanation
  };
}


app.listen(PORT, () => {
  console.log(`🚀 Twilio SMS Compliance Checker running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/check-compliance`);
  console.log(`💡 Make sure to set ANTHROPIC_API_KEY in .env for AI-powered analysis`);
});
