import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Navbar  from "./components/Navbar";
import EventsPage from "./components/EventsPage";
import  Dashboard  from "./components/Dashboard";
import { EventDetails } from "./components/EventDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
