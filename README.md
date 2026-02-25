# AI Grammar Checker Extension

A Chrome extension that uses OpenAI's GPT-3.5-turbo to correct grammar in user input.

## Features

- ✅ Input text with grammar errors
- ✅ AI-powered grammar correction using OpenAI API
- ✅ Copy corrected text to clipboard
- ✅ Clear both text areas
- ✅ Offline fallback for basic corrections
- ✅ Modern, clean UI with blue-green gradient

## Files

1. **manifest.json** - Chrome extension configuration (Manifest V3)
2. **popup.html** - UI with all required fields and buttons
3. **popup.js** - API integration and button handlers
4. **config.js** - OpenAI API key configuration
5. **style.css** - Modern, clean styling
6. **rules.js** - Grammar correction prompts

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `ai-grammar-checker-extension` folder

## Configuration

Update your OpenAI API key in `config.js`:
```javascript
OPENAI_API_KEY: 'your-api-key-here'
```

## Usage

1. Click the extension icon
2. Enter text with grammar errors in the "Incorrect Text" field
3. Click "Check Grammar"
4. View the corrected text in the "Corrected Text" field
5. Click "Copy" to copy the corrected text
6. Click "Clear" to reset both fields

## Element IDs

- `incorrectText` - Input textarea
- `checkGrammar` - Check Grammar button
- `correctedText` - Output textarea
- `copyText` - Copy button
- `clearText` - Clear button

## API Integration

Uses OpenAI's chat completions API:
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Model: `gpt-3.5-turbo`
- System message: "You are a helpful AI grammar corrector. Fix grammar, punctuation, and clarity errors while keeping meaning the same. Return only the corrected text."

## Error Handling

- Validates API key before making requests
- Shows friendly error messages for API issues
- Falls back to offline regex-based corrections when API fails
- Enables Copy button only when corrected text is available

## Permissions

- `clipboardWrite` - For copying text to clipboard
- `host_permissions: https://api.openai.com/*` - For API calls



