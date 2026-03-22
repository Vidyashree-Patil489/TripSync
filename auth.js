// Runs once on page load — checks if user is already logged in
sb.auth.onAuthStateChange((event, session) => {
  if (session) {
    // user is logged in — show the app, hide auth screen
    window.currentUser = session.user;
    document.getElementById('auth-screen')?.remove();
    initApp(); // defined in app.js
  } else {
    // no session — show a login UI
    showAuthScreen();
  }
});

function showAuthScreen() {
  // inject a simple login/signup overlay into the page
  const div = document.createElement('div');
  div.id = 'auth-screen';
  div.style.cssText = 'position:fixed;inset:0;background:#06090f;display:flex;align-items:center;justify-content:center;z-index:9999;';
  div.innerHTML = `
    <div style="background:#0b1120;border:1px solid rgba(61,255,192,.15);border-radius:12px;padding:2.5rem;width:340px;">
      <h2 style="font-family:'Cormorant Garamond',serif;color:#3DFFC0;margin-bottom:1.5rem;">Join TripSync</h2>
      <input id="auth-email" type="email" placeholder="Email" 
        style="width:100%;padding:.8rem;background:#06090f;border:1px solid rgba(61,255,192,.2);border-radius:4px;color:#EDF5FF;margin-bottom:.8rem;">
      <input id="auth-password" type="password" placeholder="Password"
        style="width:100%;padding:.8rem;background:#06090f;border:1px solid rgba(61,255,192,.2);border-radius:4px;color:#EDF5FF;margin-bottom:1.2rem;">
      <button onclick="handleLogin()" 
        style="width:100%;padding:.9rem;background:#3DFFC0;color:#06090f;font-weight:700;border:none;border-radius:4px;cursor:pointer;margin-bottom:.6rem;">
        Sign in / Sign up
      </button>
      <p id="auth-msg" style="font-size:.7rem;color:#FF6B8A;text-align:center;"></p>
    </div>
  `;
  document.body.appendChild(div);
}

async function handleLogin() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const msg = document.getElementById('auth-msg');

  // try sign in first, then sign up if user doesn't exist
  let { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    const { error: signUpError } = await sb.auth.signUp({ email, password });
    if (signUpError) { msg.textContent = signUpError.message; return; }
    msg.style.color = '#3DFFC0';
    msg.textContent = 'Check your email to confirm signup!';
  }
  // onAuthStateChange fires automatically on success
}