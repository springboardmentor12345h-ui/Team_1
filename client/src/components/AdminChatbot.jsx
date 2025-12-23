import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import chatbotAnimation from "../assets/chatbot.json";
import "./StudentChatbot.css";

export default function AdminChatbot({ events }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I can help you with event information!" }
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const chatBoxRef = useRef(null);
  const toggleRef = useRef(null);
  const messagesEndRef = useRef(null);

  const questions = [
    "How many total events are there?",
    "How many participants are approved?",
    "How many participants are pending approval?",
    "How many participants are rejected?",
    "Give me a summary of event status"
  ];

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const handleQuestion = (q) => {
    addMessage("user", q);

    if (!events || typeof events !== "object") {
      setTimeout(() => {
        addMessage("bot", "Admin data is not available right now.");
      }, 300);
      return;
    }

    const question = q.toLowerCase();
    let reply = "";

    // 1. TOTAL EVENTS
    if (question.includes("total events")) {
      reply = `📊 You have created ${events.total ?? 0} total events.`;
    }

    // 2. APPROVED PARTICIPANTS
    else if (question.includes("approved")) {
      reply = `✅ ${events.approvedParticipants ?? 0} participants are approved.`;
    }

    // 3. PENDING PARTICIPANTS
    else if (question.includes("pending")) {
      reply = `⏳ ${events.pendingParticipants ?? 0} participants are pending approval.`;
    }

    // 4. REJECTED PARTICIPANTS
    else if (question.includes("rejected")) {
      reply = `❌ ${events.rejectedParticipants ?? 0} participants are rejected.`;
    }

    // 5. SUMMARY
    else if (question.includes("summary")) {
      if ((events.total ?? 0) === 0) {
        reply = "You haven’t created any events yet.";
      } else {
        reply =
          `📌 Event Summary:\n` +
          `• Total Events: ${events.total ?? 0}\n` +
          `• Approved Participants: ${events.approvedParticipants ?? 0}\n` +
          `• Pending Participants: ${events.pendingParticipants ?? 0}\n` +
          `• Rejected Participants: ${events.rejectedParticipants ?? 0}`;
      }
    }

    else {
      reply = "Please select one of the available admin questions.";
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // auto scroll to bottom when messages change
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
        <Lottie
          animationData={chatbotAnimation}
          loop
          autoplay
        />
      </div>

      {/* Chat window */}
      {open && (
        <div className="chatbot-box" ref={chatBoxRef}>
          <div className="chatbot-header">
            Admin Assistant
            <span className="crossbtn" onClick={() => setOpen(false)}>✖</span>
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