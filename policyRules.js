// Rule-based checks for common Twilio policy violations
// These catch obvious issues before sending to AI analysis

// Source documentation links for compliance issues
export const SOURCE_LINKS = {
  twilioAUP: 'https://www.twilio.com/en-us/legal/aup',
  twilioForbiddenContent: 'https://www.twilio.com/docs/glossary/what-is-forbidden-message-content',
  twilioMessagingPolicy: 'https://www.twilio.com/docs/sms/tutorials/how-to-confirm-phone-numbers',
  tcpa: 'https://www.fcc.gov/general/telecommunications-consumers-division-consumer-inquiries-and-complaints-center',
  ctia: 'https://www.ctia.org/the-wireless-industry/industry-commitments-best-practices',
  hipaa: 'https://www.hhs.gov/hipaa/for-professionals/index.html',
  cfpb: 'https://www.consumerfinance.gov/',
  fdcpa: 'https://www.ftc.gov/legal-library/browse/rules/fair-debt-collection-practices-act',
  pci: 'https://www.pcisecuritystandards.org/',
  gdpr: 'https://gdpr.eu/',
  a2p10dlc: 'https://www.twilio.com/docs/sms/a2p-10dlc'
};

export const PROHIBITED_CONTENT = {
  // Cannabis and controlled substances
  cannabis: {
    keywords: [
      'marijuana', 'cannabis', 'weed', 'thc', 'cbd oil', 'hemp oil', 'delta-8', 'delta-9', 'delta 8', 'delta 9',
      'pot', 'dispensary', 'marijuana delivery', 'cannabis delivery', 'weed delivery', 'buy weed', 'buy cannabis',
      'cannabis store', 'marijuana shop', 'thc products', 'cbd products', 'hemp products', 'edibles', 'cannabis edibles',
      'marijuana edibles', 'thc gummies', 'cbd gummies', 'vape cartridge', 'cannabis oil', 'marijuana oil',
      'dabs', 'concentrates', 'cannabis concentrates', '420', 'medical marijuana', 'recreational marijuana'
    ],
    description: 'Cannabis/marijuana products or services - FORBIDDEN CONTENT',
    explanation: 'Cannabis and marijuana products are federally prohibited in the US and cannot be promoted via SMS messaging, regardless of state legality. This is forbidden message content under Twilio\'s Acceptable Use Policy.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.twilioForbiddenContent]
  },

  // Adult content (SHAFT - Sex)
  adult: {
    keywords: [
      'porn', 'xxx', 'adult content', 'escort', 'sex chat', 'dating hookup', 'webcam girls', 'onlyfans',
      'adult entertainment', 'adult services', 'erotic', 'nsfw', 'sex worker', 'call girls', 'massage parlor',
      'happy ending', 'strip club', 'gentlemen\'s club', 'adult film', 'pornography', 'webcam show',
      'cam girl', 'cam show', 'phone sex', 'sexting', 'nude photos', 'explicit content', 'adult dating',
      'hookup site', 'casual encounters', 'sugar daddy', 'sugar baby', 'escort service', 'companion service'
    ],
    description: 'Adult content or services - FORBIDDEN CONTENT',
    explanation: 'Adult/sexual content is part of SHAFT prohibited content. These messages violate Twilio AUP and are commonly blocked by carriers. This is forbidden message content.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.twilioForbiddenContent, SOURCE_LINKS.ctia]
  },

  // Gambling
  gambling: {
    keywords: [
      'casino', 'poker', 'bet now', 'gambling', 'sportsbook', 'place your bet', 'slots', 'blackjack', 'roulette', 'lottery ticket',
      'online casino', 'sports betting', 'bet on sports', 'esports betting', 'fantasy sports', 'daily fantasy',
      'betting site', 'gambling app', 'place bet', 'wager', 'gamble online', 'betting odds', 'parlay',
      'casino bonus', 'free spins', 'slot machine', 'online poker', 'poker room', 'betting platform',
      'gamble now', 'betting app', 'odds betting', 'live betting'
    ],
    patterns: [
      /\b(?:bet|wager|gamble)\s+(?:on|now|online)/i,
      /\bonline\s+(?:casino|poker|gambling|betting)/i,
      /\bsports\s+betting\b/i
    ],
    description: 'Gambling services or betting - FORBIDDEN CONTENT',
    explanation: 'Gambling and betting promotions are prohibited unless properly licensed and age-verified. Most carriers block gambling-related SMS. This is forbidden message content.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.twilioForbiddenContent, SOURCE_LINKS.ctia]
  },

  // Hate speech (SHAFT - Hate)
  hate: {
    keywords: [
      'white power', 'hate group', 'supremacist', 'white supremacy', 'neo-nazi', 'neo nazi',
      'kkk', 'ku klux klan', 'ethnic cleansing', 'genocide', 'race war', 'racial purity',
      'alt-right extremism', 'hate crime', 'lynch', 'nazi propaganda', 'anti-semitic', 'antisemitic',
      'islamophobic', 'homophobic slur', 'transphobic slur', 'death to', 'kill all'
    ],
    patterns: [
      /\b(?:white|racial|ethnic)\s+supremac/i,
      /\bhate\s+(?:group|crime|speech)\b/i
    ],
    description: 'Hate speech or discriminatory content - FORBIDDEN CONTENT',
    explanation: 'Hate speech, discriminatory content, and harassment are strictly prohibited under Twilio AUP and violate federal regulations. This is forbidden message content.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.twilioForbiddenContent]
  },

  // Alcohol (SHAFT - Alcohol)
  alcohol: {
    keywords: [
      'liquor store', 'vodka sale', 'beer delivery', 'wine discount', 'alcohol delivery', 'buy whiskey',
      'buy alcohol', 'order alcohol', 'alcohol sale', 'booze delivery', 'liquor delivery', 'wine delivery',
      'beer sale', 'wine sale', 'spirits delivery', 'buy beer', 'buy wine', 'buy vodka', 'buy rum',
      'buy gin', 'buy tequila', 'buy champagne', 'brewery', 'winery', 'distillery',
      'liquor sale', 'bar special', 'drink special', 'happy hour drinks'
    ],
    patterns: [
      /\b(?:buy|order|delivery)\s+(?:alcohol|beer|wine|liquor|vodka|whiskey|rum|gin)/i,
      /\balcohol\s+(?:delivery|sale|available)/i
    ],
    description: 'Alcohol sales or delivery - FORBIDDEN CONTENT',
    explanation: 'Alcohol sales require robust age verification and proper licensing. Direct alcohol sales via SMS are heavily restricted. This is forbidden message content.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.twilioForbiddenContent, SOURCE_LINKS.ctia]
  },

  // Firearms and weapons (SHAFT - Firearms)
  weapons: {
    keywords: [
      'gun sale', 'firearms', 'buy ammunition', 'ammo sale', 'weapon', 'concealed carry', 'handgun', 'rifle for sale',
      'buy gun', 'buy rifle', 'buy pistol', 'buy ammo', 'buy bullets', 'ammunition sale', 'gun dealer',
      'firearm purchase', 'gun show', 'ar-15', 'ak-47', 'ar15', 'ak47', 'semi-automatic', 'assault weapon',
      'gun parts', 'magazines for sale', 'gun accessories', 'holster', 'scope for sale', 'silencer', 'suppressor',
      'bullets for sale', 'rounds for sale', 'shotgun for sale', 'open carry'
    ],
    patterns: [
      /\b(?:buy|purchase|sale)\s+(?:gun|rifle|pistol|firearm|ammo|ammunition|bullets)/i,
      /\bgun\s+(?:sale|dealer|show|parts)/i,
      /\b(?:ar-?15|ak-?47)\b/i
    ],
    description: 'Weapons, firearms, or ammunition sales - FORBIDDEN CONTENT',
    explanation: 'Firearms, weapons, and ammunition sales are federally restricted and prohibited via SMS messaging platforms. This is forbidden message content.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.twilioForbiddenContent]
  },

  // Tobacco (SHAFT - Tobacco)
  tobacco: {
    keywords: [
      'cigarette', 'tobacco', 'vape', 'e-cigarette', 'juul', 'cigar sale', 'nicotine',
      'buy cigarettes', 'cigarette sale', 'tobacco delivery', 'vape shop', 'smoke shop', 'vape pen',
      'e-liquid', 'vape juice', 'nicotine pouches', 'puff bar', 'disposable vape', 'vaping products',
      'buy cigars', 'cigar shop', 'hookah', 'shisha', 'chewing tobacco', 'snuff', 'dip',
      'tobacco products', 'vapor products', 'nicotine products', 'vape mods', 'vape cartridge'
    ],
    patterns: [
      /\b(?:buy|purchase|sale)\s+(?:cigarette|tobacco|vape|cigar|juul)/i,
      /\bvape\s+(?:shop|pen|juice|products)/i,
      /\b(?:e-?cigarette|e-?liquid)\b/i
    ],
    description: 'Tobacco or vaping products - FORBIDDEN CONTENT',
    explanation: 'Tobacco and vaping products require age verification and are subject to federal restrictions. Direct sales via SMS are prohibited. This is forbidden message content.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.twilioForbiddenContent, SOURCE_LINKS.ctia]
  },

  // Pharmaceuticals and health products
  pharmaceuticals: {
    keywords: ['viagra', 'cialis', 'prescription drugs', 'buy pills', 'pharmacy online', 'xanax', 'opioid', 'weight loss pill', 'hgh'],
    description: 'Pharmaceutical drugs or controlled medications',
    explanation: 'Prescription drug sales via SMS are illegal without proper medical licensing and controlled substance regulations. These messages are typically blocked and may result in legal penalties.',
    sources: [SOURCE_LINKS.twilioAUP]
  },

  // Deceptive practices
  deceptive: {
    keywords: ['act now', 'limited time only', 'urgent response required', 'click here immediately', 'congratulations you won', 'you have been selected', 'free prize', 'claim your reward'],
    description: 'Potentially deceptive or urgency-based language',
    explanation: 'Deceptive practices, false urgency, and misleading prize claims violate FTC regulations and Twilio AUP. These patterns are common in fraud and spam.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.ctia]
  },

  // Phishing patterns
  phishing: {
    keywords: ['verify your account', 'suspended account', 'confirm your identity', 'reset password immediately', 'unusual activity detected', 'click to verify', 'account will be closed'],
    description: 'Potential phishing or account compromise patterns',
    explanation: 'Phishing attempts to steal credentials or personal information. These messages violate Twilio AUP and may result in criminal prosecution under the Computer Fraud and Abuse Act.',
    sources: [SOURCE_LINKS.twilioAUP]
  },

  // Financial scams
  financial_scams: {
    keywords: ['wire transfer', 'send money now', 'cash advance', 'inheritance fund', 'nigerian prince', 'money laundering', 'get rich quick', 'investment opportunity guaranteed'],
    description: 'Financial scams or fraud indicators',
    explanation: 'Financial fraud schemes are illegal and violate federal wire fraud statutes. Penalties include account termination, fines, and criminal prosecution.',
    sources: [SOURCE_LINKS.twilioAUP]
  },

  // Cryptocurrency scams
  crypto_scams: {
    keywords: ['bitcoin giveaway', 'crypto airdrop', 'double your crypto', 'guaranteed returns', 'crypto investment'],
    description: 'Cryptocurrency scams or investment fraud',
    explanation: 'Cryptocurrency scams and fraudulent investment schemes violate SEC regulations and Twilio AUP. These result in immediate account suspension.',
    sources: [SOURCE_LINKS.twilioAUP]
  },

  // Malware and security threats
  malware: {
    keywords: ['install this app', 'download now to unlock', 'click to remove virus', 'security breach detected'],
    description: 'Potential malware distribution or security threats',
    explanation: 'Distributing malware or security threats is a federal crime under the Computer Fraud and Abuse Act. Immediate account termination and legal action will follow.',
    sources: [SOURCE_LINKS.twilioAUP]
  }
};

