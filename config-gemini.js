// AI Grammar Checker Extension - Configuration (Google Gemini API - FREE)
// Store your Google Gemini API key here

const CONFIG = {
    // Get your FREE Google Gemini API key from: https://makersuite.google.com/app/apikey
    // No credit card required for free tier!
    GEMINI_API_KEY: 'your-gemini-api-key-here',
    
    // Google Gemini API endpoint
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Which API to use
    USE_GEMINI: true,  // Set to true to use free Gemini API
    USE_OPENAI: false  // Set to false to disable OpenAI (requires credits)
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}




