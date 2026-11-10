import React, { useState } from "react";
import MoodIcon from "./MoodIcons";

const moods = [
  { name: "Good", color: "good" },
  { name: "Happy", color: "happy" },
  { name: "Calm", color: "calm" },
  { name: "Angry", color: "angry" },
  { name: "Sad", color: "sad" },
  { name: "Anxious", color: "anxious" },
  { name: "Tired", color: "tired" },
  { name: "Stressed", color: "stressed" },
  { name: "Bored", color: "bored" },
];

function MoodTracker({ onSave, onGetActivities, checkins = [] }) {
  const [selectedMood, setSelectedMood] = useState("");
  const [stress, setStress] = useState(5);
  const [note, setNote] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [waterGlasses, setWaterGlasses] = useState("");
  const [steps, setSteps] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [isSaved, setIsSaved] = useState(false);
  const [metricError, setMetricError] = useState("");

  const previousWeight = checkins.find(
    (item) =>
      item.weight !== undefined && item.weight !== null && item.weight !== "",
  );
  function handleMoodSelect(mood) {
    setSelectedMood(mood);
    setIsSaved(false);
  }

  async function handleSave() {
    if (!selectedMood) return;

    const numericFields = [
      ["Sleep", sleepHours, 0, 24],
      ["Water", waterGlasses, 0, 40],
      ["Steps", steps, 0, 100000],
      ["Weight", weight, 0.1, 500],
    ];
    const invalidField = numericFields.find(
      ([, value, min, max]) =>
        value !== "" &&
        (!Number.isFinite(Number(value)) ||
          Number(value) < min ||
          Number(value) > max),
    );
    if (invalidField) {
      setMetricError(
        `${invalidField[0]} entry must be between ${invalidField[2]} and ${invalidField[3]}.`,
      );
      return;
    }
    setMetricError("");

    const checkin = {
      mood: selectedMood,
      stress,
      note,
      sleepHours: sleepHours === "" ? null : Number(sleepHours),
      waterGlasses: waterGlasses === "" ? null : Number(waterGlasses),
      steps: steps === "" ? null : Number(steps),
      weight: weight === "" ? null : Number(weight),
      weightUnit: weight === "" ? null : weightUnit,
      date: new Date().toISOString(),
    };

    try {
      await onSave(checkin);
      setIsSaved(true);
    } catch (error) {
      setMetricError("Could not save your check-in. Please try again.");
    }
  }

  function handleGetActivities() {
    if (selectedMood && onGetActivities) {
      onGetActivities(selectedMood);
    }
  }

  return (
    <section className="mood-tracker-page">
      <div className="mood-tracker-header">
        <span className="mood-kicker">YOUR DAILY CHECK-IN</span>

        <h1>How are you feeling today?</h1>

        <p>Take a moment to understand your emotions. Every feeling matters.</p>
      </div>

      <div className="mood-selection-section">
        <h2>Choose your current mood</h2>

        <div className="mood-selection-grid">
          {moods.map((mood) => (
            <button
              type="button"
              key={mood.name}
              className={`mood-option ${mood.color} ${
                selectedMood === mood.name ? "selected" : ""
              }`}
              onClick={() => handleMoodSelect(mood.name)}
            >
              <span className="mood-option-icon">
                <MoodIcon mood={mood.name} size={28} />
              </span>

              <span>{mood.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mood-stress-section">
        <div className="mood-section-heading">
          <h2>How stressed are you?</h2>
          <span>{stress}/10</span>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          value={stress}
          onChange={(e) => {
            setStress(Number(e.target.value));
            setIsSaved(false);
          }}
          className="mood-stress-slider"
        />

        <div className="stress-labels">
          <span>Relaxed</span>
          <span>Very stressed</span>
        </div>
      </div>

      <section
        className="mood-metrics-section"
        aria-labelledby="mood-metrics-title"
      >
        <div className="mood-metrics-heading">
          <div>
            <span className="mood-metric-kicker">OPTIONAL DAILY LOG</span>
            <h2 id="mood-metrics-title">How is your body doing?</h2>
            <p>
              Track what matters to you. Leave anything blank, and focus on
              patterns over time.
            </p>
          </div>
          {previousWeight && (
            <span className="mood-previous-weight">
              Last weight: {previousWeight.weight}{" "}
              {previousWeight.weightUnit || "kg"}
            </span>
          )}
        </div>

        <div className="mood-metrics-grid">
          <label className="mood-metric-card">
            <span className="mood-metric-icon" aria-hidden="true">
              ☾
            </span>
            <strong>Sleep</strong>
            <small>Hours slept</small>
            <span className="mood-metric-input">
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={sleepHours}
                onChange={(event) => {
                  setSleepHours(event.target.value);
                  setIsSaved(false);
                  setMetricError("");
                }}
                placeholder="e.g. 7.5"
                aria-label="Hours slept"
              />
              <span>hours</span>
            </span>
          </label>

          <label className="mood-metric-card">
            <span className="mood-metric-icon" aria-hidden="true">
              ◉
            </span>
            <strong>Water</strong>
            <small>Glasses or cups</small>
            <span className="mood-metric-input">
              <input
                type="number"
                min="0"
                max="40"
                step="1"
                value={waterGlasses}
                onChange={(event) => {
                  setWaterGlasses(event.target.value);
                  setIsSaved(false);
                  setMetricError("");
                }}
                placeholder="e.g. 6"
                aria-label="Glasses of water"
              />
              <span>glasses</span>
            </span>
          </label>

          <label className="mood-metric-card">
            <span className="mood-metric-icon" aria-hidden="true">
              ↗
            </span>
            <strong>Steps</strong>
            <small>Steps walked today</small>
            <span className="mood-metric-input">
              <input
                type="number"
                min="0"
                max="100000"
                step="100"
                value={steps}
                onChange={(event) => {
                  setSteps(event.target.value);
                  setIsSaved(false);
                  setMetricError("");
                }}
                placeholder="e.g. 4200"
                aria-label="Steps walked"
              />
              <span>steps</span>
            </span>
          </label>

          <label className="mood-metric-card">
            <span className="mood-metric-icon" aria-hidden="true">
              ＋
            </span>
            <strong>Weight</strong>
            <small>Optional personal log</small>
            <span className="mood-metric-input">
              <input
                type="number"
                min="0.1"
                max="500"
                step="0.1"
                value={weight}
                onChange={(event) => {
                  setWeight(event.target.value);
                  setIsSaved(false);
                  setMetricError("");
                }}
                placeholder="e.g. 68.2"
                aria-label="Weight"
              />
              <select
                value={weightUnit}
                onChange={(event) => {
                  setWeightUnit(event.target.value);
                  setIsSaved(false);
                  setMetricError("");
                }}
                aria-label="Weight unit"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </span>
          </label>
        </div>
        {metricError && (
          <p className="mood-metrics-error" role="alert">
            {metricError}
          </p>
        )}
        <p className="mood-metrics-privacy">
          These optional entries are stored in this app’s check-in history.
          Weight is only a personal log; the app won’t set a target or judge it.
        </p>
      </section>

      <div className="mood-note-section">
        <h2>Anything on your mind?</h2>

        <p>
          You can write about your day, thoughts or feelings. This is optional.
        </p>

        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setIsSaved(false);
          }}
          placeholder="Write your thoughts here..."
          rows="4"
        />
      </div>

      <button
        type="button"
        className="mood-save-button"
        onClick={handleSave}
        disabled={!selectedMood}
      >
        Save my mood
      </button>

      {isSaved && (
        <div className="mood-saved-message">
          <span>💛</span>

          <h3>Your check-in has been saved!</h3>

          <p>Thank you for taking a moment to understand how you feel.</p>

          <button
            type="button"
            className="mood-activities-button"
            onClick={handleGetActivities}
          >
            Get activities for my mood →
          </button>
        </div>
      )}
    </section>
  );
}

export default MoodTracker;
