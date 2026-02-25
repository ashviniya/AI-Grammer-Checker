// background.js - handles context menu, messages, and opening popup

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'aiGrammarCheck',
    title: 'Check Grammar with AI',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'aiGrammarCheck' && info.selectionText) {
    await setPrefillText(info.selectionText);
    await openPopup();
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'prefill-text' && message.text) {
    setPrefillText(message.text).then(openPopup);
    sendResponse({ ok: true });
    return true; // keep channel open
  }
  if (message?.type === 'prefill-and-correct' && message.text) {
    setPrefillText(message.text, { autoRun: true }).then(openPopup);
    sendResponse({ ok: true });
    return true;
  }
});

async function setPrefillText(text, options = {}) {
  const payload = {
    prefillText: text,
    autoRun: !!options.autoRun
  };
  await chrome.storage.local.set(payload);
}

async function openPopup() {
  try {
    await chrome.action.openPopup();
  } catch (err) {
    console.error('Failed to open popup:', err);
  }
}



