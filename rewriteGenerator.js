// Generate compliant rewrites based on detected violations
// This provides fallback rewrites when AI is unavailable

export function generateCompliantRewrite(messageBody, violations, warnings) {
  // If message has critical finance/loan/prohibited intent violations, it cannot be rewritten
  const criticalIntents = violations.filter(v =>
    v.category === 'forbidden_intent' &&
    ['financeRelated', 'loanSolicitation', 'debtCollection', 'creditRepair', 'cryptoInvestment'].includes(v.intentName)
  );

  if (criticalIntents.length > 0) {
    return {
      rewrittenMessage: null,
      explanation: 'This message contains forbidden use case content (finance/loan solicitation) that cannot be made compliant through rewrites. The message intent itself is prohibited.'
    };
  }

  // Check for other prohibited content
  const prohibitedContent = violations.filter(v => v.category === 'prohibited_content');
  if (prohibitedContent.length > 0) {
    return {
      rewrittenMessage: null,
      explanation: `This message contains prohibited content (${prohibitedContent.map(v => v.subcategory).join(', ')}) that cannot be made compliant. Remove all references to prohibited content.`
    };
  }

  // For messages with regulatory issues only, attempt a rewrite
  let rewritten = messageBody;
  let changes = [];

  // Fix missing opt-out
  const needsOptOut = violations.some(v => v.checkName === 'missingOptOut') ||
                      warnings.some(w => w.checkName === 'missingOptOut');
  if (needsOptOut && !messageBody.toLowerCase().includes('stop')) {
    rewritten += ' Reply STOP to unsubscribe. Msg&data rates may apply.';
    changes.push('Added opt-out instructions');
  }

  // Fix missing sender identification
  const needsSender = violations.some(v => v.checkName === 'missingSenderIdentification') ||
                      warnings.some(w => w.checkName === 'missingSenderIdentification');
  if (needsSender && !messageBody.toLowerCase().includes('from') && rewritten.length < 140) {
    rewritten = '[Your Company]: ' + rewritten;
    changes.push('Added sender identification');
  }

  // Remove shortened URLs
  const hasShortUrls = violations.some(v => v.checkName === 'shortenedUrls') ||
                       warnings.some(w => w.checkName === 'shortenedUrls');
  if (hasShortUrls) {
    rewritten = rewritten.replace(/bit\.ly\/\S+/gi, 'yourwebsite.com');
    rewritten = rewritten.replace(/tinyurl\.com\/\S+/gi, 'yourwebsite.com');
    rewritten = rewritten.replace(/goo\.gl\/\S+/gi, 'yourwebsite.com');
    rewritten = rewritten.replace(/t\.co\/\S+/gi, 'yourwebsite.com');
    rewritten = rewritten.replace(/ow\.ly\/\S+/gi, 'yourwebsite.com');
    changes.push('Replaced shortened URLs with full domain');
  }

  // Fix excessive caps
  const hasExcessiveCaps = warnings.some(w => w.checkName === 'excessiveCaps');
  if (hasExcessiveCaps) {
    // Convert to sentence case
    rewritten = rewritten.split(' ').map((word, idx) => {
      if (word === word.toUpperCase() && word.length > 2) {
        return idx === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.toLowerCase();
      }
      return word;
    }).join(' ');
    changes.push('Reduced excessive capitalization');
  }

  // Fix multiple exclamations
  const hasExclamations = warnings.some(w => w.checkName === 'multipleExclamations');
  if (hasExclamations) {
    rewritten = rewritten.replace(/!{2,}/g, '!');
    const exclamationCount = (rewritten.match(/!/g) || []).length;
    if (exclamationCount > 1) {
      let count = 0;
      rewritten = rewritten.replace(/!/g, () => {
        count++;
        return count === 1 ? '!' : '.';
      });
    }
    changes.push('Reduced excessive exclamation marks');
  }

  // If we made changes, return the rewrite
  if (changes.length > 0) {
    return {
      rewrittenMessage: rewritten,
      explanation: `Made the following changes: ${changes.join(', ')}.`,
      changes
    };
  }

  // If no changes could be made
  return {
    rewrittenMessage: null,
    explanation: 'Unable to generate a compliant rewrite. Please review the violations and warnings.'
  };
}

// Generate specific recommendations with rewrite examples
export function generateRecommendations(violations, warnings, messageBody) {
  const recommendations = [];

  // Handle forbidden intents
  const forbiddenIntents = violations.filter(v => v.category === 'forbidden_intent');
  if (forbiddenIntents.length > 0) {
    forbiddenIntents.forEach(intent => {
      recommendations.push({
        issue: intent.description,
        suggestion: 'This is a prohibited use case. Remove all references to this content. Consider whether SMS is appropriate for your message.',
        rewriteExample: null
      });
    });
  }

  // Handle prohibited content
  const prohibitedContent = violations.filter(v => v.category === 'prohibited_content');
  if (prohibitedContent.length > 0) {
    prohibitedContent.forEach(content => {
      recommendations.push({
        issue: content.description,
        suggestion: `Remove all references to ${content.subcategory}. This content violates Twilio AUP.`,
        rewriteExample: null
      });
    });
  }

  // Handle missing opt-out
  if (violations.some(v => v.checkName === 'missingOptOut') ||
      warnings.some(w => w.checkName === 'missingOptOut')) {
    recommendations.push({
      issue: 'Missing opt-out instructions',
      suggestion: 'Add clear opt-out instructions at the end of your message.',
      rewriteExample: messageBody + ' Reply STOP to unsubscribe. Msg&data rates may apply.'
    });
  }

  // Handle missing sender ID
  if (violations.some(v => v.checkName === 'missingSenderIdentification') ||
      warnings.some(w => w.checkName === 'missingSenderIdentification')) {
    recommendations.push({
      issue: 'Missing sender identification',
      suggestion: 'Clearly identify your company or brand at the beginning of the message.',
      rewriteExample: '[YourCompany]: ' + messageBody
    });
  }

  // Handle shortened URLs
  if (violations.some(v => v.checkName === 'shortenedUrls') ||
      warnings.some(w => w.checkName === 'shortenedUrls')) {
    recommendations.push({
      issue: 'Shortened URLs detected',
      suggestion: 'Replace shortened URLs with full domain names to avoid carrier filtering.',
      rewriteExample: messageBody.replace(/bit\.ly\/\S+/gi, 'yourcompany.com/offer')
    });
  }

  // Handle PHI
  if (violations.some(v => v.checkName === 'potentialPHI')) {
    recommendations.push({
      issue: 'Protected Health Information detected',
      suggestion: 'Never send PHI via SMS. Use secure patient portals or encrypted channels instead.',
      rewriteExample: 'Your test results are ready. Log in to the patient portal to view them securely.'
    });
  }

  // Handle financial data
  if (violations.some(v => v.checkName === 'financialData')) {
    recommendations.push({
      issue: 'Sensitive financial data detected',
      suggestion: 'Never send credit card numbers, SSNs, or account numbers via SMS.',
      rewriteExample: 'Your payment has been processed successfully. Log in to view details.'
    });
  }

  return recommendations;
}
