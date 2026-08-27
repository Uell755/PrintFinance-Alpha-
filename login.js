// If already logged in, skip straight to the dashboard.
if(getCurrentUser()){
  window.location.href = 'index.html';
}

document.getElementById('loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  const result = login(email, password);
  if(result.success){
    window.location.href = 'index.html';
  } else {
    errorEl.textContent = result.message;
  }
});
