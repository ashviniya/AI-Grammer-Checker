// content.js - detects selection, copy, and email drafts; shows floating actions

const FLOATING_ID = 'ai-grammar-floating-btn';
const NOTIFY_ID = 'ai-grammar-notify-btn';
const IDLE_CHECK_MS = 3000;

let selectionText = '';
let idleTimer = null;

// Create floating button
function createFloatingButton(id, label) {
  let btn = document.getElementById(id);
  if (!btn) {
    btn = document.createElement('button');
    btn.id = id;
    btn.className = 'ai-grammar-floating';
    btn.textContent = label;
    document.body.appendChild(btn);
  }
  return btn;
}

function showFloating(text, x, y, type = 'selection') {
  if (!text || !text.trim()) return;
  const btn = createFloatingButton(FLOATING_ID, 'AI Grammar Check');
  btn.style.display = 'block';
  btn.style.top = `${y + 12}px`;
  btn.style.left = `${x + 12}px`;
  btn.onclick = () => {
    chrome.runtime.sendMessage({ type: 'prefill-and-correct', text });
    hideFloating();
  };
}

function hideFloating() {
  const btn = document.getElementById(FLOATING_ID);
  if (btn) btn.style.display = 'none';
}

function showNotify(text) {
  if (!text || !text.trim()) return;
  const btn = createFloatingButton(NOTIFY_ID, 'Fix Grammar');
  btn.style.display = 'block';
  btn.style.bottom = '16px';
  btn.style.right = '16px';
  btn.onclick = () => {
    chrome.runtime.sendMessage({ type: 'prefill-and-correct', text });
    hideNotify();
  };
  setTimeout(hideNotify, 6000);
}

function hideNotify() {
  const btn = document.getElementById(NOTIFY_ID);
  if (btn) btn.style.display = 'none';
}

// Detect text selection
document.addEventListener('mouseup', (e) => {
  const text = window.getSelection()?.toString();
  selectionText = text || '';
  if (selectionText.trim()) {
    showFloating(selectionText, e.pageX, e.pageY, 'selection');
  } else {
    hideFloating();
  }
});

// Detect copy event
document.addEventListener('copy', (e) => {
  let text = '';
  const sel = window.getSelection();
  if (sel) text = sel.toString();
  if (!text && e.clipboardData) {
    text = e.clipboardData.getData('text/plain');
  }
  if (text && text.trim()) {
    showNotify(text);
  }
});

// Email draft detection (Gmail, Outlook, Zoho)
const emailHosts = ['mail.google.com', 'outlook', 'zoho'];
if (emailHosts.some((h) => location.hostname.includes(h))) {
  idleTimer = setInterval(() => {
    const active = document.activeElement;
    if (!active) return;
    const isEditable = active.isContentEditable || active.tagName === 'TEXTAREA' || active.tagName === 'INPUT';
    if (!isEditable) return;
    const text = active.isContentEditable ? active.innerText : active.value;
    if (text && text.trim().length > 10) {
      const rect = active.getBoundingClientRect();
      const x = rect.right - 80 + window.scrollX;
      const y = rect.top - 10 + window.scrollY;
      showFloating(text, x, y, 'email');
    }
  }, IDLE_CHECK_MS);
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  hideFloating();
  hideNotify();
  if (idleTimer) clearInterval(idleTimer);
});



