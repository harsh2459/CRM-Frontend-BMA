import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axiosInstance from "../utils/axiosInstance";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style/components/calendarview.css";


const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [user, setUser] = useState(null);
  const { users } = useSelector((state) => state.user); 
  
  const events = [
    {
      title: "Sample Task 1",
      start: new Date(),
      end: new Date(),
      priority: "Important and urgent", // Example of priority
      status: "Open",
      category: "General",
      description: "Task description",
    },
  ];

  // Set the priority color for the task based on the task's priority
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Not important and Not urgent":
        return "badge low";
      case "Important but not urgent":
        return "badge medium";
      case "Not important But urgent":
        return "badge high";
      case "Important and urgent":
        return "badge critical";
      default:
        return "badge muted";
    }
  };

  const handleButtonClick = (event, actionType) => {
    if (actionType === "done") {
      alert(`Task marked as done: ${event.title}`);
    } else if (actionType === "edit") {
      alert(`Editing task: ${event.title}`);
    }
  };

  // Custom Event with Buttons
  const CustomEvent = ({ event }) => (
    <div
      style={{
        padding: 8,
        backgroundColor: "#1366d6",
        color: "white",
        borderRadius: 6,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 4 }}>{event.title}</div>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
        {event.description || `Due ${moment(event.start).fromNow()}`}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          style={{
            borderRadius: "50%",
            border: "none",
            width: 24,
            height: 24,
            cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.9)",
            color: "#1366d6",
            pointerEvents: "auto",
          }}
          onClick={() => handleButtonClick(event, "done")}
          title="Mark Done"
        >
          ✓
        </button>
        <button
          style={{
            borderRadius: "50%",
            border: "none",
            width: 24,
            height: 24,
            cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.8)",
            color: "#1366d6",
          }}
          onClick={() => handleButtonClick(event, "edit")}
          title="Edit Task"
        >
          🗒
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h3>Calendar View</h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, margin: "30px auto" }}
        views={["week", "day", "month"]}
        defaultView="week"
        step={30}
        timeslots={2}
        scrollToTime={new Date(2025, 7, 28, 9, 0, 0)}
        showMultiDayTimes={false}
        dayPropGetter={() => ({
          className: "date-day",
        })}
        eventPropGetter={() => ({
          style: {
            backgroundColor: "transparent", // Make background transparent
            color: "inherit", // Inherit text color
            padding: 0,
          },
        })}
        components={{
          event: CustomEvent, // Custom event component
        }}
        formats={{
          eventTimeRangeFormat: () => "", // Remove event time
          timeGutterFormat: () => "", // Remove time gutter
          dateFormat: "D", // Show only day numbers
          dayFormat: "ddd", // Show day names (Mon, Tue, etc.)
          monthHeaderFormat: "MMMM YYYY", // Full month and year
        }}
      />
    </div>
  );
};

export default MyCalendar;
