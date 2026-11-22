import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const getStrength = () => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const hashPassword = async (text, salt) => {
    const buffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(salt + ':' + text)
    );

    return [...new Uint8Array(buffer)]
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      setMessage('Enter your full name.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setMessage('Enter a valid email address.');
      return;
    }

    if (!role) {
      setMessage('Choose a role.');
      return;
    }

    if (password.length < 6) {
      setMessage('Use at least 6 characters.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('ae_users') || '[]');

    if (users.some(user => user.email === cleanEmail)) {
      setMessage('This email is already registered. Log in instead.');
      return;
    }

    try {
      const salt = crypto.getRandomValues(new Uint32Array(2)).join('');

      const hashedPassword = await hashPassword(password, salt);

      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        role: role,
        salt: salt,
        pass: hashedPassword
      };

      users.push(newUser);

      localStorage.setItem('ae_users', JSON.stringify(users));

      navigate('/login?registered=1');

    } catch {
      setMessage(
        'Sign up needs HTTPS or localhost. Open the site through a local server.'
      );
    }
  };

  const strengthLabels = [
    'Very weak',
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ];

  const strength = getStrength();

  return (
    <main>
      <section className="auth-section">

        <div className="auth-card glass">

          <div className="auth-icon">🧑‍🎓</div>

          <span className="eyebrow">Get Started</span>

          <h1>Create Account</h1>

          <p>
            Register as a student, teacher or administrator.
          </p>

          <form onSubmit={handleSignup} noValidate>

            <label htmlFor="signup-name">Full Name</label>

            <input
              id="signup-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />

            <label htmlFor="signup-email">Email</label>

            <input
              id="signup-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <label htmlFor="signup-role">Role</label>

            <select
              id="signup-role"
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Choose a role</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Administrator">Administrator</option>
            </select>

            <label htmlFor="signup-password">Password</label>

            <input
              id="signup-password"
              className="input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
            />

            <button
              type="button"
              className="password-toggle btn btn-outline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>

            <div className="password-strength" aria-live="polite">
              <div>
                <span style={{ width: `${strength * 25}%` }}></span>
              </div>

              <small>
                {password ? strengthLabels[strength] : 'Password strength'}
              </small>
            </div>

            {message && (
              <p className="form-status" role="alert">
                {message}
              </p>
            )}

            <button className="btn btn-primary full" type="submit">
              Create Account
            </button>

          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login</Link>
          </p>

        </div>

      </section>
    </main>
  );
}

export default Signup;