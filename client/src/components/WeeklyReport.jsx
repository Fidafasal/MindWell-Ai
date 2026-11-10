
import React from "react";
import MoodIcon from "./MoodIcons";

function WeeklyReport({ checkins = [] }) {
  // Get the start of the current week (Monday)
  const today = new Date();
  const startOfWeek = new Date(today);

  const day = today.getDay();
  const difference = day === 0 ? 6 : day - 1;

  startOfWeek.setDate(today.getDate() - difference);
  startOfWeek.setHours(0, 0, 0, 0);

  // Get this week's check-ins
  const weeklyCheckins = checkins.filter((item) => {
    const date = new Date(item.createdAt);
    return date >= startOfWeek && date <= today;
  });

  const total = weeklyCheckins.length;

  // Average stress
  const averageStress = total
    ? (
        weeklyCheckins.reduce(
          (sum, item) => sum + Number(item.stress),
          0
        ) / total
      ).toFixed(1)
    : "—";

  // Average sleep
  const averageSleep = total
    ? (
        weeklyCheckins.reduce(
          (sum, item) => sum + Number(item.sleepHours),
          0
        ) / total
      ).toFixed(1)
    : "—";

  // Most frequently recorded mood
  const moodCounts = weeklyCheckins.reduce((counts, item) => {
    counts[item.mood] = (counts[item.mood] || 0) + 1;
    return counts;
  }, {});

  const mostFrequentMood = Object.entries(moodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const moodEmoji = Object.fromEntries(Object.keys(moodCounts).map((mood) => [mood, <MoodIcon mood={mood} size={20} />]));

  return (
    <section className="panel weekly-report" id="weekly-report">
      <div className="section-heading">
        <div>
          <div className="section-kicker">
            YOUR WELLNESS JOURNEY
          </div>
          <h2 className="hedding">Weekly report</h2>
        </div>

        <span className="heading-icon">✧</span>
      </div>

      <p className="panel-description">
        A look at your recorded wellness activity this week.
      </p>

      {total === 0 ? (
        <div className="report-empty">
          <span>🌱</span>
          <h3 className="hedding" >Your weekly report is waiting</h3>
          <p>
            Save a check-in this week to start building your report.
          </p>
        </div>
      ) : (
        <>
          <div className="report-grid">
            <article className="report-stat">
              <span className="report-stat-icon">♡</span>
              <p>Total check-ins</p>
              <h3>{total}</h3>
            </article>

            <article className="report-stat">
              <span className="report-stat-icon">◉</span>
              <p>Average stress</p>
              <h3>{averageStress}<small> / 10</small></h3>
            </article>

            <article className="report-stat">
              <span className="report-stat-icon">☾</span>
              <p>Average sleep</p>
              <h3>{averageSleep}<small> hrs</small></h3>
            </article>

            <article className="report-stat">
              <span className="report-stat-icon">✧</span>
              <p>Most recorded mood</p>
              <h3 className="report-mood">
                {moodEmoji[mostFrequentMood[0]] || "♡"}
                {" "}
                {mostFrequentMood[0]}
              </h3>
            </article>
          </div>

          <div className="report-summary">
            <h3  className="hedding">Your week at a glance</h3>
            <p>
              You recorded {total} check-in{total === 1 ? "" : "s"} this week.
              Your most frequently recorded mood was{" "}
              <strong>{mostFrequentMood[0]}</strong>.
              Your average recorded stress was {averageStress}/10,
              and your average sleep was {averageSleep} hours.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

export default WeeklyReport;
