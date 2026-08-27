// If already logged in, skip straight to the dashboard.
if(getCurrentUser()){
  window.location.href = 'index.html';
}

document.getElementById('signupForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const errorEl = document.getElementById('signupError');

  if(password !== confirm){
    errorEl.textContent = 'Passwords do not match.';
    return;
  }
  if(password.length < 6){
    errorEl.textContent = 'Password should be at least 6 characters.';
    return;
  }

  const result = signUp(name, email, password);
  if(result.success){
    window.location.href = 'index.html';
  } else {
    errorEl.textContent = result.message;
  }
});
