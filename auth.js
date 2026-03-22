sb.auth.onAuthStateChange((event, session) => {
  if (session) {
    window.currentUser = session.user;
    document.getElementById('auth-screen')?.remove();
    document.getElementById('trip-screen')?.remove();
    showTripScreen();
  } else {
    showAuthScreen();
  }
});

function showAuthScreen() {
  const existing = document.getElementById('auth-screen');
  if (existing) return;
  const div = document.createElement('div');
  div.id = 'auth-screen';
  div.style.cssText = 'position:fixed;inset:0;background:#06090f;display:flex;align-items:center;justify-content:center;z-index:9999;';
  div.innerHTML = `
    <div style="background:#0b1120;border:1px solid rgba(61,255,192,.15);border-radius:12px;padding:2.5rem;width:340px;">
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:#3DFFC0;margin-bottom:.3rem;">Trip<span style="color:#F7C948;">Sync</span></div>
      <p style="font-size:.7rem;color:#3d5570;margin-bottom:1.8rem;">Plan your group trip together</p>
      <input id="auth-email" type="email" placeholder="Email"
        style="width:100%;padding:.8rem;background:#06090f;border:1px solid rgba(61,255,192,.2);border-radius:4px;color:#EDF5FF;margin-bottom:.8rem;font-family:'DM Sans',sans-serif;font-size:.85rem;outline:none;box-sizing:border-box;">
      <input id="auth-password" type="password" placeholder="Password"
        style="width:100%;padding:.8rem;background:#06090f;border:1px solid rgba(61,255,192,.2);border-radius:4px;color:#EDF5FF;margin-bottom:1.2rem;font-family:'DM Sans',sans-serif;font-size:.85rem;outline:none;box-sizing:border-box;">
      <button onclick="handleLogin()"
        style="width:100%;padding:.9rem;background:#3DFFC0;color:#06090f;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:4px;cursor:pointer;margin-bottom:.6rem;">
        Sign in / Sign up
      </button>
      <p id="auth-msg" style="font-size:.7rem;color:#FF6B8A;text-align:center;min-height:1rem;"></p>
    </div>
  `;
  document.body.appendChild(div);
}

async function handleLogin() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const msg = document.getElementById('auth-msg');
  msg.textContent = 'Signing in...';
  msg.style.color = '#3d5570';

  let { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    const { error: signUpError } = await sb.auth.signUp({ email, password });
    if (signUpError) { msg.style.color = '#FF6B8A'; msg.textContent = signUpError.message; return; }
    msg.style.color = '#3DFFC0';
    msg.textContent = 'Check your email to confirm signup!';
    return;
  }
}

function showTripScreen() {
  const existing = document.getElementById('trip-screen');
  if (existing) return;
  const div = document.createElement('div');
  div.id = 'trip-screen';
  div.style.cssText = 'position:fixed;inset:0;background:#06090f;display:flex;align-items:center;justify-content:center;z-index:9998;';
  div.innerHTML = `
    <div style="background:#0b1120;border:1px solid rgba(61,255,192,.15);border-radius:12px;padding:2.5rem;width:380px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:#3DFFC0;">Trip<span style="color:#F7C948;">Sync</span></div>
        <button onclick="handleLogout()" style="background:transparent;border:1px solid rgba(61,255,192,.15);color:#3d5570;font-family:'DM Sans',sans-serif;font-size:.6rem;padding:.3rem .7rem;border-radius:3px;cursor:pointer;letter-spacing:.05em;">Sign out</button>
      </div>
      <p style="font-size:.7rem;color:#3d5570;margin-bottom:2rem;">Signed in as ${window.currentUser?.email}</p>

      <div style="margin-bottom:1.5rem;">
        <p style="font-size:.6rem;letter-spacing:.2em;color:#F7C948;text-transform:uppercase;font-weight:600;margin-bottom:.8rem;">Start a new trip</p>
        <input id="trip-name" type="text" placeholder="Trip name (e.g. Europe Squad 2025)"
          style="width:100%;padding:.8rem;background:#06090f;border:1px solid rgba(61,255,192,.2);border-radius:4px;color:#EDF5FF;margin-bottom:.8rem;font-family:'DM Sans',sans-serif;font-size:.85rem;outline:none;box-sizing:border-box;">
        <button onclick="handleCreateTrip()"
          style="width:100%;padding:.85rem;background:linear-gradient(135deg,#3DFFC0,#5BCFFF);color:#06090f;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:4px;cursor:pointer;">
          Create Trip →
        </button>
      </div>

      <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:1.5rem;">
        <div style="flex:1;height:1px;background:rgba(61,255,192,.08);"></div>
        <span style="font-size:.6rem;color:#3d5570;letter-spacing:.1em;">OR</span>
        <div style="flex:1;height:1px;background:rgba(61,255,192,.08);"></div>
      </div>

      <div>
        <p style="font-size:.6rem;letter-spacing:.2em;color:#FF6B8A;text-transform:uppercase;font-weight:600;margin-bottom:.8rem;">Join a trip</p>
        <input id="invite-code" type="text" placeholder="Enter invite code"
          style="width:100%;padding:.8rem;background:#06090f;border:1px solid rgba(255,107,138,.2);border-radius:4px;color:#EDF5FF;margin-bottom:.8rem;font-family:'DM Sans',sans-serif;font-size:.85rem;outline:none;box-sizing:border-box;letter-spacing:.1em;">
        <button onclick="handleJoinTrip()"
          style="width:100%;padding:.85rem;background:transparent;border:1px solid rgba(255,107,138,.35);color:#FF6B8A;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;border-radius:4px;cursor:pointer;">
          Join Trip →
        </button>
      </div>

      <p id="trip-msg" style="font-size:.7rem;color:#FF6B8A;text-align:center;margin-top:1rem;min-height:1rem;"></p>
    </div>
  `;
  document.body.appendChild(div);
}

