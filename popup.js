// AI Grammar Checker Extension - Popup Script
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const incorrectTextArea = document.getElementById('incorrectText');
    const correctedTextArea = document.getElementById('correctedText');
    const checkGrammarBtn = document.getElementById('checkGrammar');
    const copyBtn = document.getElementById('copyText');
    const clearBtn = document.getElementById('clearText');
    const btnText = checkGrammarBtn.querySelector('.btn-text');
    const btnLoader = checkGrammarBtn.querySelector('.btn-loader');

    // Offline grammar correction fallback function 
    function offlineGrammarCheck(text) {
        let corrected = text.trim();
        
        // Basic capitalization
        corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
        
        // Common grammar fixes using regex
        const fixes = [
            // Subject-verb agreement
            { pattern: /\bhe go\b/gi, replacement: 'he goes' },
            { pattern: /\bshe go\b/gi, replacement: 'she goes' },
            { pattern: /\bit go\b/gi, replacement: 'it goes' },
            { pattern: /\bthey go\b/gi, replacement: 'they go' },
            { pattern: /\bi go\b/gi, replacement: 'I go' },
            { pattern: /\bwe go\b/gi, replacement: 'we go' },
            { pattern: /\byou go\b/gi, replacement: 'you go' },
            
            // Common contractions
            { pattern: /\bdont\b/gi, replacement: "don't" },
            { pattern: /\bwont\b/gi, replacement: "won't" },
            { pattern: /\bcant\b/gi, replacement: "can't" },
            { pattern: /\bwouldnt\b/gi, replacement: "wouldn't" },
            { pattern: /\bshouldnt\b/gi, replacement: "shouldn't" },
            { pattern: /\bcouldnt\b/gi, replacement: "couldn't" },
            { pattern: /\bhavent\b/gi, replacement: "haven't" },
            { pattern: /\bhasnt\b/gi, replacement: "hasn't" },
            { pattern: /\bhadnt\b/gi, replacement: "hadn't" },
            { pattern: /\bisnt\b/gi, replacement: "isn't" },
            { pattern: /\barent\b/gi, replacement: "aren't" },
            { pattern: /\bwasnt\b/gi, replacement: "wasn't" },
            { pattern: /\bwerent\b/gi, replacement: "weren't" },
            
            // Pronoun corrections
            { pattern: /\bi\b/g, replacement: 'I' },
            { pattern: /\bme and\b/gi, replacement: 'I and' },
            { pattern: /\bhim and me\b/gi, replacement: 'he and I' },
            { pattern: /\bher and me\b/gi, replacement: 'she and I' },
            
            // Common misspellings
            { pattern: /\byour welcome\b/gi, replacement: "you're welcome" },
            { pattern: /\bthere going\b/gi, replacement: "they're going" },
            { pattern: /\bits a\b/gi, replacement: "it's a" },
            { pattern: /\bits the\b/gi, replacement: "it's the" },
            { pattern: /\bcould of\b/gi, replacement: 'could have' },
            { pattern: /\bwould of\b/gi, replacement: 'would have' },
            { pattern: /\bshould of\b/gi, replacement: 'should have' },
            
            // Basic punctuation
            { pattern: /\s+/g, replacement: ' ' }, // Multiple spaces to single space
        ];
        
        // Apply all fixes
        fixes.forEach(fix => {
            corrected = corrected.replace(fix.pattern, fix.replacement);
        });
        
        // Add period if no punctuation at the end
        if (!/[.!?]$/.test(corrected.trim())) {
            corrected = corrected.trim() + '.';
        }
        
        return corrected.trim();
    }

    // Get API key from CONFIG
    const API_KEY = CONFIG.OPENAI_API_KEY;

    // Real AI grammar correction function using OpenAI API
    async function checkGrammarWithAI(text) {
        console.log('Starting AI grammar check...');
        console.log('API Key available:', !!API_KEY);
        
        // Validate API key
        if (!API_KEY || API_KEY === 'your-openai-api-key-here' || !API_KEY.startsWith('sk-')) {
            throw new Error('API key not configured. Please check config.js');
        }

        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI grammar corrector. Fix grammar, punctuation, and clarity errors while keeping meaning the same. Return only the corrected text."
                },
                {
                    role: "user",
                    content: text
                }
            ]
        };

        console.log('Making API request to:', CONFIG.OPENAI_API_URL);
        
        const response = await fetch(CONFIG.OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'https://chrome.google.com/',  // Required for OpenRouter
                'X-Title': 'AI Grammar Checker Extension'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            const errorMessage = errorData.error?.message || 'Unknown error';
            
            // Check for specific error types
            if (response.status === 429) {
                if (errorMessage.includes('quota')) {
                    throw new Error('QUOTA_EXCEEDED: Your OpenAI account has exceeded its quota. Please add credits at https://platform.openai.com/billing');
                } else {
                    throw new Error('RATE_LIMIT: Too many requests. Please wait a moment and try again.');
                }
            }
            
            throw new Error(`API Error: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('API Response received');
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response from AI');
        }

        const correctedText = data.choices[0].message.content.trim();
        console.log('Corrected text:', correctedText);
        return correctedText;
    }

    async function runGrammarCheck() {
        const inputText = incorrectTextArea.value.trim();
        
        if (!inputText) {
            alert('Please enter some text to check.');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        checkGrammarBtn.disabled = true;

        try {
            // Try AI grammar check first
            const correctedText = await checkGrammarWithAI(inputText);
            
            // Display corrected text
            correctedTextArea.value = correctedText;
            
            // Enable copy button
            copyBtn.disabled = false;
            
        } catch (error) {
            console.error('AI API Error:', error);
            
            // Check error type and show appropriate message
            if (error.message.includes('API key not configured')) {
                alert('❌ API key is missing or invalid.\n\nPlease configure your OpenAI/OpenRouter API key in config.js');
            } else if (error.message.includes('QUOTA_EXCEEDED')) {
                alert('❌ Account Quota Exceeded\n\nYour API quota has been used up.\n\nTo fix this:\n1. Add credits to your account\n2. Try again');
            } else if (error.message.includes('RATE_LIMIT')) {
                alert('⚠️ Rate Limit Exceeded\n\nToo many requests. Please wait a moment and try again.');
            } else if (error.message.includes('Invalid API key')) {
                alert('❌ Invalid API Key\n\nYour API key is invalid or expired.\n\nGet a new key from your provider.');
            } else if (error.message.includes('API Error')) {
                alert('❌ API Error\n\n' + error.message);
            } else {
                alert('⚠️ AI service unavailable. Please try again later.\n\nUsing offline correction instead.');
            }
            
            // Use offline fallback
            const fallbackText = offlineGrammarCheck(inputText);
            correctedTextArea.value = fallbackText;
            
            // Enable copy button
            copyBtn.disabled = false;
        } finally {
            // Hide loading state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            checkGrammarBtn.disabled = false;
        }
    }

    // Check Grammar Button Click Handler
    checkGrammarBtn.addEventListener('click', runGrammarCheck);

    // Copy Button Click Handler
    copyBtn.addEventListener('click', async function() {
        const correctedText = correctedTextArea.value.trim();
        
        if (!correctedText) {
            alert('No corrected text to copy.');
            return;
        }

        try {
            // Use navigator.clipboard.writeText() with clipboardWrite permission
            await navigator.clipboard.writeText(correctedText);
            
            // Show success message
            alert('Copied successfully!');
            
        } catch (error) {
            console.error('Error copying text:', error);
            alert('Failed to copy text. Please try again.');
        }
    });

    // Clear Button Click Handler
    clearBtn.addEventListener('click', function() {
        // Clear both text areas
        incorrectTextArea.value = '';
        correctedTextArea.value = '';
        
        // Disable copy button
        copyBtn.disabled = true;
        
        // Focus on input textarea
        incorrectTextArea.focus();
    });

    // Enable/disable copy button based on corrected text
    correctedTextArea.addEventListener('input', function() {
        copyBtn.disabled = !this.value.trim();
    });

    // Auto-resize textareas
    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    incorrectTextArea.addEventListener('input', function() {
        autoResize(this);
    });

    correctedTextArea.addEventListener('input', function() {
        autoResize(this);
    });

    // Initial focus
    incorrectTextArea.focus();

    // Prefill from storage and auto-run if provided
    chrome.storage.local.get(['prefillText', 'autoRun'], (data) => {
        if (data.prefillText) {
            incorrectTextArea.value = data.prefillText;
            autoResize(incorrectTextArea);
            // Clear stored prefill to avoid repeat
            chrome.storage.local.remove(['prefillText', 'autoRun']);
            if (data.autoRun) {
                runGrammarCheck();
            }
        }
    });
});
