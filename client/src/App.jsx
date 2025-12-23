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

function AppLayout() {
  return (
    <>
      <CollegeDashboardNavbar />
      <Outlet />
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

          <Route element={<AppLayout />}>
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