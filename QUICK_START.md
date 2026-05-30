# Quick Start Guide

Get up and running in 3 minutes!

## Step 1: Get an Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy it to your clipboard

## Step 2: Configure the App

Open the `.env` file and paste your API key:

```bash
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
```

## Step 3: Start the Backend

```bash
npm run dev
```

You should see:
```
🚀 Twilio SMS Compliance Checker running on port 3001
📍 API endpoint: http://localhost:3001/api/check-compliance
💡 Make sure to set ANTHROPIC_API_KEY in .env for AI-powered analysis
```

## Step 4: Open the Frontend

Open `index.html` in your browser by:

**Option A:** Double-click the file

**Option B:** Serve it with a local server:
```bash
# In a new terminal window
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Step 5: Test It!

Try pasting this non-compliant message:

```
WIN BIG at our casino! Click here NOW: bit.ly/win123
```

You should see:
- ❌ Non-Compliant status
- Multiple rule violations detected
- AI-powered analysis
- Recommendations for fixing
- A compliant rewrite suggestion

## Example Test Messages

### ✅ Compliant
```
Hi! Thanks for signing up for updates from Acme Co. We'll send you weekly deals. Reply STOP to unsubscribe. Msg&data rates may apply.
```

### ❌ Missing Opt-Out
```
Buy now and save 50%! Limited time offer. Visit our store today.
```

### ❌ Prohibited Content
```
Join our poker tournament tonight! Huge cash prizes available.
```

### ⚠️ Warning (Shortened URL)
```
Check out our latest deals at bit.ly/deals123. Great savings!
```

## Troubleshooting

### "AI analysis unavailable"
- Check that your API key is correctly set in `.env`
- Restart the server after adding the key
- Verify the key starts with `sk-ant-`

### CORS errors
- Make sure the backend is running on port 3001
- Check that `index.html` is loading from localhost (not file://)

### Connection refused
- Ensure the server started successfully
- Check no other service is using port 3001
- Try changing the port in `.env`

## Next Steps

- Read the full [README.md](README.md) for API documentation
- Run `node test-examples.js` to test various message types
- Customize policy rules in `policyRules.js`
- Modify AI analysis prompt in `aiAnalyzer.js`

## Cost Estimation

The AI analysis uses Claude Sonnet 4.6 with prompt caching:

- **First message:** ~$0.01 (full prompt)
- **Subsequent messages:** ~$0.001 (cached prompt)
- **Average cost per check:** < $0.002

For 1000 messages/day: ~$2/day

---

**Questions?** Check the main [README.md](README.md) or Twilio's compliance docs.
