/**
 * NestFind — Shared Auth & Data Layer (localStorage prototype)
 * Include this script in every page: <script src="auth.js"></script>
 */

const NF = (() => {

  /* ─────────── KEYS ─────────── */
  const KEYS = {
    users:      'nf_users',
    session:    'nf_session',
    properties: 'nf_properties',
    otp:        'nf_otp_temp',
  };

  /* ─────────── HELPERS ─────────── */
  const get  = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const set  = (k,v) => localStorage.setItem(k, JSON.stringify(v));
  const uid  = () => 'u_' + Math.random().toString(36).slice(2,10) + Date.now().toString(36);
  const pid  = () => 'p_' + Math.random().toString(36).slice(2,10) + Date.now().toString(36);

  /* ─────────── USERS ─────────── */
  const getUsers = () => get(KEYS.users) || {};
  const saveUsers = u => set(KEYS.users, u);

  /* ─────────── SESSION ─────────── */
  const getSession = () => get(KEYS.session);
  const setSession = user => set(KEYS.session, user);
  const clearSession = () => localStorage.removeItem(KEYS.session);

  const getCurrentUser = () => {
    const s = getSession();
    if (!s) return null;
    const users = getUsers();
    return users[s.id] || null;
  };

  /* ─────────── AUTH: EMAIL ─────────── */
  const registerEmail = ({ name, email, phone, password, role }) => {
    const users = getUsers();
    const emailKey = email.toLowerCase().trim();
    const existing = Object.values(users).find(u => u.email === emailKey);
    if (existing) return { ok: false, msg: 'An account with this email already exists.' };

    const id = uid();
    const user = {
      id, name: name.trim(), email: emailKey,
      phone: phone ? phone.trim() : '',
      password, // plain text — prototype only, never do this in production
      role: role || 'buyer',
      city: '', dob: '', budget: '', intent: [], propertyType: [], bhk: [],
      createdAt: Date.now(),
    };
    users[id] = user;
    saveUsers(users);
    setSession({ id });
    return { ok: true, user };
  };

  const loginEmail = ({ email, password }) => {
    const users = getUsers();
    const emailKey = email.toLowerCase().trim();
    const user = Object.values(users).find(u => u.email === emailKey);
    if (!user) return { ok: false, msg: 'No account found with this email.' };
    if (user.password !== password) return { ok: false, msg: 'Incorrect password.' };
    setSession({ id: user.id });
    return { ok: true, user };
  };

  /* ─────────── AUTH: PHONE OTP (simulated) ─────────── */
  const sendOTP = (phone) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) return { ok: false, msg: 'Enter a valid 10-digit phone number.' };
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    set(KEYS.otp, { phone: clean, otp, expires: Date.now() + 5 * 60 * 1000 });
    console.log(`[NestFind OTP] Phone: ${clean} → OTP: ${otp}`); // visible in DevTools
    return { ok: true, otp }; // returned so UI can show it in prototype
  };

  const verifyOTP = (phone, enteredOtp) => {
    const temp = get(KEYS.otp);
    if (!temp) return { ok: false, msg: 'No OTP sent. Please request again.' };
    if (Date.now() > temp.expires) return { ok: false, msg: 'OTP expired. Please request again.' };
    const clean = phone.replace(/\D/g, '');
    if (temp.phone !== clean) return { ok: false, msg: 'Phone number mismatch.' };
    if (temp.otp !== enteredOtp.trim()) return { ok: false, msg: 'Incorrect OTP.' };

    localStorage.removeItem(KEYS.otp);

    // Find or create user by phone
    const users = getUsers();
    let user = Object.values(users).find(u => u.phone && u.phone.replace(/\D/g,'') === clean);
    if (!user) {
      const id = uid();
      user = {
        id, name: 'User_' + clean.slice(-4), email: '', phone: clean,
        password: '', role: 'buyer', city: '', dob: '', budget: '',
        intent: [], propertyType: [], bhk: [], createdAt: Date.now(),
      };
      users[id] = user;
      saveUsers(users);
    }
    setSession({ id: user.id });
    return { ok: true, user };
  };

  const logout = () => {
    clearSession();
    window.location.href = 'login.html';
  };

  /* ─────────── PROFILE ─────────── */
  const updateProfile = (fields) => {
    const s = getSession();
    if (!s) return { ok: false, msg: 'Not logged in.' };
    const users = getUsers();
    if (!users[s.id]) return { ok: false, msg: 'User not found.' };
    users[s.id] = { ...users[s.id], ...fields };
    saveUsers(users);
    return { ok: true, user: users[s.id] };
  };

  const changePassword = (currentPass, newPass) => {
    const s = getSession();
    if (!s) return { ok: false, msg: 'Not logged in.' };
    const users = getUsers();
    const user = users[s.id];
    if (!user) return { ok: false, msg: 'User not found.' };
    if (user.password && user.password !== currentPass) return { ok: false, msg: 'Current password is incorrect.' };
    users[s.id].password = newPass;
    saveUsers(users);
    return { ok: true };
  };

  /* ─────────── PROPERTIES ─────────── */
  const getProperties = () => get(KEYS.properties) || [];
  const saveProperties = p => set(KEYS.properties, p);

  const postProperty = (fields) => {
    const user = getCurrentUser();
    if (!user) return { ok: false, msg: 'You must be logged in to post a property.' };
    const props = getProperties();
    const prop = {
      id: pid(),
      ownerId: user.id,
      ownerName: user.name,
      ownerPhone: user.phone,
      ownerEmail: user.email,
      ...fields,
      photos: fields.photos || [],
      postedAt: Date.now(),
    };
    props.unshift(prop);
    saveProperties(props);
    return { ok: true, property: prop };
  };

  /* ─────────── ENQUIRIES ─────────── */
  const ENQUIRY_KEY = 'nf_enquiries';
  const getEnquiries = () => get(ENQUIRY_KEY) || [];
  const saveEnquiries = e => set(ENQUIRY_KEY, e);

  const sendEnquiry = ({ propertyId, name, phone, email, message }) => {
    const enqs = getEnquiries();
    const enq = {
      id: 'e_' + Math.random().toString(36).slice(2,10),
      propertyId, name, phone, email, message,
      sentAt: Date.now(),
    };
    enqs.unshift(enq);
    saveEnquiries(enqs);
    return { ok: true, enquiry: enq };
  };

  const getPropertyEnquiries = (propertyId) =>
    getEnquiries().filter(e => e.propertyId === propertyId);

  const getUserProperties = (userId) => {
    return getProperties().filter(p => p.ownerId === userId);
  };

  const deleteProperty = (propertyId) => {
    const user = getCurrentUser();
    if (!user) return { ok: false, msg: 'Not logged in.' };
    let props = getProperties();
    const idx = props.findIndex(p => p.id === propertyId && p.ownerId === user.id);
    if (idx === -1) return { ok: false, msg: 'Property not found or unauthorized.' };
    props.splice(idx, 1);
    saveProperties(props);
    return { ok: true };
  };

  /* ─────────── GUARD ─────────── */
  // Call on pages that require login. Redirects to login if not authenticated.
  const requireAuth = () => {
    if (!getSession()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  };

  /* ─────────── NAV HELPER ─────────── */
  // Call after DOM loads to update nav avatar initial
  const updateNav = () => {
    const user = getCurrentUser();
    const avatars = document.querySelectorAll('.nav-avatar');
    avatars.forEach(el => {
      if (user) {
        el.textContent = user.name.charAt(0).toUpperCase();
        el.style.background = '#c9a84c';
        el.title = user.name;
        el.onclick = () => window.location.href = 'profile.html';
      } else {
        el.textContent = '👤';
        el.onclick = () => window.location.href = 'login.html';
      }
    });
  };

  return {
    registerEmail, loginEmail, sendOTP, verifyOTP, logout,
    getCurrentUser, getSession, requireAuth, updateNav,
    updateProfile, changePassword,
    getProperties, postProperty, getUserProperties, deleteProperty,
    sendEnquiry, getEnquiries, getPropertyEnquiries,
  };
})();
