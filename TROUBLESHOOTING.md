# Troubleshooting Guide - AI Grammar Checker Extension

## Issue: "AI service unavailable" Error

If you're seeing "AI service unavailable" error, follow these steps:

### Step 1: Reload the Extension
1. Go to `chrome://extensions/`
2. Find "AI Grammar Checker Extension"
3. Click the **Reload** button (circular arrow icon)
4. This will reload all files with the latest changes

### Step 2: Check API Key in config.js
Open `config.js` and verify your API key:
```javascript
OPENAI_API_KEY: 'sk-proj-...your-key'
```

The key should:
- Start with `sk-proj-` or `sk-`
- Be a valid OpenAI API key
- Not have any spaces or extra characters

### Step 3: Open Console for Debugging
1. Right-click the extension popup
2. Select "Inspect" or "Inspect Element"
3. Go to the "Console" tab
4. Click "Check Grammar" again
5. Look for error messages

### Step 4: Test the API Connection
You can test if your API key works by running this in the browser console:

```javascript
fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: 'Hello'}]
    })
}).then(r => r.json()).then(console.log)
```

### Step 5: Common Issues

**Issue: "API key not configured"**
- Solution: Make sure config.js has a valid API key

**Issue: "Invalid API key"**
- Solution: Your API key may be expired or invalid. Generate a new one from https://platform.openai.com/api-keys

**Issue: "Quota exceeded"**
- Solution: You've exceeded your OpenAI API usage limit. Check your OpenAI account

**Issue: "Network error"**
- Solution: Check your internet connection and try again

### Step 6: Verify Permissions
In the console, check if the extension has the right permissions:
```javascript
chrome.extension.getBackgroundPage()
```

## Still Not Working?
Contact support with:
1. Error message from console
2. Screenshot of the popup
3. Your config.js (with API key hidden)



