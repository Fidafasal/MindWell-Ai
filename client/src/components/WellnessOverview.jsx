
import * as React from "react";
import MoodIcon from "./MoodIcons";

function WellnessOverview({ checkins = [] }) {
  // Latest check-in (newest entry is at index 0)
  const latest = checkins[0];

  // Get check-ins from the last seven days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const getCheckinDate = (item) =>
    new Date(item.createdAt || item.date);

  const recentCheckins = checkins.filter((item) => {
    const date = getCheckinDate(item);
    return (
      !Number.isNaN(date.getTime()) &&
      date >= sevenDaysAgo
    );
  });

  // Calculate averages for recorded values only
  function getAverage(metric, digits = 1) {
    const values = recentCheckins
      .map((item) => item[metric])
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          Number.isFinite(Number(value))
      )
      .map(Number);

    return values.length
      ? (
          values.reduce((total, value) => total + value, 0) /
          values.length
        ).toFixed(digits)
      : "—";
  }

  // Calculate average stress
  const stressValues = recentCheckins
    .map((item) => item.stress)
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        Number.isFinite(Number(value))
    )
    .map(Number);

  const averageStress = stressValues.length
    ? (
        stressValues.reduce((total, value) => total + value, 0) /
        stressValues.length
      ).toFixed(1)
    : "—";

  // Other seven-day averages
  const averageSleep = getAverage("sleepHours");
  const averageWater = getAverage("waterGlasses");
  const averageSteps = getAverage("steps", 0);

  // Find the latest recorded weight
  const latestWeight = checkins.find(
    (item) =>
      item.weight !== null &&
      item.weight !== undefined &&
      item.weight !== ""
  );

  // Latest check-in details
  const latestDetails = latest
    ? [
        ["Mood", latest.mood],
        [
          "Stress",
          latest.stress != null
            ? `${latest.stress}/10`
            : null,
        ],
        [
          "Sleep",
          latest.sleepHours != null
            ? `${latest.sleepHours} hours`
            : null,
        ],
        [
          "Water",
          latest.waterGlasses != null
            ? `${latest.waterGlasses} glasses`
            : null,
        ],
        [
          "Steps",
          latest.steps != null
            ? Number(latest.steps).toLocaleString()
            : null,
        ],
        [
          "Weight",
          latest.weight != null
            ? `${latest.weight} ${latest.weightUnit || "kg"}`
            : null,
        ],
      ].filter(
        ([, value]) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      )
    : [];

  // Seven-day stress chart data
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const entries = checkins.filter((item) => {
      const createdAt = getCheckinDate(item);
      return createdAt >= date && createdAt < nextDay;
    });

    const validStressValues = entries
      .map((item) => item.stress)
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          Number.isFinite(Number(value))
      )
      .map(Number);

    const average = validStressValues.length
      ? validStressValues.reduce(
          (sum, value) => sum + value,
          0
        ) / validStressValues.length
      : null;

    return {
      label: date.toLocaleDateString("en", {
        weekday: "short",
      }),
      stress: average,
    };
  });

  // Mood distribution
  const moodTypes = [
    { name: "Good" },
    { name: "Angry", emoji: "😠" },
    { name: "Tired", emoji: "😴" },
    { name: "Stressed", emoji: "😤" },
    { name: "Bored", emoji: "😐" },
    { name: "Happy", emoji: "😊" },
    { name: "Calm", emoji: "😌" },
    { name: "Okay", emoji: "😐" },
    { name: "Anxious", emoji: "😟" },
    { name: "Sad", emoji: "😔" },
  ];

  const moodCounts = moodTypes.map((item) => {
    const count = checkins.filter(
      (checkin) => checkin.mood === item.name
    ).length;

    const percentage = checkins.length
      ? Math.round((count / checkins.length) * 100)
      : 0;

    return {
      ...item,
      count,
      percentage,
    };
  });

  return (
    <>
      {/* Statistics Cards */}
      <div className="stats-grid">
        {/* Current Mood */}
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon purple">◉</span>
            <span className="stat-caption">LATEST</span>
          </div>

          <p className="stat-title">Current mood</p>
          <h3>{latest?.mood || "Not checked in"}</h3>

          <p className="stat-foot">
            {latest
              ? getCheckinDate(latest).toLocaleDateString()
              : "Your mood will appear here"}
          </p>
        </article>

        {/* Average Stress */}
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon orange">〰</span>
            <span className="stat-caption">LAST 7 DAYS</span>
          </div>

          <p className="stat-title">Average stress</p>
          <h3>
            {averageStress}
            <span className="out-of"> / 10</span>
          </h3>

          <p className="stat-foot">
            Based on your recent check-ins
          </p>
        </article>

        {/* Average Sleep */}
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon green">☾</span>
            <span className="stat-caption">LAST 7 DAYS</span>
          </div>

          <p className="stat-title">Average sleep</p>
          <h3>
            {averageSleep}
            <span className="out-of"> hours</span>
          </h3>

          <p className="stat-foot">
            Average recorded sleep
          </p>
        </article>

        {/* Average Water */}
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon blue">◉</span>
            <span className="stat-caption">LAST 7 DAYS</span>
          </div>

          <p className="stat-title">Average water</p>
          <h3>
            {averageWater}
            <span className="out-of"> glasses</span>
          </h3>

          <p className="stat-foot">
            Per check-in with water logged
          </p>
        </article>

        {/* Average Steps */}
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon green">↗</span>
            <span className="stat-caption">LAST 7 DAYS</span>
          </div>

          <p className="stat-title">Average steps</p>
          <h3>{averageSteps}</h3>

          <p className="stat-foot">
            Per check-in with steps logged
          </p>
        </article>

        {/* Latest Weight */}
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon purple">＋</span>
            <span className="stat-caption">LATEST LOG</span>
          </div>

          <p className="stat-title">Weight log</p>
          <h3>
            {latestWeight
              ? `${latestWeight.weight} ${latestWeight.weightUnit || "kg"}`
              : "—"}
          </h3>

          <p className="stat-foot">
            Personal log, no target set
          </p>
        </article>

        {/* Total Check-ins */}
        <article className="stat-card">
          <div className="stat-top">
            <span className="stat-icon blue">✧</span>
            <span className="stat-caption">YOUR JOURNEY</span>
          </div>

          <p className="stat-title">Total check-ins</p>
          <h3>{checkins.length}</h3>

          <p className="stat-foot">
            Every small step matters
          </p>
        </article>
      </div>

      {/* Latest Check-in Details */}
      <section className="panel latest-checkin-panel">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              MOST RECENT ENTRY
            </div>
            <h2 className="hedding">
              Latest check-in details
            </h2>
          </div>
        </div>

        {latest ? (
          <>
            <div className="latest-checkin-metrics">
              {latestDetails.map(([label, value]) => (
                <span key={label}>
                  <strong>{label}</strong>
                  {value}
                </span>
              ))}
            </div>

            {latest.note && (
              <blockquote className="latest-checkin-note">
                “{latest.note}”
              </blockquote>
            )}
          </>
        ) : (
          <p className="panel-description">
            Your saved mood and wellness details will appear here.
          </p>
        )}
      </section>

      {/* Weekly Stress Chart */}
      <section className="panel insight-panel">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              YOUR WEEK AT A GLANCE
            </div>
            <h2 className="hedding">
              Wellness overview
            </h2>
          </div>

          <span className="heading-icon">⌁</span>
        </div>

        <p className="panel-description">
          Your daily average stress score from the last seven days.
        </p>

        <div className="chart">
          <div className="chart-bars">
            {days.map((day, index) => (
              <div
                className="bar-column"
                key={`${day.label}-${index}`}
              >
                <div className="bar-track">
                  {day.stress !== null && (
                    <div
                      className="bar"
                      title={`Average stress: ${day.stress.toFixed(1)}/10`}
                      style={{
                        height: `${day.stress * 10}%`,
                      }}
                    />
                  )}
                </div>

                <span>{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-legend">
          <span className="legend-dot" />
          Saved stress scores
        </div>

        {checkins.length === 0 && (
          <p className="chart-note">
            Your chart is empty because you haven't saved a
            check-in yet. Save your first one to get started.
          </p>
        )}

        {/* Mood Distribution */}
        <div className="mood-distribution">
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                UNDERSTANDING YOURSELF
              </div>
              <h2>Mood distribution</h2>
            </div>
          </div>

          <p className="panel-description">
            A breakdown of the moods you've recorded.
          </p>

          {moodCounts.map((item) => (
            <div
              className="mood-distribution-item"
              key={item.name}
            >
              <div className="distribution-info">
                <span>
                  <MoodIcon mood={item.name} size={17} />{" "}
                  {item.name}
                </span>

                <strong>{item.percentage}%</strong>
              </div>

              <div className="distribution-track">
                <div
                  className="distribution-fill"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>

              <p className="distribution-count">
                {item.count}{" "}
                {item.count === 1 ? "check-in" : "check-ins"}
              </p>
            </div>
          ))}

          {checkins.length === 0 && (
            <p className="chart-note">
              Your mood distribution will appear after your
              first check-in.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default WellnessOverview;
