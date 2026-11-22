import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const registered = new URLSearchParams(window.location.search).has('registered');

  const hashPassword = async (text, salt) => {
    const buffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(salt + ':' + text)
    );

    return [...new Uint8Array(buffer)]
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setMessage('Enter a valid email address.');
      setMessageType('error');
      return;
    }

    if (!password) {
      setMessage('Enter your password.');
      setMessageType('error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('ae_users') || '[]');

    const user = users.find(u => u.email === cleanEmail);

    const attemptsKey = 'ae_login_attempts_' + cleanEmail;
    const lockKey = 'ae_login_lock_' + cleanEmail;

    const lockUntil = JSON.parse(localStorage.getItem(lockKey) || '0');

    if (lockUntil > Date.now()) {
      setMessage(
        `Too many failed attempts. Try again in ${Math.ceil(
          (lockUntil - Date.now()) / 1000
        )} seconds.`
      );
      setMessageType('error');
      return;
    }

    try {
      if (!user || (await hashPassword(password, user.salt)) !== user.pass) {
        const attempts =
          JSON.parse(localStorage.getItem(attemptsKey) || '0') + 1;

        if (attempts >= 3) {
          localStorage.setItem(lockKey, JSON.stringify(Date.now() + 30000));
          localStorage.setItem(attemptsKey, '0');

          setMessage('Three failed attempts. Login locked for 30 seconds.');
        } else {
          localStorage.setItem(attemptsKey, JSON.stringify(attempts));

          setMessage(
            `Email or password is incorrect. Attempt ${attempts} of 3.`
          );
        }

        setMessageType('error');
        return;
      }

      localStorage.setItem(attemptsKey, '0');
      localStorage.setItem(lockKey, '0');

      const session = {
        name: user.name,
        email: user.email,
        role: user.role
      };

      login(session, remember);
      navigate('/attendance');

    } catch {
      setMessage('Login requires HTTPS or localhost.');
      setMessageType('error');
    }
  };

  return (
    <main>
      <section className="auth-section">
        <div className="auth-card glass">

          <div className="auth-icon">🔐</div>

          <span className="eyebrow">Welcome Back</span>

          <h1>Sign In</h1>

          <p>Access your attendance dashboard.</p>

          <form onSubmit={handleLogin} noValidate>

            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              className="input"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <button
              className="password-toggle btn btn-outline"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>

            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            {registered && !message && (
              <p className="form-status ok">
                Account created. Log in to continue.
              </p>
            )}

            {message && (
              <p className={`form-status ${messageType}`}>
                {message}
              </p>
            )}

            <button className="btn btn-primary full" type="submit">
              Login
            </button>

          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>

        </div>
      </section>
    </main>
  );
}

export default Login;