
import React from "react";
import MoodIcon from "./MoodIcons";

function MoodHistory({ checkins = [] }) {
  // Sort newest-first and display the latest 7 check-ins
  const recentCheckins = [...checkins]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 7);

  function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <section className="panel mood-history" id="history">
      <div className="section-heading">
        <div>
          <div className="section-kicker">
            YOUR JOURNEY
          </div>

          <h2 className="hedding">Mood history</h2>
        </div>

        <span className="heading-icon">↗</span>
      </div>

      <p className="panel-description">
        Look back at your recent check-ins and notice how
        you've been feeling.
      </p>

      {recentCheckins.length === 0 ? (
        <div className="history-empty">
          <div className="empty-icon">♡</div>

          <h3>Your story starts here</h3>

          <p>
            Save your first mood check-in to see it appear here.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {recentCheckins.map((item) => (
            <article
              className="history-item"
              key={item._id || item.id || item.createdAt}
            >
              <div className="history-mood">
                <MoodIcon
                  mood={item.mood}
                  size={24}
                  className="history-emoji"
                />

                <div>
                  <h3>{item.mood || "Mood unavailable"}</h3>
                  <p>{formatDate(item.createdAt)}</p>
                </div>
              </div>

              <div className="history-details">
                <span>Stress</span>
                <strong>
                  {item.stress !== undefined && item.stress !== null
                    ? `${item.stress}/10`
                    : "Not recorded"}
                </strong>
              </div>

              <div className="history-details">
                <span>Sleep</span>
                <strong>
                  {item.sleepHours !== undefined &&
                  item.sleepHours !== null
                    ? `${item.sleepHours} hrs`
                    : "Not recorded"}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MoodHistory;