export const REGULATORY_PATTERNS = {
  // TCPA Compliance - Opt-out requirements
  missingOptOut: {
    test: (text, messageType) => {
      const optOutPatterns = ['reply stop', 'text stop', 'stop to unsubscribe', 'opt out', 'stop to opt out', 'opt-out', 'text stop to', 'reply stop to'];
      const hasOptOut = optOutPatterns.some(pattern => text.toLowerCase().includes(pattern));

      // If user explicitly selected marketing type, always check for opt-out
      if (messageType === 'marketing') {
        return !hasOptOut;
      }

      // For support/transactional, check multiple conditions
      const marketingIndicators = [
        'sale', 'discount', 'offer', 'deal', 'promotion', 'limited time', 'special',
        'buy now', 'shop now', 'save', 'free', 'win', 'prize', 'giveaway',
        'new arrival', 'exclusive', 'today only', 'hurry', 'don\'t miss',
        '%', 'percent off', 'off your', 'coupon', 'promo code', 'bonus',
        'clearance', 'flash sale', 'going fast', 'last chance', 'ends soon'
      ];
      const looksLikeMarketing = marketingIndicators.some(indicator =>
        text.toLowerCase().includes(indicator)
      );

      // Check if message indicates ongoing communications
      const ongoingCommunicationIndicators = [
        'will send', 'will text', 'will message', 'future updates', 'upcoming',
        'receive notifications', 'get alerts', 'subscribe', 'sign up for'
      ];
      const indicatesOngoingComms = ongoingCommunicationIndicators.some(indicator =>
        text.toLowerCase().includes(indicator)
      );

      // Flag if it looks promotional OR indicates ongoing communications, AND lacks opt-out
      return (looksLikeMarketing || indicatesOngoingComms) && !hasOptOut;
    },
    severity: 'high',
    description: 'Missing opt-out instructions (required for marketing messages under TCPA)',
    explanation: 'TCPA requires all marketing/promotional messages and messages indicating ongoing communications to include clear opt-out instructions. Failure to include opt-out can result in fines up to $1,500 per violation. One-time transactional messages may not require opt-out.',
    sources: [SOURCE_LINKS.tcpa, SOURCE_LINKS.ctia]
  },

  // Missing sender identification
  missingSenderIdentification: {
    test: (text, messageType) => {
      // Check if message lacks clear sender identification
      const hasCompanyPattern = /(?:from|this is|message from)\s+[A-Z][a-zA-Z0-9\s&]+/i.test(text);
      const hasMessageFromCompany = text.toLowerCase().includes('message from') ||
                                    text.toLowerCase().includes('this is') ||
                                    text.toLowerCase().includes('sent by');
      const hasCompanyNameAtEnd = /[-–]\s*[A-Z][a-zA-Z0-9\s&]+\s*$/.test(text); // "Your order shipped -Acme Corp"

      const hasSenderID = hasCompanyPattern || hasMessageFromCompany || hasCompanyNameAtEnd;

      // For support/transactional, always require sender ID if message is substantial
      if (messageType === 'support' && text.length > 20) {
        return !hasSenderID;
      }

      // For marketing, check if longer messages lack sender ID
      return !hasSenderID && text.length > 50;
    },
    severity: 'high',
    description: 'Missing clear sender identification',
    explanation: 'All messages should clearly identify the sender. Without clear identification, recipients may perceive messages as spam or phishing attempts. Transactional messages require sender identification for trust and deliverability.',
    sources: [SOURCE_LINKS.tcpa, SOURCE_LINKS.ctia]
  },

  // Shortened URLs (carrier filtering risk)
  shortenedUrls: {
    test: (text) => {
      const shortUrlPatterns = [/bit\.ly/i, /tinyurl/i, /goo\.gl/i, /t\.co/i, /ow\.ly/i, /short\.link/i, /rebrand\.ly/i];
      return shortUrlPatterns.some(pattern => pattern.test(text));
    },
    severity: 'medium',
    description: 'Shortened URLs (discouraged by carriers, can be blocked or filtered)',
    explanation: 'Shortened URLs are commonly used in phishing and spam. Many carriers automatically filter or block messages containing shortened URLs.',
    sources: [SOURCE_LINKS.ctia]
  },

  // Excessive capitalization (spam indicator)
  excessiveCaps: {
    test: (text) => {
      const capsWords = text.split(/\s+/).filter(word => word === word.toUpperCase() && word.length > 2);
      return capsWords.length > 3 || (text.length > 0 && capsWords.join('').length / text.length > 0.3);
    },
    severity: 'low',
    description: 'Excessive use of capital letters (spam indicator)',
    explanation: 'Excessive capitalization is a common spam indicator and may trigger carrier filtering. Use normal sentence case for professional messaging.',
    sources: [SOURCE_LINKS.ctia]
  },

  // Multiple exclamation marks
  multipleExclamations: {
    test: (text) => {
      return (text.match(/!{2,}/g) || []).length > 0 || (text.match(/!/g) || []).length > 3;
    },
    severity: 'low',
    description: 'Multiple exclamation marks (spam indicator)',
    explanation: 'Multiple exclamation marks are associated with spam and aggressive marketing. They may reduce message deliverability.',
    sources: [SOURCE_LINKS.ctia]
  },

  // HIPAA concerns - PHI in SMS
  potentialPHI: {
    test: (text) => {
      const phiIndicators = ['medical record', 'diagnosis', 'prescription for', 'test results', 'patient', 'ssn', 'social security'];
      return phiIndicators.some(indicator => text.toLowerCase().includes(indicator));
    },
    severity: 'critical',
    description: 'Potential Protected Health Information (PHI) - HIPAA violation risk',
    explanation: 'Sending Protected Health Information via SMS violates HIPAA regulations. Penalties range from $100 to $50,000 per violation, with potential criminal charges.',
    sources: [SOURCE_LINKS.hipaa]
  },

  // Financial account information
  financialData: {
    test: (text) => {
      const accountPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/; // Credit card pattern
      const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/; // SSN pattern
      const routingPattern = /\brouting number\b/i;
      return accountPattern.test(text) || ssnPattern.test(text) || routingPattern.test(text);
    },
    severity: 'critical',
    description: 'Sensitive financial data detected (PII/PCI violation risk)',
    explanation: 'Transmitting credit card numbers, SSNs, or banking information via SMS violates PCI-DSS standards and data protection regulations. This can result in immediate account termination and legal liability.',
    sources: [SOURCE_LINKS.pci]
  },

  // Missing message frequency disclosure
  missingFrequencyDisclosure: {
    test: (text) => {
      const isRecurring = /daily|weekly|monthly|recurring|subscription|messages per/i.test(text);
      const hasFrequencyDisclosure = /msg frequency|message frequency|msgs?\/|messages?\/|msg & data rates/i.test(text);
      return isRecurring && !hasFrequencyDisclosure;
    },
    severity: 'high',
    description: 'Recurring messages without frequency disclosure (TCPA requirement)',
    explanation: 'TCPA requires disclosure of message frequency for recurring campaigns. Include language like "Msg frequency varies" or "Up to 4 msgs/month".',
    sources: [SOURCE_LINKS.tcpa, SOURCE_LINKS.ctia]
  },

  // International compliance - GDPR considerations
  missingGDPRConsent: {
    test: (text) => {
      // Check for European phone patterns or GDPR keywords without consent language
      const hasEUIndicator = /\+44|€|EUR|GDPR|EU|European/i.test(text);
      const hasConsentLanguage = /you agreed|you consented|as requested|you opted in/i.test(text);
      return hasEUIndicator && !hasConsentLanguage;
    },
    severity: 'medium',
    description: 'Potential GDPR compliance issue - missing consent reference',
    explanation: 'GDPR requires explicit consent for marketing communications to EU residents. Fines can reach €20 million or 4% of annual revenue.',
    sources: [SOURCE_LINKS.gdpr]
  },

  // A2P 10DLC brand verification hint
  highVolumeIndicators: {
    test: (text) => {
      const volumeIndicators = /thousands|millions|bulk|mass message|broadcast to all/i;
      return volumeIndicators.test(text);
    },
    severity: 'medium',
    description: 'High-volume messaging indicators - ensure A2P 10DLC registration',
    explanation: 'High-volume messaging requires A2P 10DLC registration. Unregistered campaigns may be heavily filtered or blocked by carriers.',
    sources: [SOURCE_LINKS.a2p10dlc]
  },

  // Inappropriate timing hints
  nighttimeLanguage: {
    test: (text) => {
      const urgentNightPattern = /urgent|emergency|immediate|asap|right now/i;
      const currentHour = new Date().getHours();
      // Flag urgent messages that might be sent outside reasonable hours
      return urgentNightPattern.test(text) && (currentHour < 8 || currentHour > 21);
    },
    severity: 'low',
    description: 'Urgent message potentially sent outside reasonable hours (8AM-9PM)',
    explanation: 'Best practices recommend sending marketing messages between 8AM-9PM in the recipient\'s timezone. Off-hours messaging may violate TCPA and annoy recipients.',
    sources: [SOURCE_LINKS.tcpa, SOURCE_LINKS.ctia]
  },

  // Support/Transactional message structure validation
  incompleteTransactionalMessage: {
    test: (text, messageType) => {
      // Only apply to support/transactional messages
      if (messageType !== 'support') return false;

      // Short messages (under 20 chars) are incomplete
      if (text.length < 20) return true;

      // Check for basic structure
      const hasSenderID = /(?:from|this is|message from)\s+[A-Z][a-zA-Z0-9\s&]+/i.test(text) ||
                         text.toLowerCase().includes('message from') ||
                         text.toLowerCase().includes('sent by') ||
                         /[-–]\s*[A-Z][a-zA-Z0-9\s&]+\s*$/.test(text);

      const hasSubstantiveContent = text.length > 30 && /[.!?]\s/.test(text); // Has sentences
      const hasOrderNumber = /(?:order|tracking|confirmation|reference)\s*#?\s*[A-Z0-9]+/i.test(text);
      const hasValidURL = /https?:\/\/[\w.-]+\.[a-z]{2,}/i.test(text);

      // Transactional messages should have:
      // 1. Sender ID
      // 2. Either: substantive content, order number, or valid URL
      const hasRequiredStructure = hasSenderID && (hasSubstantiveContent || hasOrderNumber || hasValidURL);

      return !hasRequiredStructure;
    },
    severity: 'high',
    description: 'Incomplete transactional message structure',
    explanation: 'Support and transactional messages should include: (1) Clear sender identification, (2) Substantive content (order details, tracking info, account info), and (3) Valid full URLs if links are included. This ensures message legitimacy and reduces likelihood of being flagged as spam.',
    sources: [SOURCE_LINKS.ctia]
  },

  // Invalid or incomplete URL in support messages
  invalidURLInSupport: {
    test: (text, messageType) => {
      // Only check support/transactional messages
      if (messageType !== 'support') return false;

      // Check if message has a URL-like pattern
      const hasURLPattern = /(?:http|www\.|\.com|\.org|link)/i.test(text);
      if (!hasURLPattern) return false;

      // Check if it's a valid full URL
      const hasValidURL = /https?:\/\/[\w.-]+\.[a-z]{2,}(?:\/[\w\/.-]*)?/i.test(text);

      // Flag if has URL pattern but not a valid full URL
      return hasURLPattern && !hasValidURL;
    },
    severity: 'medium',
    description: 'Invalid or incomplete URL in transactional message',
    explanation: 'Transactional messages should use full, valid URLs (e.g., https://example.com/track) rather than incomplete references. This improves deliverability and user trust.',
    sources: [SOURCE_LINKS.ctia]
  }
};

