// ---------- Shared local storage helpers (used by index.html and settings.html) ----------
const STORAGE_KEYS = {
  TRANSACTIONS: 'printfinance_transactions',
  THEME: 'printfinance_theme'
};

function loadTransactions(){
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    console.error('Could not read transactions from storage', e);
    return [];
  }
}

function saveTransactions(transactions){
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch(e){
    console.error('Could not save transactions to storage', e);
  }
}

function clearTransactions(){
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
}

function loadTheme(){
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'original';
}

function saveTheme(theme){
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
}

// Apply the saved theme immediately (before the page paints) to avoid a flash of the wrong theme.
applyTheme(loadTheme());
