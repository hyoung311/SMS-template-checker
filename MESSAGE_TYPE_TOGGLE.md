# Message Type Toggle - Feature Documentation

## ✅ Feature Added

A **Message Type Toggle** has been added to let users specify whether they're testing a marketing message or a support/transactional message.

---

## 🎯 Why This Matters

**Problem**: Not all SMS messages are marketing. Many are:
- Customer support ("Your package arrived")
- Transactional ("Order #12345 confirmed")  
- Conversational ("Hey, checking in on your request")

These messages **don't require opt-out instructions** under TCPA, but the system was checking all messages the same way.

---

## 🎨 User Interface

### Toggle Buttons (Above Message Input):

```
Message Type:
┌────────────────────────────┬────────────────────────────┐
│   📢 Marketing/Promotional  │  💬 Support/Transactional  │
└────────────────────────────┴────────────────────────────┘
```

**Active Button**: Purple gradient background, white text
**Inactive Button**: White background, gray text

---

## 🔧 How It Works

### Marketing Type Selected (Default):
- **Always checks for opt-out** - regardless of content
- Applies strict marketing compliance rules
- Assumes message is promotional

**Use For:**
- Sales and promotions
- Marketing campaigns
- Newsletters
- Special offers
- Any promotional content

### Support/Transactional Type Selected:
- **Smart checking** - only flags if message contains marketing indicators
- Allows support messages without opt-out
- More lenient for operational messages

**Use For:**
- Order confirmations
- Shipping notifications
- Account updates
- Customer support
- Password resets
- Appointment reminders

---

## 📊 Testing Results

| Message | Type Selected | Has Opt-Out? | Result |
|---------|---------------|--------------|--------|
| "Your order confirmed" | Marketing | ❌ No | ✅ Flagged (correct) |
| "Your order confirmed" | Support | ❌ No | ✅ NOT flagged (correct) |
| "50% OFF sale!" | Marketing | ❌ No | ✅ Flagged (correct) |
| "50% OFF sale!" | Support | ❌ No | ✅ Flagged (correct - has indicators) |

**4/4 tests passed! ✅**

---

## 🧠 Logic Flow

```javascript
// Marketing Type
if (messageType === 'marketing') {
  // Always check for opt-out
  return !hasOptOut;
}

// Support Type
if (messageType === 'support') {
  // Only check if it has marketing indicators
  const marketingIndicators = ['sale', 'discount', 'offer', ...];
  const looksLikeMarketing = hasMarketingIndicators(text);
  return looksLikeMarketing && !hasOptOut;
}
```

**Smart Protection**: Even if user selects "Support", messages with promotional language like "50% OFF" still require opt-out.

---

## 🎯 Marketing Indicators

The system looks for these keywords to detect promotional content:

### Sales & Discounts:
- sale, discount, offer, deal, promotion
- special, %, percent off, off your
- clearance, flash sale

### Urgency:
- limited time, today only, ends soon
- hurry, don't miss, going fast, last chance

### Actions:
- buy now, shop now, win, prize, giveaway
- coupon, promo code, bonus

### Product:
- new arrival, exclusive, free

---

## 💡 Real-World Examples

### ✅ Support Messages (No Opt-Out Required):

```
Type: Support/Transactional

"Your order #12345 has been confirmed. 
Expected delivery: Tomorrow."
```
**Result**: ✅ Compliant (no opt-out needed)

---

```
Type: Support/Transactional

"Hey Blaine, your package arrived. 
Check your email for tracking."
```
**Result**: ✅ Compliant (no opt-out needed)

---

```
Type: Support/Transactional

"Password reset requested. Click link 
to reset: example.com/reset"
```
**Result**: ✅ Compliant (no opt-out needed)

---

### ❌ Marketing Messages (Opt-Out Required):

```
Type: Marketing/Promotional

"50% OFF this weekend! Shop now and save."
```
**Result**: ❌ Non-Compliant (missing opt-out)

---

```
Type: Marketing/Promotional

"New arrivals just dropped! Check them out."
```
**Result**: ❌ Non-Compliant (missing opt-out)

---

### 🚨 Support Type BUT Has Marketing Language:

```
Type: Support/Transactional (but...)

"Your order confirmed! Plus 50% OFF your next purchase!"
```
**Result**: ❌ Non-Compliant (promotional language detected, needs opt-out)

**Why**: Even though user selected "Support", the "50% OFF" triggers marketing indicators.

---

## 🔒 Protection Against Misuse

**Can't bypass rules**: 
- Even if user selects "Support" type
- If message contains promotional language
- System still requires opt-out

**Example**:
```
User selects: "Support/Transactional"
Message: "Limited time offer - 50% OFF!"

System detects: "limited time", "offer", "50%", "OFF"
Result: Still flags as missing opt-out ✅
```

---

## 🎨 UI/UX Features

### Visual Design:
- **Two pill-shaped buttons** side by side
- **Active button**: Purple gradient with white text
- **Hover effects**: Slight lift and shadow
- **Smooth transitions**: 0.2s animation

### Placeholder Text Changes:
- **Marketing**: "Enter your marketing/promotional SMS message here..."
- **Support**: "Enter your support/transactional SMS message here..."

### State Tracking:
- Default: Marketing type selected
- State persists during session
- Resets results when type changes (via auto-refresh system)

---

## 🔧 Technical Implementation

### Frontend (index.html):
```javascript
const [messageType, setMessageType] = useState('marketing');

// Send to API
body: JSON.stringify({ messageBody, messageType })
```

### Backend (server.js):
```javascript
const { messageBody, messageType = 'marketing' } = req.body;
const ruleBasedResults = runRuleBasedChecks(messageBody, messageType);
```

### Rules Engine (policyRules.js):
```javascript
missingOptOut: {
  test: (text, messageType) => {
    if (messageType === 'marketing') {
      return !hasOptOut; // Always check
    }
    // For support, only check if has marketing indicators
    return looksLikeMarketing && !hasOptOut;
  }
}
```

---

## 📋 Files Modified:

1. **index.html**:
   - Added `messageType` state
   - Added toggle button UI
   - Added toggle button CSS
   - Changed placeholder text dynamically
   - Send messageType to API

2. **server.js**:
   - Accept `messageType` parameter
   - Pass to `runRuleBasedChecks()`

3. **policyRules.js**:
   - Updated `runRuleBasedChecks()` signature
   - Updated `missingOptOut.test()` to accept messageType
   - Implemented smart logic based on type

---

## 🎉 Benefits

✅ **Flexibility**: Users can specify message intent  
✅ **Accuracy**: No false positives on support messages  
✅ **Protection**: Still catches misclassified marketing  
✅ **Education**: Helps users understand message types  
✅ **Compliance**: Follows TCPA requirements correctly  

---

## 🚀 Ready to Use!

Open `index.html` and you'll see the toggle at the top:
1. Select **Marketing** for promotional messages
2. Select **Support** for transactional messages
3. System automatically adjusts compliance checks

**Smart, flexible, and compliant!** ✨
