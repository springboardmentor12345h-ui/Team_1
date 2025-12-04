import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import NewUser from "./pages/Newuser.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CollegeDashboard, { CollegeDashboardNavbar } from "./pages/CollegeDashboard.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import AllEvents from "./pages/AllEvents.jsx";
import ManageParticipants from "./pages/ManageParticipants.jsx";
import FeedbackAnalysis from "./pages/FeedbackAnalysis.jsx";
import { Outlet } from "react-router-dom";
import { StudentDashboardNavbar } from "./pages/StudentDashboard.jsx";

function AppLayout() {
  return (
    <>
      <CollegeDashboardNavbar />
      <Outlet />
    </>
  );
}

function StudentLayout() {
  return (
    <>
      <StudentDashboardNavbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}