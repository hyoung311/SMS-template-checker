# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           index.html (React Frontend)                  │  │
│  │  • Message input form                                  │  │
│  │  • Real-time character count                           │  │
│  │  • Results display with severity highlighting          │  │
│  └──────────────────────┬────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────┘
                          │ HTTP POST
                          │ /api/check-compliance
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server (Node.js)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    server.js                           │  │
│  │  • Route handling                                      │  │
│  │  • Request validation                                  │  │
│  │  • Results aggregation                                 │  │
│  └─────────┬──────────────────────────┬───────────────────┘  │
│            │                          │                       │
│            ▼                          ▼                       │
│  ┌──────────────────┐      ┌──────────────────────┐          │
│  │  policyRules.js  │      │   aiAnalyzer.js      │          │
│  │                  │      │                      │          │
│  │  Rule-Based      │      │  AI-Powered          │          │
│  │  Checks:         │      │  Analysis:           │          │
│  │  • Keywords      │      │  • Claude API        │          │
│  │  • Patterns      │      │  • Nuanced review    │          │
│  │  • Requirements  │      │  • Rewrites          │          │
│  └──────────────────┘      └──────────┬───────────┘          │
└─────────────────────────────────────────┼────────────────────┘
                                          │
                                          ▼
                              ┌──────────────────────┐
                              │   Anthropic API      │
                              │  Claude Sonnet 4.6   │
                              │  (Prompt Caching)    │
                              └──────────────────────┘
```

## Data Flow

### 1. User Input
```
User types message → Character count updates → Submit button enabled
```

### 2. Compliance Check Request
```javascript
POST /api/check-compliance
{
  "messageBody": "Your SMS text here"
}
```

### 3. Hybrid Analysis Pipeline

```
Input Message
    │
    ├─→ Rule-Based Checks (policyRules.js)
    │       │
    │       ├─→ Prohibited Content Scan
    │       │   • Cannabis keywords
    │       │   • Adult content
    │       │   • Gambling terms
    │       │   • Deceptive language
    │       │
    │       └─→ Regulatory Pattern Check
    │           • Missing opt-out
    │           • Shortened URLs
    │           • Excessive caps
    │           • Multiple exclamations
    │
    └─→ AI Analysis (aiAnalyzer.js)
            │
            ├─→ Prompt Construction
            │   • Message body
            │   • Full policy context (cached)
            │
            ├─→ Claude API Call
            │   • Model: claude-sonnet-4-6
            │   • Prompt caching enabled
            │   • Structured JSON response
            │
            └─→ Parse Response
                • Compliance status
                • Risk level
                • Specific issues
                • Recommendations
                • Compliant rewrite
```

### 4. Results Aggregation
```javascript
{
  ruleBasedChecks: {...},     // Violations and warnings
  aiAnalysis: {...},           // Nuanced analysis
  summary: {
    overallStatus,             // Merged status
    riskLevel,                 // Highest risk
    recommendations,           // Combined list
    rewrittenMessage           // AI-generated fix
  }
}
```

### 5. Frontend Display
```
Results render with:
  • Status badge (color-coded)
  • Issue cards (severity-based)
  • Recommendations list
  • Suggested rewrite
```

## Component Responsibilities

### server.js
- Express app setup and middleware
- CORS configuration
- Request validation
- Orchestrates rule-based + AI checks
- Aggregates results
- Error handling

### policyRules.js
- Fast, deterministic checks
- Keyword matching
- Pattern detection
- Regex-based validation
- No external dependencies

**Checks:**
- `PROHIBITED_CONTENT`: Cannabis, adult, gambling, deceptive, phishing
- `REGULATORY_PATTERNS`: Opt-out, URLs, formatting

### aiAnalyzer.js
- Claude API integration
- Prompt construction with policy context
- Prompt caching for cost efficiency
- JSON response parsing
- Nuanced policy interpretation

**Capabilities:**
- Context-aware analysis
- Intent understanding
- Compliant message rewrites
- Detailed explanations

### index.html
- Self-contained React app (via CDN)
- Real-time character counting
- SMS segment calculation
- Results visualization
- Severity-based color coding

## Key Design Decisions

### 1. Hybrid Approach
**Why:** Combines speed of rules with intelligence of AI
- Rules catch obvious violations instantly
- AI handles edge cases and provides context
- Works even if AI is unavailable

### 2. Prompt Caching
**Why:** 90% cost reduction for repeated checks
- Policy context is cached (ephemeral)
- Only message body changes per request
- First message: ~$0.01, subsequent: ~$0.001

### 3. Client-Side React via CDN
**Why:** Zero build step, instant start
- No webpack/vite configuration
- No node_modules bloat on frontend
- Easy to modify and extend
- Works with simple HTTP server

### 4. Express Backend
**Why:** Simple, well-understood, perfect for this use case
- Minimal dependencies
- Easy to extend with auth, logging, etc.
- Standard REST API patterns
- Good for future integrations

### 5. Severity Levels
**Why:** Clear prioritization of issues
```
Critical → Blocks sending (prohibited content)
High     → Likely blocked or legal issue
Medium   → May reduce deliverability
Low      → Best practice suggestion
```

## Scaling Considerations

### Current Limitations
- Single server instance
- No request caching
- No rate limiting
- No user authentication

### Future Enhancements
1. **Caching Layer**
   - Redis for repeated message checks
   - Hash-based deduplication

2. **Rate Limiting**
   - Per-IP or per-API-key limits
   - Prevent abuse of Claude API

3. **Batch Processing**
   - Check multiple messages at once
   - Async job queue

4. **Database Integration**
   - Store check history
   - Analytics dashboard
   - Common violation patterns

5. **Authentication**
   - API keys for programmatic access
   - User accounts
   - Usage tracking

## Cost Analysis

### Per-Check Breakdown
```
Rule-Based:      $0.000 (compute only)
AI Analysis:     
  First:         ~$0.010 (no cache)
  Subsequent:    ~$0.001 (cached)

Average per check: < $0.002
```

### Monthly Estimates
```
100 checks/day:    ~$6/month
1,000 checks/day:  ~$60/month
10,000 checks/day: ~$600/month
```

### Optimization Opportunities
- Increase cache TTL (currently ephemeral)
- Use Haiku for simple messages
- Batch similar messages
- Client-side rule checks only mode

## Security Considerations

### Current State
- No authentication
- Public API endpoint
- No input sanitization beyond length
- CORS enabled for all origins

### Production Requirements
1. API authentication
2. Rate limiting
3. Input sanitization
4. CORS whitelist
5. HTTPS only
6. Environment variable validation
7. Logging and monitoring
8. API key rotation

## Testing Strategy

### Manual Testing
- Use `test-examples.js` for common scenarios
- Web UI for interactive testing
- curl for API testing

### Automated Testing (Future)
```
Unit Tests:
  - policyRules.js functions
  - Result aggregation logic

Integration Tests:
  - API endpoint responses
  - Error handling

E2E Tests:
  - Full flow through UI
  - Various message types
```

## Deployment Options

### Simple (Current)
```bash
node server.js  # On any Node.js host
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### Serverless
- AWS Lambda + API Gateway
- Vercel Functions
- Cloudflare Workers

### Traditional
- EC2 / DigitalOcean / Heroku
- PM2 for process management
- Nginx reverse proxy

---

Built with simplicity and extensibility in mind. Each component is independent and can be replaced or enhanced without affecting others.
