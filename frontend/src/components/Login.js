import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, register } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const data = await loginService(username, password);
        login(data.token);
        navigate('/dashboard');
      } else {
        await register(username, password);
        setSuccess('Account created successfully! You can now login.');
        setMode('login');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Request failed.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">₹</div>
          <h1 className="auth-title">PayLedger</h1>
          <p className="auth-subtitle">Secure · Fast · Auditable</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </div>

        <p className="auth-footer">
          {mode === 'login' ? 'Need a new account?' : 'Already have an account?'}
          <span
            className="auth-link"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Sign Up' : 'Login karo'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
