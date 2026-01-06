import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import chatbotAnimation from "../assets/chatbot.json";
import "./StudentChatbot.css";

export default function StudentChatbot({ events }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I can help you with event information!" }
  ]);

  const chatBoxRef = useRef(null);
  const toggleRef = useRef(null);
  const messagesEndRef = useRef(null);

  const questions = [
    "Which all events are there?",
    "How many events are available?",
    "List cultural events",
    "When is the next event?",
    "Where are events conducted?"
  ];

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const handleQuestion = (q) => {
    addMessage("user", q);

    // 🔒 chatbot must ALWAYS reply
    if (!Array.isArray(events)) {
      setTimeout(() => {
        addMessage(
          "bot",
          "I’m having trouble loading event data right now, but the chatbot is working 👍"
        );
      }, 300);
      return;
    }

    if (events.length === 0) {
      setTimeout(() => {
        addMessage("bot", "There are currently no events available.");
      }, 300);
      return;
    }

    const question = q.toLowerCase();
    let reply = "";

    if (question.includes("there")) {
      const upcoming = events.filter(e => !e.completed);
      reply = upcoming.length
        ? ` Events:\n${upcoming
          .map((e, i) => `${i + 1}. ${e.title}`)
          .join("\n")}`
        : "There are no upcoming events right now.";
    }

    else if (question.includes("how many")) {
      reply = `There are currently ${events.length} events available.`;
    }

    else if (question.includes("cultural")) {
      const culturalEvents = events.filter(
        e => e.category && e.category.toLowerCase().includes("cultural")
      );

      reply = culturalEvents.length
        ? `Cultural Events:\n${culturalEvents
          .map((e, i) => `${i + 1}. ${e.title}`)
          .join("\n")}`
        : "No cultural events available.";
    }

    else if (question.includes("next")) {
      const nextEvent = events.find(e => !e.completed);
      reply = nextEvent
        ? `Next event is "${nextEvent.title}" at ${nextEvent.location}.`
        : "No upcoming events found.";
    }

    else if (question.includes("where") || question.includes("location")) {
      const locations = [...new Set(events.map(e => e.location))];
      reply = `Events are conducted at:\n${locations
        .map(loc => `• ${loc}`)
        .join("\n")}`;
    }

    else {
      reply =
        "You can ask about upcoming events, cultural events, event count, or locations.";
    }

    setTimeout(() => addMessage("bot", reply), 300);
  };

  // close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        chatBoxRef.current &&
        !chatBoxRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chatbot toggle */}
      <div
        className={`chatbot-toggle ${open ? "open" : ""}`}
        ref={toggleRef}
        onClick={() => setOpen(prev => !prev)}
      >
        <Lottie animationData={chatbotAnimation} loop autoplay />
      </div>

      {/* Chat window */}
      {open && (
        <div className="chatbot-box" ref={chatBoxRef}>
          <div className="chatbot-header">
            Event Assistant
            <span className="crossbtn" onClick={() => setOpen(false)}>
              ✖
            </span>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-questions">
            {questions.map((q, i) => (
              <button key={i} onClick={() => handleQuestion(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}