// AI Grammar Checker Extension - Rules & Prompts
// This file contains the system prompt for grammar correction

const GRAMMAR_RULES = `
You are a helpful AI grammar corrector.
Your task is to fix grammar, punctuation, and clarity errors in any given text while keeping the meaning the same.
Always return only the corrected sentence — no explanations or rephrasing.
`;

// Function to create the prompt with user text
function createGrammarPrompt(userText) {
    return `
Input: ${userText}
Output:
`.trim();
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.GRAMMAR_RULES = GRAMMAR_RULES;
    window.createGrammarPrompt = createGrammarPrompt;
}