// Intent detection patterns - identifies the purpose/intent of the message
export const INTENT_PATTERNS = {
  // FORBIDDEN INTENTS - These are prohibited use cases
  financeRelated: {
    keywords: [
      // General financial services
      'financial services', 'financial advice', 'financial planning', 'investment advice',
      'money management', 'wealth management', 'financial consultant', 'financial advisor',
      // Banking and accounts
      'open account', 'bank account', 'checking account', 'savings account', 'interest rate',
      // Credit and lending
      'credit score', 'credit report', 'apply for credit', 'credit card offer', 'line of credit',
      'loan offer', 'loan application', 'credit application', 'financing application',
      'lending', 'borrow money', 'financing available',
      // Application-related (must be explicitly finance-related)
      'finance application', 'financial application',
      // Investment and trading
      'investment opportunity', 'trading account', 'forex', 'stock market', 'mutual fund',
      'investment portfolio', 'investment returns', 'asset management',
      // Money transfers and payments
      'send money', 'transfer funds', 'payment plan', 'installment plan', 'financing options',
      'pay over time', 'payment options', 'wire money',
      // Other financial products
      'apr', 'annual percentage rate', 'interest free', 'no interest', 'low rates',
      'financial product', 'financial offer', 'money back', 'cash back',
      // Approval and processing terms
      'loan approval', 'credit approval', 'financing approval', 'approvals team',
      'underwriting', 'pre-approved', 'pre-qualified', 'preapproved', 'prequalified'
    ],
    patterns: [
      /\b(?:apply|qualify|approved?)\s+(?:for|today)\s+(?:loan|credit|financing|money)/i,
      /\b(?:get|receive|access)\s+(?:up to|upto)?\s*\$?\d+[k]?\s*(?:loan|credit|cash|financing)/i,
      /\b(?:low|lower|reduced)\s+(?:interest|rates?|apr)\b/i,
      /\bfinanc(?:e|ing).*(?:available|option|plan|application|approval)/i,
      /\b(?:loan|credit|financing)\s+(?:application|approval|offer|available|status|update)/i,
      /\b(?:invest|trading|forex|crypto)\s+(?:opportunity|platform|account)/i,
      /\b(?:open|create|start)\s+(?:an?\s+)?(?:bank|investment|trading|brokerage)?\s*(?:account|portfolio)/i,
      /\b(?:your|the)\s+(?:loan|credit|financing)\s+(?:application|approval|status)/i,
      /\b(?:application|approval)\s+(?:for|on|regarding|update)\s+(?:your|the|a)?\s*(?:loan|credit|financing)/i,
      /\$\d+[,\d]*\s+(?:loan|credit|financing|cash|available)/i,
      /\b(?:loan|credit|mortgage|financing)\s+approvals?\s+team\b/i
    ],
    severity: 'critical',
    description: 'Finance-related messaging detected - FORBIDDEN use case',
    explanation: 'All finance-related messaging including loans, credit, investments, financial services, and money transfers are prohibited use cases for SMS. This violates Twilio AUP and financial services regulations (TCPA, CFPB). These messages require special licensing, express written consent, and are high-risk for fraud. Account suspension is likely.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.cfpb, SOURCE_LINKS.tcpa],
    category: 'forbidden_intent'
  },

  loanSolicitation: {
    keywords: ['payday loan', 'quick loan', 'cash loan', 'personal loan', 'loan approval', 'pre-approved loan', 'fast cash', 'loan offer', 'need cash', 'emergency loan'],
    patterns: [/loan.*(?:approved|available|offer)/i, /(?:get|apply).*loan/i, /cash.*(?:advance|now|today)/i],
    severity: 'critical',
    description: 'Loan solicitation detected - FORBIDDEN use case',
    explanation: 'Loan solicitation, especially payday loans and unsolicited loan offers, is a prohibited use case. This violates Twilio AUP and CFPB regulations. Account suspension will likely result.',
    sources: [SOURCE_LINKS.twilioAUP, SOURCE_LINKS.cfpb],
    category: 'forbidden_intent'
  },

  debtCollection: {
    keywords: ['debt collection', 'you owe', 'outstanding debt', 'payment overdue', 'pay your debt', 'settle your debt'],
    patterns: [/debt.*(?:collection|collector)/i, /you owe.*(?:\$|USD|dollars)/i],
    severity: 'critical',
    description: 'Debt collection messaging - requires special compliance (FDCPA)',
    explanation: 'Debt collection via SMS requires strict FDCPA compliance. Violations can result in fines up to $1,000 per message and class-action lawsuits.',
    sources: [SOURCE_LINKS.fdcpa, SOURCE_LINKS.cfpb],
    category: 'forbidden_intent'
  },

  leadGeneration: {
    keywords: ['qualify for', 'see if you qualify', 'check eligibility', 'pre-qualified', 'you may be eligible'],
    patterns: [/qualify.*(?:loan|credit|mortgage)/i, /eligible.*(?:loan|credit)/i],
    severity: 'high',
    description: 'Lead generation for financial products - high-risk category',
    explanation: 'Financial product lead generation requires express written consent and TCPA compliance. This is a high-risk category subject to significant penalties.',
    sources: [SOURCE_LINKS.tcpa, SOURCE_LINKS.cfpb],
    category: 'forbidden_intent'
  },

  creditRepair: {
    keywords: ['fix your credit', 'repair credit', 'boost credit score', 'credit restoration', 'remove negative items'],
    patterns: [/(?:fix|repair|restore).*credit/i, /credit.*(?:boost|improvement)/i],
    severity: 'critical',
    description: 'Credit repair services - heavily regulated, often fraudulent',
    explanation: 'Credit repair schemes are often fraudulent and violate the Credit Repair Organizations Act. This will result in immediate account suspension.',
    sources: [SOURCE_LINKS.cfpb, SOURCE_LINKS.twilioAUP],
    category: 'forbidden_intent'
  },

  mlmRecruitment: {
    keywords: ['work from home', 'be your own boss', 'unlimited income', 'join our team', 'business opportunity', 'make money from home', 'side hustle'],
    patterns: [/(?:unlimited|passive).*income/i, /work.*home.*(?:\$|money|income)/i, /join.*team.*earn/i],
    severity: 'high',
    description: 'MLM/pyramid scheme recruitment language detected',
    explanation: 'MLM recruitment messages often violate anti-pyramid scheme regulations and are considered deceptive practices.',
    sources: [SOURCE_LINKS.twilioAUP],
    category: 'forbidden_intent'
  },

  getrichQuick: {
    keywords: ['get rich quick', 'make thousands', 'easy money', 'guaranteed income', 'financial freedom', 'no experience needed'],
    patterns: [/(?:make|earn).*(?:\$\d+|thousands|millions)/i, /guaranteed.*(?:income|profit|returns)/i],
    severity: 'critical',
    description: 'Get-rich-quick scheme indicators',
    explanation: 'Get-rich-quick schemes are fraudulent and violate FTC regulations. These messages result in immediate suspension and potential legal action.',
    sources: [SOURCE_LINKS.twilioAUP],
    category: 'forbidden_intent'
  },

  stockTips: {
    keywords: ['stock tip', 'hot stock', 'insider information', 'stock alert', 'penny stock'],
    patterns: [/stock.*(?:tip|alert|hot)/i, /(?:buy|sell).*stock.*(?:now|today)/i],
    severity: 'critical',
    description: 'Stock manipulation or insider trading patterns',
    explanation: 'Stock tips and manipulation violate SEC regulations. Insider trading is a federal crime with severe penalties.',
    sources: [SOURCE_LINKS.twilioAUP],
    category: 'forbidden_intent'
  },

  insuranceSolicitation: {
    keywords: ['health insurance', 'final expense', 'life insurance quote', 'burial insurance', 'medicare advantage'],
    patterns: [/insurance.*(?:quote|rates|coverage)/i, /(?:health|life).*insurance.*(?:available|affordable)/i],
    severity: 'high',
    description: 'Insurance solicitation - requires proper licensing and consent',
    explanation: 'Insurance sales require state licensing and express written consent. Unsolicited insurance marketing may violate TCPA and state regulations.',
    sources: [SOURCE_LINKS.tcpa, SOURCE_LINKS.twilioAUP],
    category: 'regulated_intent'
  },

  mortgageRefinance: {
    keywords: ['refinance your home', 'lower mortgage rate', 'mortgage offer', 'refi your home'],
    patterns: [/(?:refinance|refi).*(?:home|mortgage)/i, /mortgage.*(?:rate|offer)/i],
    severity: 'high',
    description: 'Mortgage/refinance solicitation - heavily regulated',
    explanation: 'Mortgage solicitation is heavily regulated by CFPB and state laws. Requires proper licensing and express written consent.',
    sources: [SOURCE_LINKS.cfpb, SOURCE_LINKS.tcpa],
    category: 'regulated_intent'
  },

  sweepstakes: {
    keywords: ['you won', 'winner', 'prize notification', 'claim your prize', 'sweepstakes winner'],
    patterns: [/you.*(?:won|winner)/i, /claim.*(?:prize|reward|winnings)/i],
    severity: 'high',
    description: 'Sweepstakes/prize notification - often deceptive',
    explanation: 'Prize notifications are common phishing and fraud tactics. Unless legitimate, these messages violate deceptive practices regulations.',
    sources: [SOURCE_LINKS.twilioAUP],
    category: 'forbidden_intent'
  },

  cryptoInvestment: {
    keywords: ['crypto investment', 'bitcoin trading', 'crypto portfolio', 'nft opportunity', 'defi yield'],
    patterns: [/crypto.*(?:invest|trading|opportunity)/i, /(?:bitcoin|ethereum).*(?:profit|returns)/i],
    severity: 'critical',
    description: 'Cryptocurrency investment solicitation - high fraud risk',
    explanation: 'Cryptocurrency investment schemes are frequently fraudulent. These violate securities regulations and Twilio AUP.',
    sources: [SOURCE_LINKS.twilioAUP],
    category: 'forbidden_intent'
  },

  ageRestrictedNoVerification: {
    keywords: ['buy alcohol', 'tobacco sale', 'vape shop', 'casino bonus', '21+ offer'],
    patterns: [/(?:alcohol|tobacco|casino|gambling).*(?:sale|offer|deal)/i],
    severity: 'critical',
    description: 'Age-restricted product without verification mechanism',
    explanation: 'Age-restricted products require robust age verification. Sales without verification violate federal and state laws.',
    sources: [SOURCE_LINKS.twilioAUP],
    category: 'forbidden_intent'
  },

  // SUSPICIOUS INTENTS - Require careful review
  urgentAction: {
    keywords: ['urgent action required', 'immediate response', 'act immediately', 'respond now', 'time sensitive'],
    patterns: [/(?:urgent|immediate).*(?:action|response)/i, /act.*(?:now|immediately|today)/i],
    severity: 'medium',
    description: 'Urgent action language - may indicate phishing or pressure tactics',
    explanation: 'Urgent action language is commonly used in phishing attacks and high-pressure sales tactics. This may trigger spam filters.',
    sources: [SOURCE_LINKS.ctia],
    category: 'suspicious_intent'
  },

  accountSuspension: {
    keywords: ['account suspended', 'account locked', 'suspended account', 'verify to restore'],
    patterns: [/account.*(?:suspended|locked|disabled)/i, /(?:verify|confirm).*(?:account|identity)/i],
    severity: 'high',
    description: 'Account suspension claim - common phishing tactic',
    explanation: 'Account suspension messages are a common phishing tactic used to steal credentials. Unless from a legitimate service, these violate anti-phishing regulations.',
    sources: [SOURCE_LINKS.twilioAUP],
    category: 'suspicious_intent'
  },

  unsolicitedOffer: {
    keywords: ['special offer for you', 'exclusive deal', 'limited availability', 'hand-picked for you'],
    patterns: [/(?:special|exclusive).*offer.*you/i, /selected.*(?:offer|deal)/i],
    severity: 'medium',
    description: 'Unsolicited offer language - may lack proper consent',
    explanation: 'Unsolicited marketing offers may violate TCPA if sent without prior express written consent.',
    sources: [SOURCE_LINKS.tcpa, SOURCE_LINKS.ctia],
    category: 'suspicious_intent'
  }
};

