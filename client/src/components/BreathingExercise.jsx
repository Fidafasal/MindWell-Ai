import React, { useEffect, useState } from "react";

const techniques = [
  {
    id: "478",
    name: "4–7–8 Relaxing",
    description: "A slower pattern with a gentle pause.",
    phases: [
      { name: "Breathe in", duration: 4, className: "inhale", instruction: "Gently breathe in through your nose." },
      { name: "Hold", duration: 7, className: "hold", instruction: "Pause softly. Keep your shoulders relaxed." },
      { name: "Breathe out", duration: 8, className: "exhale", instruction: "Slowly release your breath." },
    ],
  },
  {
    id: "box",
    name: "Box breathing",
    description: "Four even sides: inhale, hold, exhale, hold.",
    phases: [
      { name: "Breathe in", duration: 4, className: "inhale", instruction: "Breathe in steadily." },
      { name: "Hold", duration: 4, className: "hold", instruction: "Rest gently at the top of the breath." },
      { name: "Breathe out", duration: 4, className: "exhale", instruction: "Breathe out at an easy pace." },
      { name: "Hold", duration: 4, className: "hold", instruction: "Pause softly before the next breath." },
    ],
  },
  {
    id: "steady",
    name: "Steady breathing",
    description: "A simple, even inhale and exhale.",
    phases: [
      { name: "Breathe in", duration: 4, className: "inhale", instruction: "Breathe in gently and comfortably." },
      { name: "Breathe out", duration: 6, className: "exhale", instruction: "Let your breath out slowly." },
    ],
  },
];
const sessionLengths = [2, 5, 10];

function BreathingExercise() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [techniqueId, setTechniqueId] = useState("478");
  const [sessionMinutes, setSessionMinutes] = useState(2);
  const technique = techniques.find((item) => item.id === techniqueId) || techniques[0];
  const phases = technique.phases;
  const cycleDuration = phases.reduce((total, phase) => total + phase.duration, 0);
  const sessionDuration = sessionMinutes * 60;

  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = window.setInterval(
      () => setElapsed((seconds) => Math.min(seconds + 1, sessionDuration)),
      1000
    );
    return () => window.clearInterval(timer);
  }, [isRunning, sessionDuration]);

  useEffect(() => {
    if (elapsed >= sessionDuration) setIsRunning(false);
  }, [elapsed, sessionDuration]);

  let phaseOffset = elapsed % cycleDuration;
  let phase = phases[0];
  for (const item of phases) {
    if (phaseOffset < item.duration) {
      phase = item;
      break;
    }
    phaseOffset -= item.duration;
  }
  const remaining = phase.duration - phaseOffset;
  const cycles = Math.floor(elapsed / cycleDuration);
  const cycleProgress = ((elapsed % cycleDuration) / cycleDuration) * 100;
  const sessionProgress = (elapsed / sessionDuration) * 100;

  function reset() {
    setIsRunning(false);
    setElapsed(0);
  }

  function chooseTechnique(id) {
    setTechniqueId(id);
    reset();
  }

  function chooseDuration(minutes) {
    setSessionMinutes(minutes);
    reset();
  }

  function toggleSession() {
    if (elapsed >= sessionDuration) {
      setElapsed(0);
      setIsRunning(true);
      return;
    }
    setIsRunning((running) => !running);
  }

  return (
    <section className="panel breathing-panel" aria-labelledby="breathing-title">
      <div className="section-heading">
        <div>
          <div className="section-kicker">PAUSE AND RESET</div>
          <h2 id="breathing-title">Breathing exercise</h2>
        </div>
        <span className="heading-icon" aria-hidden="true">◌</span>
      </div>

      <p className="panel-description">Choose a rhythm and session length, then follow the circle at a comfortable pace. You can pause or stop at any time.</p>

      <div className="breathing-options">
        <div className="breathing-option-group">
          <span className="breathing-option-label">Breathing pattern</span>
          <div className="breathing-technique-list" role="group" aria-label="Breathing pattern">
            {techniques.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`breathing-technique-option ${techniqueId === item.id ? "active" : ""}`}
                aria-pressed={techniqueId === item.id}
                disabled={isRunning}
                onClick={() => chooseTechnique(item.id)}
              >
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="breathing-option-group">
          <span className="breathing-option-label">Session length</span>
          <div className="breathing-duration-list" role="group" aria-label="Session length">
            {sessionLengths.map((minutes) => (
              <button
                key={minutes}
                type="button"
                className={`breathing-duration-option ${sessionMinutes === minutes ? "active" : ""}`}
                aria-pressed={sessionMinutes === minutes}
                disabled={isRunning}
                onClick={() => chooseDuration(minutes)}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="breathing-content">
        <div className="breathing-circle-area">
          <div className={`breathing-circle ${isRunning ? phase.className : ""}`} aria-live="polite">
            <div className="breathing-circle-inner">
              <span className="breathing-phase">{elapsed >= sessionDuration ? "Complete" : isRunning ? phase.name : elapsed ? "Paused" : "Ready"}</span>
              <strong className="breathing-count">{elapsed >= sessionDuration ? "✓" : isRunning ? remaining : "♡"}</strong>
              <span className="breathing-instruction">{isRunning ? "seconds" : elapsed >= sessionDuration ? "Well done" : "Take a moment"}</span>
            </div>
          </div>
        </div>

        <div className="breathing-details">
          <h3>{elapsed >= sessionDuration ? "Your breathing session is complete" : isRunning ? phase.instruction : "Find a comfortable pace"}</h3>
          <p>Let the circle guide you. There is no need to force or deepen your breath; pause the exercise if you feel uncomfortable.</p>

          <div className="breathing-progress">
            <div className="breathing-progress-label">
              <span>Session progress</span>
              <strong>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} / {sessionMinutes}:00</strong>
            </div>
            <div
              className="breathing-progress-track"
              role="progressbar"
              aria-label="Session progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(sessionProgress)}
            >
              <div className="breathing-progress-fill" style={{ width: `${sessionProgress}%` }} />
            </div>
            <div className="breathing-cycle-progress" aria-label={`Cycle ${cycles + 1} progress`}>
              <span>Current cycle</span>
              <div className="breathing-progress-track"><div className="breathing-progress-fill" style={{ width: `${cycleProgress}%` }} /></div>
              <strong>{cycles} completed</strong>
            </div>
          </div>

          <div className="breathing-buttons">
            <button className="primary-button" onClick={toggleSession}>
              {isRunning ? "Pause" : elapsed >= sessionDuration ? "Start again" : elapsed ? "Resume" : "Start breathing"}
            </button>
            <button className="breathing-reset" onClick={reset} disabled={!elapsed && !isRunning}>
              Reset
            </button>
          </div>
          <span className="breathing-time" aria-live="off">
            Session time: {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

export default BreathingExercise;
