
import React, { useEffect, useState } from "react";
import {
  Activity,
  ChartNoAxesColumnIncreasing,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";

import MoodTracker from "./components/MoodTracker";
import WellnessOverview from "./components/WellnessOverview";
import MoodHistory from "./components/MoodHistory";
import DailyWellnessTips from "./components/DailyWellnessTips";
import BreathingExercise from "./components/BreathingExercise";
import WeeklyReport from "./components/WeeklyReport";
import MoodChanger from "./components/MoodChanger";
import Login from "./components/Login";
import Register from "./components/Register";
import MiloChat from "./components/MiloChat";

import { apiRequest } from "./utils/api";

const navigation = [
  { label: "Overview", icon: "⌂" },
  { label: "Mood tracker", icon: "♡" },
  { label: "Insights", icon: "▥" },
  { label: "Mood history", icon: "◷" },
  { label: "Daily tips", icon: "✦" },
  { label: "Breathing exercise", icon: "◌" },
  { label: "Mood changer", icon: "♡" },
  { label: "Weekly report", icon: "▤" },
];

function App() {
  const [user, setUser] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [activePage, setActivePage] = useState("Overview");
  const [moodForActivities, setMoodForActivities] = useState("");

  const [authPage, setAuthPage] = useState("home");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  // Restore the existing login session when the app opens.
  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await apiRequest("/api/auth/me");

        setUser(data.user);

        const moodData = await apiRequest("/api/moods");

        setCheckins(
          (moodData.checkins || []).map((item) => ({
            ...item,
            id: item._id,
          }))
        );
      } catch (error) {
        console.log("No active session or session restoration failed:", error);
        setUser(null);
        setCheckins([]);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Login
  async function handleLogin(credentials) {
    setAuthLoading(true);
    setAuthError("");
    setAuthNotice("");

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      setUser(data.user);

      try {
        const moodData = await apiRequest("/api/moods");

        setCheckins(
          (moodData.checkins || []).map((item) => ({
            ...item,
            id: item._id,
          }))
        );
      } catch (error) {
        console.error("Mood history could not be loaded:", error);
        setCheckins([]);
      }

      setActivePage("Overview");
    } catch (error) {
      setAuthError(error.message || "Login failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  // Registration
  async function handleRegister(details) {
    setAuthLoading(true);
    setAuthError("");
    setAuthNotice("");

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(details),
      });

      setUser(null);
      setCheckins([]);
      setAuthPage("login");

      setAuthNotice(
        "Your account has been created. Sign in to continue to your wellness space."
      );
    } catch (error) {
      setAuthError(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  // Logout
  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      setCheckins([]);
      setAuthPage("home");
      setAuthError("");
      setAuthNotice("");
    } catch (error) {
      setAuthError(error.message || "Unable to log out.");
    }
  }

  // Save mood check-in to MongoDB.
  
// Save mood check-in to MongoDB.
async function handleSaveCheckin(data) {
  try {
    const result = await apiRequest("/api/moods", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const newCheckin = {
      ...result.checkin,
      id: result.checkin._id,
    };

    setCheckins((previous) => [newCheckin, ...previous]);
  } catch (error) {
    console.error("Could not save check-in:", error);
    throw error;
  }
}


  function openPage(page) {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openMoodActivities(mood) {
    setMoodForActivities(mood);
    openPage("Mood changer");
  }

  function renderPage() {
    switch (activePage) {
      case "Mood tracker":
        return (
          <MoodTracker
            onSave={handleSaveCheckin}
            onGetActivities={openMoodActivities}
            checkins={checkins}
          />
        );

      case "Insights":
        return <WellnessOverview checkins={checkins} />;

      case "Mood history":
        return <MoodHistory checkins={checkins} />;

      case "Daily tips":
        return <DailyWellnessTips checkins={checkins} />;

      case "Breathing exercise":
        return <BreathingExercise />;

      case "Mood changer":
        return <MoodChanger initialMood={moodForActivities} />;

      case "Weekly report":
        return <WeeklyReport checkins={checkins} />;

      case "Overview":
      default:
        return (
          <>
            <section className="welcome-row">
              <div>
                <div className="eyebrow">
                  <span className="status-dot" />
                  YOUR PERSONAL WELLNESS SPACE
                </div>

                <h1>
                  A little check-in, <span>a little care.</span>
                </h1>

                <p className="welcome-description">
                  Take a breath. See how you're doing. Take today one step at a time.
                </p>
              </div>
            </section>

            <section className="hero-card">
              <div className="hero-content">
                <div className="hero-label">
                  <span>✦</span> YOUR DAILY REMINDER
                </div>

                <h2>
                  You don't have to<br />
                  have it all figured out.
                </h2>

                <p>
                  Small steps count. Give yourself the same patience you'd give
                  someone you care about.
                </p>

                <button
                  className="hero-button"
                  onClick={() => openPage("Mood tracker")}
                >
                  Check in with yourself <span>→</span>
                </button>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="sun">✳</div>
                <div className="art-leaf leaf-one">⌁</div>
                <div className="art-leaf leaf-two">⌁</div>
                <div className="art-caption">
                  breathe in<br />
                  let go
                </div>
              </div>
            </section>

            <section className="overview-shortcuts">
              <div className="section-heading">
                <div>
                  <div className="section-kicker">YOUR SPACE</div>
                  <h2>What would you like to do?</h2>
                </div>
              </div>

              <div className="shortcut-grid">
                {navigation.slice(1).map((item) => (
                  <button
                    className="shortcut-card"
                    key={item.label}
                    onClick={() => openPage(item.label)}
                  >
                    <span>{item.icon}</span>
                    <strong>{item.label}</strong>
                    <small>
                      Open section <b>→</b>
                    </small>
                  </button>
                ))}
              </div>
            </section>
          </>
        );
    }
  }

  // Initial session loading screen.
  if (authLoading && !user) {
    return (
      <div className="auth-page">
        <div className="auth-heading">
          <h1>
            MindWell <span>AI</span>
          </h1>
          <p>Preparing your wellness space...</p>
        </div>
      </div>
    );
  }

  // Authentication screens for logged-out users.
  if (!user) {
    if (authPage === "home") {
      return (
        <main className="public-home">
          <div className="public-home-shell">
            <header className="public-nav">
              <a
                className="public-brand"
                href="#home"
                aria-label="MindWell home"
              >
                <span className="public-brand-icon">
                  <Sparkles size={21} />
                </span>
                <span>
                  <strong>mindwell</strong>
                  <small>YOUR WELLNESS SPACE</small>
                </span>
              </a>

              <div className="public-nav-actions">
                <button
                  type="button"
                  className="public-signin"
                  onClick={() => {
                    setAuthPage("login");
                    setAuthError("");
                    setAuthNotice("");
                  }}
                >
                  Sign in
                </button>

                <button
                  type="button"
                  className="public-create"
                  onClick={() => {
                    setAuthPage("register");
                    setAuthError("");
                    setAuthNotice("");
                  }}
                >
                  Create account
                </button>
              </div>
            </header>

            <section className="public-hero">
              <div className="public-hero-copy">
                <span className="public-eyebrow">
                  <span /> A LITTLE CARE, EVERY DAY
                </span>

                <h1>
                  A calmer way to{" "}
                  <span>check in with yourself.</span>
                </h1>

                <p>
                  MindWell gives you a gentle place to track your mood, notice
                  patterns, and find small, practical ways to care for your
                  wellbeing.
                </p>

                <div className="public-hero-actions">
                  <button
                    type="button"
                    className="public-create public-create-large"
                    onClick={() => {
                      setAuthPage("register");
                      setAuthError("");
                      setAuthNotice("");
                    }}
                  >
                    Create your account <span aria-hidden="true">→</span>
                  </button>

                  <button
                    type="button"
                    className="public-signin public-signin-large"
                    onClick={() => {
                      setAuthPage("login");
                      setAuthError("");
                      setAuthNotice("");
                    }}
                  >
                    I already have an account
                  </button>
                </div>

                <div className="public-privacy-note">
                  <ShieldCheck size={17} />
                  Your wellness space is personal. Sign in to see your saved
                  check-ins.
                </div>
              </div>

              <div
                className="public-hero-visual"
                aria-label="A preview of the MindWell wellness dashboard"
              >
                <div className="public-visual-glow" />

                <div className="public-preview-card">
                  <div className="public-preview-top">
                    <span className="public-preview-icon">
                      <Activity size={19} />
                    </span>
                    <span>YOUR DAILY CHECK-IN</span>
                    <span className="public-live-dot" />
                  </div>

                  <h2>How are you feeling today?</h2>
                  <p>A moment to pause and notice.</p>

                  <div className="public-mood-options">
                    <span>Good</span>
                    <span>Happy</span>
                    <span>Calm</span>
                  </div>

                  <div className="public-preview-divider" />

                  <div className="public-preview-insight">
                    <span>
                      <ChartNoAxesColumnIncreasing size={17} />
                    </span>
                    <div>
                      <strong>Small steps add up</strong>
                      <small>Track moods and daily habits over time</small>
                    </div>
                  </div>
                </div>

                <div className="public-floating-card">
                  <Wind size={18} />
                  <span>
                    <strong>Take a breath</strong>
                    <small>Find a gentle reset</small>
                  </span>
                </div>
              </div>
            </section>

            <section
              className="public-features"
              aria-label="What you can do with MindWell"
            >
              <article>
                <span>
                  <Activity size={20} />
                </span>
                <h2>Check in</h2>
                <p>
                  Record how you feel and add optional notes about your day.
                </p>
              </article>

              <article>
                <span>
                  <ChartNoAxesColumnIncreasing size={20} />
                </span>
                <h2>See your patterns</h2>
                <p>
                  Review mood history and wellness habits in one clear place.
                </p>
              </article>

              <article>
                <span>
                  <Wind size={20} />
                </span>
                <h2>Find a small reset</h2>
                <p>
                  Explore breathing, relaxing sounds, and simple activities.
                </p>
              </article>
            </section>

            <footer className="public-footer">
              <span>mindwell</span>
              <span>A little care, every day.</span>
            </footer>
          </div>
        </main>
      );
    }

    if (authPage === "register") {
      return (
        <Register
          onRegister={handleRegister}
          onShowLogin={() => {
            setAuthPage("login");
            setAuthError("");
            setAuthNotice("");
          }}
          onBackHome={() => {
            setAuthPage("home");
            setAuthError("");
            setAuthNotice("");
          }}
          loading={authLoading}
          error={authError}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => {
          setAuthPage("register");
          setAuthError("");
          setAuthNotice("");
        }}
        onBackHome={() => {
          setAuthPage("home");
          setAuthError("");
          setAuthNotice("");
        }}
        loading={authLoading}
        error={authError}
        notice={authNotice}
      />
    );
  }

  // Main dashboard for authenticated users.
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            openPage("Overview");
          }}
        >
          <span className="brand-icon">✳</span>

          <span>
            <strong>mindwell</strong>
            <small>YOUR WELLNESS SPACE</small>
          </span>
        </a>

        <div className="side-label">WORKSPACE</div>

        <nav className="navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${
                activePage === item.label ? "active" : ""
              }`}
              onClick={() => openPage(item.label)}
              aria-current={
                activePage === item.label ? "page" : undefined
              }
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-symbol">✦</div>

            <h3>A moment for yourself</h3>

            <p>You deserve a little peace in your day.</p>

            <button onClick={() => openPage("Mood tracker")}>
              Check in <span>↗</span>
            </button>
          </div>

          <details className="user-account-menu">
            <summary className="user-account-trigger" aria-label="Open account options">
              <span className="user-account-avatar" aria-hidden="true">
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </span>
              <span className="user-account-trigger-copy">
                <strong>Account</strong>
                <small>Profile and settings</small>
              </span>
              <span className="user-account-chevron" aria-hidden="true">⌃</span>
            </summary>

            <div className="user-account-popover">
              <span className="user-account-eyebrow">SIGNED IN AS</span>
              <div className="user-account-info">
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <span aria-hidden="true">↪</span> Log out
              </button>
            </div>
          </details>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumb">
            My space <span>/</span> <strong>{activePage}</strong>
          </div>

          <span className="today-label">YOUR DAILY CHECK-IN</span>
        </header>

        <div className="dashboard">
          {renderPage()}

          <footer className="footer">
            <span>✳ mindwell AI</span>
            <span>A little care, every day.</span>
          </footer>
        </div>
      </main>

      <MiloChat />
    </div>
  );
}

export default App;
