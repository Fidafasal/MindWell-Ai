
import React, { useState } from "react";

function Register({ onRegister, onShowLogin, onBackHome, loading = false, error = "" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    await onRegister({
      name: name.trim(),
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
          <div className="auth-eyebrow">YOUR WELLNESS JOURNEY STARTS HERE</div>
          <h1>Create your <span>space.</span></h1>
          <p>A small step towards understanding yourself and caring for your wellbeing.</p>
        </div>

        {onBackHome && <button type="button" className="auth-back-home" onClick={onBackHome}>← Back to home</button>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <div className="auth-password-wrap">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
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

          <div className="auth-field">
            <label htmlFor="register-confirm-password">Confirm password</label>
            <input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {(formError || error) && (
            <div className="auth-error" role="alert">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button type="button" onClick={onShowLogin}>
            Sign in
          </button>
        </p>

        <div className="auth-footer">
          A little care, every day. ✳
        </div>
      </div>
    </div>
  );
}

export default Register;
