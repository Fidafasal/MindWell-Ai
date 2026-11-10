
import React, { useState } from "react";

function Login({ onLogin, onShowRegister, onBackHome, loading = false, error = "", notice = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      return;
    }

    await onLogin({
      email: email.trim(),
      password,
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <a className="auth-brand" href="#home">
          <span className="auth-brand-icon">✳</span>
          <span>
            <strong>mindwell</strong>
            <small>YOUR WELLNESS SPACE</small>
          </span>
        </a>

        <div className="auth-heading">
          <div className="auth-eyebrow">WELCOME BACK</div>
          <h1>Good to see you <span>again.</span></h1>
          <p>Take a moment for yourself. Sign in to continue your wellness journey.</p>
        </div>

        {onBackHome && <button type="button" className="auth-back-home" onClick={onBackHome}>← Back to home</button>}
        {notice && <div className="auth-notice" role="status">{notice}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>

            <div className="auth-password-wrap">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button type="button" onClick={onShowRegister}>
            Create account
          </button>
        </p>

        <div className="auth-footer">
          A little care, every day. ✳
        </div>
      </div>
    </div>
  );
}

export default Login;
