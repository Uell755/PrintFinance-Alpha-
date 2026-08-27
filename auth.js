// ---------- Prototype auth (localStorage-based) ----------
// NOTE: This stores account info, including passwords, in plain text in the
// browser's localStorage. That's fine for a working prototype, but it is NOT
// secure and should be replaced with real server-side auth + password
// hashing before this app handles real accounts.

const AUTH_KEYS = {
  USERS: 'printfinance_users',
  SESSION: 'printfinance_session'
};

function getUsers(){
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
  } catch(e){
    console.error('Could not read users from storage', e);
    return [];
  }
}

function saveUsers(users){
  localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser(){
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.SESSION));
  } catch(e){
    return null;
  }
}

function setCurrentUser(user){
  localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify({ name: user.name, email: user.email }));
}

function logout(){
  localStorage.removeItem(AUTH_KEYS.SESSION);
  window.location.href = 'login.html';
}

function signUp(name, email, password){
  name = (name || '').trim();
  email = (email || '').trim().toLowerCase();

  if(!name || !email || !password){
    return { success:false, message:'Please fill in all fields.' };
  }
  const users = getUsers();
  if(users.some(u => u.email === email)){
    return { success:false, message:'An account with that email already exists.' };
  }

  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return { success:true };
}

function login(email, password){
  email = (email || '').trim().toLowerCase();
  const users = getUsers();
  const match = users.find(u => u.email === email && u.password === password);

  if(!match){
    return { success:false, message:'Incorrect email or password.' };
  }
  setCurrentUser(match);
  return { success:true };
}

// Call at the top of any page that requires a logged-in user.
function requireAuth(){
  if(!getCurrentUser()){
    window.location.href = 'login.html';
  }
}