async function handleCreateTrip() {
  const name = document.getElementById('trip-name').value.trim();
  const msg = document.getElementById('trip-msg');
  if (!name) { msg.textContent = 'Please enter a trip name'; return; }
  msg.style.color = '#3d5570';
  msg.textContent = 'Creating trip...';

  const trip = await createTrip(name);
  if (!trip) { msg.style.color = '#FF6B8A'; msg.textContent = 'Something went wrong'; return; }

  showInviteCode(trip.invite_code, trip.name);
}

async function handleJoinTrip() {
  const code = document.getElementById('invite-code').value.trim();
  const msg = document.getElementById('trip-msg');
  if (!code) { msg.textContent = 'Please enter an invite code'; return; }
  msg.style.color = '#3d5570';
  msg.textContent = 'Joining trip...';

  const trip = await joinTrip(code);
  if (!trip) return;

  document.getElementById('trip-screen')?.remove();
  initApp();
}

function showInviteCode(code, tripName) {
  const div = document.getElementById('trip-screen');
  div.innerHTML = `
    <div style="background:#0b1120;border:1px solid rgba(61,255,192,.15);border-radius:12px;padding:2.5rem;width:380px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:.8rem;">🎉</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:#EDF5FF;margin-bottom:.3rem;">${tripName}</div>
      <p style="font-size:.7rem;color:#3d5570;margin-bottom:1.8rem;">Share this code with your squad</p>

      <div style="background:#06090f;border:1px solid rgba(61,255,192,.25);border-radius:8px;padding:1.2rem;margin-bottom:.8rem;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:#3DFFC0;letter-spacing:.2em;">${code}</div>
      </div>

      <button onclick="copyCode('${code}')" id="copy-btn"
        style="width:100%;padding:.85rem;background:rgba(61,255,192,.08);border:1px solid rgba(61,255,192,.25);color:#3DFFC0;font-family:'DM Sans',sans-serif;font-weight:600;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;border-radius:4px;cursor:pointer;margin-bottom:1.5rem;">
        Copy Code
      </button>

      <button onclick="document.getElementById('trip-screen')?.remove();initApp();"
        style="width:100%;padding:.85rem;background:linear-gradient(135deg,#3DFFC0,#5BCFFF);color:#06090f;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:4px;cursor:pointer;">
        Start Planning →
      </button>
    </div>
  `;
}

function copyCode(code) {
  navigator.clipboard.writeText(code);
  const btn = document.getElementById('copy-btn');
  if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy Code'; }, 2000); }
}

async function handleLogout() {
  await sb.auth.signOut();
  window.currentUser = null;
  window.currentTripId = null;
  document.getElementById('trip-screen')?.remove();
  showAuthScreen();
}