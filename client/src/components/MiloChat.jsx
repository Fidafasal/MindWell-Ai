
import React, { useEffect, useRef, useState } from "react";
import "../styles/MiloChat.css";
import { apiRequest } from "../utils/api";

const suggestions = [
  "I'm feeling stressed",
  "Help me relax",
  "I feel sad today",
  "Give me some motivation",
];

const welcomeMessage = {
  id: "welcome",
  sender: "milo",
  text: "Hey there! 💚 I'm Milo, your wellness companion. You can talk to me about your day, your feelings, or anything that's on your mind. How are you doing today?",
};

function MiloChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [messages, setMessages] = useState([welcomeMessage]);

  const messagesEndRef = useRef(null);

  // Load saved conversation from MongoDB
  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const data = await apiRequest("/api/milo/history");

        if (!active) return;

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const savedMessages = data.messages.map((item, index) => ({
            id: item._id || `saved-${index}`,
            sender: item.role === "model" ? "milo" : "user",
            text: item.text,
          }));

          setMessages([welcomeMessage, ...savedMessages]);
        }
      } catch (error) {
        console.error("Milo history error:", error);
      } finally {
        if (active) {
          setIsLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(value = message) {
    const cleanMessage = value.trim();

    if (!cleanMessage || isTyping || isLoadingHistory) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanMessage,
    };

    setMessages((previous) => [...previous, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const data = await apiRequest("/api/milo/chat", {
        method: "POST",
        body: {
          message: cleanMessage,
        },
      });

      if (!data.reply) {
        throw new Error("Milo returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "milo",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Milo chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "milo",
          text: "I'm having trouble connecting right now. 💚 Please try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }
  
async function clearChatHistory() {
  const confirmed = window.confirm(
    "Are you sure you want to permanently delete your Milo chat history?"
  );

  if (!confirmed) return;

  try {
    await apiRequest("/api/milo/history", {
      method: "DELETE",
    });

    setMessages([welcomeMessage]);
  } catch (error) {
    console.error("Clear history error:", error);
    alert("Could not clear chat history. Please try again.");
  }
}


  return (
    <div className="milo-widget">
      {isOpen && (
        <section className="milo-window">
          <header className="milo-header">
            <div className="milo-profile">
              <div className="milo-avatar">✦</div>

              <div>
                <h3>Milo</h3>
                <span>
                  <i className="milo-online-dot" />
                  Your wellness companion
                </span>
              </div>
            </div>

           <div className="milo-header-actions">
  <button
    className="milo-clear"
    onClick={clearChatHistory}
    title="Clear chat history"
    aria-label="Clear chat history"
  >
    <span>↻</span>
  </button>

  <button
    className="milo-close"
    onClick={() => setIsOpen(false)}
    aria-label="Close Milo chat"
  >
    ×
  </button>
</div>
          </header>

          <div className="milo-welcome">
            <span>YOUR LITTLE SPACE TO TALK</span>
            <p>Take your time. I'm listening. 🌿</p>
          </div>

          <div className="milo-messages">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`milo-message-row ${item.sender}`}
              >
                {item.sender === "milo" && (
                  <div className="milo-small-avatar">✦</div>
                )}

                <div className="milo-message">
                  {item.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="milo-message-row milo">
                <div className="milo-small-avatar">✦</div>
                <div className="milo-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {isLoadingHistory && (
              <div className="milo-message-row milo">
                <div className="milo-small-avatar">✦</div>
                <div className="milo-message">
                  Loading your conversation...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !isLoadingHistory && (
            <div className="milo-suggestions">
              <span>YOU CAN START WITH</span>

              <div className="milo-suggestion-list">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => sendMessage(item)}
                    disabled={isTyping || isLoadingHistory}
                  >
                    {item} <span>↗</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="milo-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share what's on your mind..."
              aria-label="Message Milo"
            />

            <button
              type="submit"
              disabled={!message.trim() || isTyping || isLoadingHistory}
              aria-label="Send message"
            >
              ↑
            </button>
          </form>

          <div className="milo-disclaimer">
            Milo is a wellness companion, not a medical professional.
          </div>
        </section>
      )}

      <button
        className={`milo-launcher ${isOpen ? "opened" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close Milo" : "Chat with Milo"}
      >
        {isOpen ? (
          <span className="milo-launcher-close">×</span>
        ) : (
          <>
            <span className="milo-launcher-icon">✦</span>
            <span className="milo-launcher-label">Chat with Milo</span>
          </>
        )}
      </button>
    </div>
  );
}

export default MiloChat;
