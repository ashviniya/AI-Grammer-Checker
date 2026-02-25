// AI Grammar Checker Extension - Configuration
// Store your OpenAI API key here

const CONFIG = {
    // Replace 'your-openai-api-key-here' with your actual OpenAI API key
    OPENAI_API_KEY: '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',
    
    // OpenRouter API endpoint (OpenAI compatible)
    OPENAI_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    
    // Model to use for grammar correction
    MODEL: 'openai/gpt-3.5-turbo',  // Free on OpenRouter
    
    // Maximum tokens for response
    MAX_TOKENS: 500, 
    
    // Temperature for response generation (0.1 for more consistent corrections)
    TEMPERATURE: 0.1 
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

