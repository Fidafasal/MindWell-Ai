
import React, { useEffect, useState } from "react";

function DailyWellnessTips({ checkins = [] }) {
  // Check-ins are sorted newest first by the backend.
  const latest = checkins[0];

  const [saved, setSaved] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [assistantState, setAssistantState] = useState("idle");
  const [assistantFeedback, setAssistantFeedback] = useState("");
  const [assistantSource, setAssistantSource] = useState("");

  function getWellnessTip() {
    if (!latest) {
      return {
        title: "Start with a small step",
        description:
          "Take a moment to check in with yourself. Understanding how you feel is a good place to begin.",
        action: "Try your first mood check-in",
        icon: "🌱",
      };
    }

    if (Number(latest.stress) >= 8) {
      return {
        title: "Give yourself a little breathing space",
        description:
          "Your latest stress score is quite high. Step away from your current task for a few minutes and take some slow, comfortable breaths.",
        action: "Take a 5-minute break",
        icon: "🌿",
      };
    }

    if (latest.mood === "Anxious") {
      return {
        title: "Focus on the present moment",
        description:
          "Try grounding yourself by noticing five things you can see, four things you can touch, and three things you can hear.",
        action: "Try a grounding exercise",
        icon: "🌸",
      };
    }

    if (latest.mood === "Sad") {
      return {
        title: "Be gentle with yourself",
        description:
          "You don't need to force yourself to feel better immediately. Consider talking to someone you trust or doing one small comforting activity.",
        action: "Take one small step",
        icon: "☁️",
      };
    }

    if (latest.mood === "Happy" || latest.mood === "Good") {
      return {
        title:
          latest.mood === "Happy"
            ? "Make room for more good moments"
            : "Notice what's going well",
        description:
          "Notice what contributed to your positive mood. Keeping track of helpful habits can help you understand yourself better.",
        action: "Remember what made you smile",
        icon: "☀️",
      };
    }

    if (latest.mood === "Calm") {
      return {
        title: "Enjoy this peaceful moment",
        description:
          "Give yourself time to enjoy feeling calm. A short walk, quiet activity, or mindful break can help you maintain this moment.",
        action: "Enjoy a mindful moment",
        icon: "🍃",
      };
    }

    if (latest.mood === "Angry") {
      return {
        title: "Give yourself room to reset",
        description:
          "Step away from the situation if possible. Relax your shoulders and take a few comfortable breaths before responding.",
        action: "Take a quiet pause",
        icon: "🌿",
      };
    }

    if (latest.mood === "Tired") {
      return {
        title: "Listen to your energy",
        description:
          "Consider taking a short rest, drinking some water, or choosing one small task instead of pushing yourself too hard.",
        action: "Give yourself a short rest",
        icon: "🌙",
      };
    }

    if (latest.mood === "Stressed") {
      return {
        title: "Make space for one thing at a time",
        description:
          "Pause and identify one manageable task. You don't have to solve everything at once.",
        action: "Focus on one small task",
        icon: "✨",
      };
    }

    if (latest.mood === "Bored") {
      return {
        title: "Try something different",
        description:
          "A short walk, a creative activity, or a change of environment might help bring a little variety to your day.",
        action: "Try a new activity",
        icon: "🌼",
      };
    }

    return {
      title: "Take today one step at a time",
      description:
        "You don't need to have everything figured out. Focus on one manageable task and give yourself time to rest.",
      action: "Focus on one small task",
      icon: "✨",
    };
  }

  const tip = getWellnessTip();

  // Check whether this tip has already been saved.
  useEffect(() => {
    try {
      const savedTips = JSON.parse(
        window.localStorage.getItem("mindwell-saved-tips") || "[]"
      );

      setSaved(
        savedTips.some((item) => item.title === tip.title)
      );
    } catch {
      setSaved(false);
    }
  }, [tip.title]);

  // One-minute pause timer.
  useEffect(() => {
    if (!timerRunning || seconds <= 0) return undefined;

    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerRunning, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setTimerRunning(false);
    }
  }, [seconds]);

  // Save or remove the current tip.
  function toggleSaved() {
    try {
      const savedTips = JSON.parse(
        window.localStorage.getItem("mindwell-saved-tips") || "[]"
      );

      const nextTips = saved
        ? savedTips.filter((item) => item.title !== tip.title)
        : [
            ...savedTips.filter((item) => item.title !== tip.title),
            {
              title: tip.title,
              description: tip.description,
              savedAt: new Date().toISOString(),
            },
          ];

      window.localStorage.setItem(
        "mindwell-saved-tips",
        JSON.stringify(nextTips)
      );

      setSaved(!saved);
    } catch (error) {
      console.error("Unable to save wellness tip:", error);
    }
  }

  function toggleExercise() {
    if (exerciseOpen && timerRunning) {
      setTimerRunning(false);
    }

    setExerciseOpen((open) => !open);
  }

  // Request a reflection based on recent check-ins.
  async function requestAssistantReview() {
    if (!latest || assistantState === "loading") return;

    setAssistantState("loading");
    setAssistantFeedback("");
    setAssistantSource("");

    const recentCheckins = checkins.slice(0, 7).map((item) => ({
      date: item.date || item.createdAt,
      mood: item.mood,
      stress: item.stress,
      sleepHours: item.sleepHours ?? null,
      waterGlasses: item.waterGlasses ?? null,
      steps: item.steps ?? null,
      weight: item.weight ?? null,
      weightUnit: item.weightUnit ?? null,
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/wellness-feedback`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkins: recentCheckins,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("AI reflection unavailable");
      }

      const result = await response.json();

      if (!result.feedback) {
        throw new Error("No feedback returned");
      }

      setAssistantFeedback(result.feedback);
      setAssistantSource("AI wellness reflection");
      setAssistantState("complete");
    } catch (error) {
      console.error("Wellness reflection error:", error);

      const metrics = [
        latest.sleepHours != null &&
          `sleep (${latest.sleepHours} hours)`,
        latest.waterGlasses != null &&
          `water (${latest.waterGlasses} glasses)`,
        latest.steps != null &&
          `steps (${latest.steps.toLocaleString()})`,
        latest.weight != null &&
          `weight (${latest.weight} ${latest.weightUnit || "kg"})`,
      ].filter(Boolean);

      const loggedDetails = metrics.length
        ? ` You also logged ${metrics.join(", ")}.`
        : " You haven't logged body metrics in this check-in.";

      setAssistantFeedback(
        `Your latest check-in records a ${latest.mood || "mood"} mood and stress at ${latest.stress}/10.${loggedDetails} Notice whether these entries seem connected to how you feel; no single number tells the whole story.`
      );

      setAssistantSource(
        "On-device reflection · AI service unavailable"
      );

      setAssistantState("local");
    }
  }

  return (
    <section className="panel wellness-tips" id="tips">
      <div className="section-heading">
        <div>
          <div className="section-kicker">
            A LITTLE GUIDANCE
          </div>

          <h2 className="hedding">
            Daily wellness tip
          </h2>
        </div>

        <span className="heading-icon">✦</span>
      </div>

      <div className="tip-content">
        <div className="tip-icon">
          {tip.icon}
        </div>

        <div className="tip-text">
          <h3>{tip.title}</h3>
          <p>{tip.description}</p>

          <span className="tip-action">
            {tip.action} →
          </span>
        </div>
      </div>

      <div className="tip-tools">
        <button
          type="button"
          className="tip-try-button"
          onClick={toggleExercise}
          aria-expanded={exerciseOpen}
        >
          {exerciseOpen
            ? "Close quick pause"
            : "Try a 1-minute pause"}
        </button>

        <button
          type="button"
          className="tip-save-button"
          onClick={toggleSaved}
          aria-pressed={saved}
        >
          {saved ? "Saved for later ✓" : "Save tip ♡"}
        </button>
      </div>

      {exerciseOpen && (
        <div className="tip-exercise" aria-live="polite">
          <div>
            <strong>
              {seconds === 0
                ? "Pause complete"
                : "Take a gentle pause"}
            </strong>

            <p>
              {seconds === 0
                ? "Notice how you feel before returning to your day."
                : "Let your shoulders soften. Notice one thing you can see, one sound you can hear, and how your body feels. There's no need to change anything."}
            </p>
          </div>

          <span
            className="tip-timer"
            aria-label={`${seconds} seconds remaining`}
          >
            {Math.floor(seconds / 60)}:
            {String(seconds % 60).padStart(2, "0")}
          </span>

          <div className="tip-exercise-controls">
            <button
              type="button"
              onClick={() => {
                if (seconds === 0) {
                  setSeconds(60);
                  setTimerRunning(true);
                } else {
                  setTimerRunning((running) => !running);
                }
              }}
            >
              {timerRunning
                ? "Pause"
                : seconds === 0
                  ? "Start again"
                  : seconds === 60
                    ? "Start"
                    : "Continue"}
            </button>

            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setSeconds(60);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="tip-feedback" role="group" aria-label="Tip feedback">
        <span>
          {feedback ? "Thanks for sharing." : "Was this tip helpful?"}
        </span>

        <button
          type="button"
          aria-pressed={feedback === "yes"}
          onClick={() => setFeedback("yes")}
        >
          Yes
        </button>

        <button
          type="button"
          aria-pressed={feedback === "not-now"}
          onClick={() => setFeedback("not-now")}
        >
          Not right now
        </button>
      </div>

      <section
        className="daily-ai-review"
        aria-labelledby="daily-ai-review-title"
      >
        <div>
          <span className="daily-ai-kicker">
            WELLNESS ASSISTANT
          </span>

          <h3 id="daily-ai-review-title">
            A reflection on your check-ins
          </h3>

          <p>
            On request, mood, stress, and logged metrics from up to
            7 recent check-ins are sent to this app's server and
            configured AI service. Journal notes are excluded.
          </p>
        </div>

        <button
          type="button"
          className="daily-ai-button"
          onClick={requestAssistantReview}
          disabled={!latest || assistantState === "loading"}
        >
          {assistantState === "loading"
            ? "Reviewing…"
            : assistantState === "complete" ||
                assistantState === "local"
              ? "Refresh reflection"
              : "Ask AI to review"}
        </button>

        {assistantFeedback && (
          <div className="daily-ai-response" aria-live="polite">
            <strong>{assistantSource}</strong>
            <p>{assistantFeedback}</p>
          </div>
        )}

        {!latest && (
          <small className="daily-ai-empty">
            Save a mood check-in first to get a reflection.
          </small>
        )}
      </section>

      <p className="tip-disclaimer">
        These are general wellness suggestions, not medical advice.
        You can choose what feels helpful for you.
      </p>
    </section>
  );
}

export default DailyWellnessTips;
