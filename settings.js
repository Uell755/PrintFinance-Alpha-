// ---------- Account / session UI ----------
const currentUser = getCurrentUser();
if(currentUser){
  document.getElementById('currentUserName').textContent = currentUser.name;
}

const accountDropdown = document.getElementById('accountDropdown');
document.getElementById('accountToggle').addEventListener('click', (e)=>{
  e.stopPropagation();
  accountDropdown.classList.toggle('open');
});
document.getElementById('logoutBtn').addEventListener('click', logout);
document.addEventListener('click', ()=> accountDropdown.classList.remove('open'));

// ---------- Theme picker ----------
const themeGrid = document.getElementById('themeGrid');

function markSelectedTheme(){
  const current = loadTheme();
  themeGrid.querySelectorAll('.theme-option').forEach(opt=>{
    opt.classList.toggle('selected', opt.dataset.theme === current);
  });
}

themeGrid.querySelectorAll('.theme-option').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    const theme = opt.dataset.theme;
    applyTheme(theme);
    saveTheme(theme);
    markSelectedTheme();
  });
});

// ---------- Data management ----------
document.getElementById('clearDataBtn').addEventListener('click', ()=>{
  if(confirm('This will permanently delete all saved transactions on this device. Continue?')){
    clearTransactions();
    alert('All transactions cleared.');
  }
});

markSelectedTheme();
