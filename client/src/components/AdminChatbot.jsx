import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import chatbotAnimation from "../assets/chatbot.json";
import "./StudentChatbot.css";

export default function AdminChatbot({ stats }) {
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
    "How many participants have I approved?",
    "How many participants are pending approval?",
    "How many participants are rejected?",
    "Give me a summary of event status"
  ];

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const normalizeStats = (stats) => {
    if (!stats || typeof stats !== "object") {
      return {
        total: 0,
        approvedParticipants: 0,
        pendingParticipants: 0,
        rejectedParticipants: 0,
      };
    }

    // Priority order:
    // 1. myEvents (full event objects)
    // 2. myEventIds (IDs only)
    // 3. totalEventsCreated (explicit count if provided)

    let totalEvents = 0;

    if (Array.isArray(stats.myEvents) && stats.myEvents.length > 0) {
      totalEvents = stats.myEvents.length;
    } else if (Array.isArray(stats.myEventIds) && stats.myEventIds.length > 0) {
      totalEvents = stats.myEventIds.length;
    } else if (Number.isFinite(stats.totalEventsCreated)) {
      totalEvents = Number(stats.totalEventsCreated);
    }

    return {
      total: totalEvents,
      approvedParticipants: Number(stats.approvedParticipants ?? 0),
      pendingParticipants: Number(stats.pendingParticipants ?? 0),
      rejectedParticipants: Number(stats.rejectedParticipants ?? 0),
    };
  };

  const handleQuestion = (q) => {
    addMessage("user", q);
    const safeStats = normalizeStats(stats);

    if (!stats || typeof stats !== "object") {
      setTimeout(() => {
        addMessage("bot", "Admin data is not available right now.");
      }, 300);
      return;
    }

    const question = q.toLowerCase();
    let reply = "";

    // 1. TOTAL EVENTS
    if (question.includes("total")) {
      if (safeStats.total === 0) {
        reply = "You haven’t created any events yet.";
      } else if (safeStats.total === 1) {
        reply = "📊 You have created 1 event.";
      } else {
        reply = `📊 There are ${safeStats.total} total events.`;
      }
    }

    // 2. APPROVED PARTICIPANTS
    else if (question.includes("approved")) {
      reply = `✅ ${safeStats.approvedParticipants} participants are approved.`;
    }

    // 3. PENDING PARTICIPANTS
    else if (question.includes("pending")) {
      reply = `⏳ ${safeStats.pendingParticipants} participants are pending approval.`;
    }

    // 4. REJECTED PARTICIPANTS
    else if (question.includes("rejected")) {
      reply = `❌ ${safeStats.rejectedParticipants} participants are rejected.`;
    }

    // 5. SUMMARY
    else if (question.includes("summary")) {
      if (safeStats.total === 0) {
        reply = "You haven’t created any events yet.";
      } else {
        reply =
          `📌 Event Summary:\n` +
          `• Approved Participants: ${safeStats.approvedParticipants}\n` +
          `• Pending Participants: ${safeStats.pendingParticipants}\n` +
          `• Rejected Participants: ${safeStats.rejectedParticipants}`;
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