export function runRuleBasedChecks(messageBody, messageType = 'marketing') {
  const violations = [];
  const warnings = [];
  const intents = [];

  const lowerText = messageBody.toLowerCase();

  // Check prohibited content
  for (const [category, rule] of Object.entries(PROHIBITED_CONTENT)) {
    const matchedKeywords = rule.keywords.filter(keyword => lowerText.includes(keyword));
    if (matchedKeywords.length > 0) {
      violations.push({
        category: 'prohibited_content',
        subcategory: category,
        description: rule.description,
        explanation: rule.explanation,
        sourceLinks: rule.sources || [],
        matchedKeywords,
        severity: 'critical'
      });
    }
  }

  // Check intent patterns
  for (const [intentName, rule] of Object.entries(INTENT_PATTERNS)) {
    const matchedKeywords = rule.keywords.filter(keyword => lowerText.includes(keyword));
    const matchedPatterns = rule.patterns ? rule.patterns.filter(pattern => pattern.test(messageBody)) : [];

    if (matchedKeywords.length > 0 || matchedPatterns.length > 0) {
      const intent = {
        category: rule.category,
        intentName,
        description: rule.description,
        explanation: rule.explanation || 'This intent requires careful compliance review.',
        sourceLinks: rule.sources || [SOURCE_LINKS.twilioAUP],
        matchedKeywords,
        matchedPatterns: matchedPatterns.length,
        severity: rule.severity
      };

      if (rule.category === 'forbidden_intent') {
        violations.push(intent);
      } else if (rule.severity === 'high' || rule.severity === 'critical') {
        violations.push(intent);
      } else {
        warnings.push(intent);
      }

      intents.push(intentName);
    }
  }

  // Check regulatory patterns
  for (const [checkName, rule] of Object.entries(REGULATORY_PATTERNS)) {
    if (rule.test(messageBody, messageType)) {
      const issue = {
        category: 'regulatory',
        checkName,
        description: rule.description,
        explanation: rule.explanation,
        sourceLinks: rule.sources || [],
        severity: rule.severity
      };

      if (rule.severity === 'high' || rule.severity === 'critical') {
        violations.push(issue);
      } else {
        warnings.push(issue);
      }
    }
  }

  return { violations, warnings, intents };
}
