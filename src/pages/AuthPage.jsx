import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Shield, Zap, Package, BarChart3, Database, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const { login, signup } = useApp();
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('sarah@nexuspos.com');
  const [signInPassword, setSignInPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('CASHIER');

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      await login(signInEmail, signInPassword);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole
      });
      setSuccessMessage('Account created successfully! Logging you in...');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create account. Email might already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickFillAdmin = () => {
    setActiveTab('signin');
    setSignInEmail('sarah@nexuspos.com');
    setSignInPassword('password');
    setErrorMessage('');
  };

  const quickFillCashier = () => {
    setActiveTab('signin');
    setSignInEmail('maya@nexuspos.com');
    setSignInPassword('password');
    setErrorMessage('');
  };

  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />

        <div className="login-brand">
          <div className="brand-logo">
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <div className="nm">NexusPOS</div>
            <div className="sb">Retail Management Suite</div>
          </div>
          <div className="backend-badge" style={{ marginLeft: 'auto' }}>
            <Database size={11} /> Spring Boot Connected
          </div>
        </div>

        <div className="login-hero">
          <h1>
            Run your retail<br />
            <span>business smarter.</span>
          </h1>
          <p>
            A high-performance Point of Sale, inventory tracking, and business operations
            platform powered by Spring Boot REST APIs and persistent database storage.
          </p>
          <div className="login-features">
            <div className="lf">
              <div className="ic"><Zap size={16} color="#FBBF24" /></div>
              <span>Lightning-fast cashier POS checkout with atomic stock deductions</span>
            </div>
            <div className="lf">
              <div className="ic"><Package size={16} color="#34D399" /></div>
              <span>Persistent product catalog and transaction ledger database</span>
            </div>
            <div className="lf">
              <div className="ic"><BarChart3 size={16} color="#818CF8" /></div>
              <span>Live dashboard metrics, revenue charts & payment breakdowns</span>
            </div>
            <div className="lf">
              <div className="ic"><Shield size={16} color="#F472B6" /></div>
              <span>JWT authentication & BCrypt password protection for cashiers and admins</span>
            </div>
          </div>
        </div>

        <div className="login-stats">
          <div className="st">
            <div className="v">2,847+</div>
            <div className="l">Active Customers</div>
          </div>
          <div className="st">
            <div className="v">1,248</div>
            <div className="l">Products Managed</div>
          </div>
          <div className="st">
            <div className="v">99.9%</div>
            <div className="l">Database Uptime</div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form">
          {/* Sign In / Sign Up Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('signin'); setErrorMessage(''); setSuccessMessage(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => { setActiveTab('signup'); setErrorMessage(''); setSuccessMessage(''); }}
            >
              Create Account
            </button>
          </div>

          <h2>{activeTab === 'signin' ? 'Welcome back' : 'Create an account'}</h2>
          <p className="sub">
            {activeTab === 'signin'
              ? 'Sign in to your NexusPOS terminal with your credentials'
              : 'Register a new cashier or manager to your store terminal'}
          </p>

          {errorMessage && (
            <div className="auth-error-banner">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="auth-success-banner">
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{successMessage}</div>
            </div>
          )}

          {activeTab === 'signin' ? (
            <form onSubmit={handleSignInSubmit}>
              <div className="field">
                <label>Email address</label>
                <input
                  required
                  type="email"
                  placeholder="you@nexuspos.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      color: '#94A3B8',
                      display: 'grid',
                      placeItems: 'center',
                      padding: 4
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-row">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember terminal
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={quickFillAdmin}
                    style={{ fontSize: 11, color: '#818CF8', fontWeight: 600 }}
                  >
                    Admin Demo
                  </button>
                  <span style={{ color: '#475569' }}>·</span>
                  <button
                    type="button"
                    onClick={quickFillCashier}
                    style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}
                  >
                    Cashier Demo
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign in to Terminal'}
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit}>
              <div className="field">
                <label>Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alex Cashier"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Email address</label>
                <input
                  required
                  type="email"
                  placeholder="alex@nexuspos.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Password (Min. 6 chars)</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Role / Permissions</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                >
                  <option value="CASHIER">Cashier (POS Checkout only)</option>
                  <option value="MANAGER">Store Manager (POS & Inventory)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{ marginTop: 20 }}
                className="btn btn-primary btn-lg btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Register & Launch Terminal'}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          <div className="demo-hint">
            <CheckCircle2 size={18} color="#0284C7" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Live Spring Boot Backend Active.</strong> Sign in with seeded admin
              (<code>sarah@nexuspos.com</code> / <code>password</code>) or register any new account
              to persist to the database.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
