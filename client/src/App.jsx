import React, { useEffect, useLayoutEffect, useState } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

import Login from "./pages/Login.jsx";
import NewUser from "./pages/Newuser.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CollegeDashboard, { CollegeDashboardNavbar } from "./pages/CollegeDashboard.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import AllEvents from "./pages/AllEvents.jsx";
import ManageParticipants from "./pages/ManageParticipants.jsx";
import FeedbackAnalysis from "./pages/FeedbackAnalysis.jsx";
import { StudentDashboardNavbar } from "./pages/StudentDashboard.jsx";
import ErrorPage from "./components/errorpage";
import GlobalLoader from "./components/GlobalLoader";
import StudentChatbot from "./components/StudentChatbot";
import AdminChatbot from "./components/AdminChatbot";

function AppLayout({ navbarProps, chatbotProps }) {
  return (
    <>
      <CollegeDashboardNavbar {...navbarProps} />
      <Outlet />
      <AdminChatbot stats={chatbotProps} />
    </>
  );
}

function StudentLayout() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <>
      <StudentDashboardNavbar />
      <Outlet />
      <StudentChatbot events={events} />
    </>
  );
}

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const location = useLocation();

  const [myEvents, setMyEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    // fetch events created by this admin
    fetch(`http://localhost:5000/events?createdBy=${user._id}`)
      .then(res => res.json())
      .then(data => {
        setMyEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => setMyEvents([]));

    // fetch registrations ONLY for events created by this admin
    fetch(`http://localhost:5000/registrations/admin/${user._id}`)
      .then(res => res.json())
      .then(data => {
        setMyRegistrations(Array.isArray(data) ? data : []);
      })
      .catch(() => setMyRegistrations([]));
  }, []);

  const stats = React.useMemo(() => {
    const relevantRegistrations = myRegistrations;

    return {
      total: myEvents.length,
      approvedParticipants: relevantRegistrations.filter(
        r => r.status?.toLowerCase() === "approved"
      ).length,
      pendingParticipants: relevantRegistrations.filter(
        r => r.status?.toLowerCase() === "pending"
      ).length,
      rejectedParticipants: relevantRegistrations.filter(
        r => r.status?.toLowerCase() === "rejected"
      ).length
    };
  }, [myEvents, myRegistrations]);

  useLayoutEffect(() => {
    setAppLoading(true);

    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const authRoutes = ["/", "/signup"];

    if (authRoutes.includes(location.pathname)) {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  }, [location.pathname]);

  return (
    <>
      <GlobalLoader show={appLoading} />

      <div className={appLoading ? "app-shell app-loading" : "app-shell"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<NewUser />} />

          <Route element={<StudentLayout />}>
            <Route path="/student-dashboard/*" element={<StudentDashboard />} />
            <Route path="/student-dashboard/all-events" element={<AllEvents />} />
            <Route path="/student-dashboard/all-events/event/:id" element={<EventDetails />} />
          </Route>

          <Route
            element={
              <AppLayout
                navbarProps={{
                  myEvents,
                  myRegistrations,
                  approvedCount: stats.approvedParticipants,
                  pendingCount: stats.pendingParticipants,
                  rejectedCount: stats.rejectedParticipants,
                  totalEventsCreated: stats.total
                }}
                chatbotProps={{
                  myEvents,
                  totalEventsCreated: myEvents.length,
                  approvedParticipants: stats.approvedParticipants,
                  pendingParticipants: stats.pendingParticipants,
                  rejectedParticipants: stats.rejectedParticipants
                }}
              />
            }
          >
            <Route path="/college-dashboard" element={<CollegeDashboard />} />
            <Route path="/manage-participants" element={<ManageParticipants />} />
            <Route path="/feedback" element={<FeedbackAnalysis />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/all-events" element={<AllEvents />} />
            <Route path="/all-events/event/:id" element={<EventDetails />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}