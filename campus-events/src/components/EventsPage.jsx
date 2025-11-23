import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventType, setEventType] = useState("All Types");
  const [eventStatus, setEventStatus] = useState("All Status");
  const [dateRange, setDateRange] = useState("All Dates");

  const events = [
    {
      id: 1,
      title: "Inter-College Hackathon 2025",
      type: "Hackathon",
      status: "Completed",
      date: "Jan 2025",
      image: "/images/hackathon.jpeg",
      description: "Coding marathon for young innovators."
    },
    {
      id: 2,
      title: "Cultural Fest - Harmony 2025",
      type: "Cultural",
      status: "Active",
      date: "Feb 2025",
      image: "/images/cultural.jpeg",
      description: "Celebrate arts, music & creativity."
    },
    {
      id: 3,
      title: "Basketball Championship 2025",
      type: "Sports",
      status: "Upcoming",
      date: "Mar 2025",
      image: "/images/basketball.jpeg",
      description: "Annual inter-college basketball tournament."
    }
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventType === "All Types" || event.type === eventType;
    const matchesStatus = eventStatus === "All Status" || event.status === eventStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Container sx={{ mt: 3 }}>

      {/* 🔵 TOP NAV BUTTONS (Dashboard + All Events) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Link to="/events" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 18px",
              backgroundColor: "#1976d2",
              border: "none",
              color: "white",
              borderRadius: "8px",
              fontSize: "15px",
              cursor: "pointer"
            }}
          >
            ALL EVENTS
          </button>
        </Link>

        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 18px",
              backgroundColor: "#1976d2",
              border: "none",
              color: "white",
              borderRadius: "8px",
              fontSize: "15px",
              cursor: "pointer"
            }}
          >
            DASHBOARD
          </button>
        </Link>
      </Box>

      {/* PAGE TITLE */}
      <Typography variant="h3" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
        All Events
      </Typography>

      {/* SEARCH BAR */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
      </Box>

      {/* FILTER BOX */}
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          p: 3,
          mb: 4,
          backgroundColor: "#fafafa"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", opacity: 0.9 }}>
          Filters
        </Typography>

        <Grid container spacing={3}>
          {/* EVENT TYPE */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Event Type
            </Typography>
            <FormControl fullWidth>
              <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <MenuItem value="All Types">All Types</MenuItem>
                <MenuItem value="Hackathon">Hackathon</MenuItem>
                <MenuItem value="Cultural">Cultural</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* STATUS */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Status
            </Typography>
            <FormControl fullWidth>
              <Select value={eventStatus} onChange={(e) => setEventStatus(e.target.value)}>
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* DATE RANGE */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Date Range
            </Typography>
            <FormControl fullWidth>
              <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <MenuItem value="All Dates">All Dates</MenuItem>
                <MenuItem value="This Week">This Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="This Year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* EVENT CARDS */}
      <Grid container spacing={4}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ borderRadius: "12px" }}>
              <CardMedia component="img" height="180" image={event.image} alt={event.title} />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {event.title}
                </Typography>

                <Typography sx={{ mb: 1 }}>{event.description}</Typography>

                <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                  📅 {event.date}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Link to={`/events/${event.id}`} style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: "#1976d2",
                        color: "white",
                        borderRadius: "8px",
                        textAlign: "center"
                      }}
                    >
                      View Details
                    </Box>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventsPage;
