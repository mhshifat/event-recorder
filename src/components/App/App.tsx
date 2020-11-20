import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserEvents, UserEvent } from "../../store/userEvents";
import Calender from "../Calender";
import Recorder from "../Recorder";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const eventsStr = localStorage.getItem("events");
    const events: UserEvent[] = eventsStr ? JSON.parse(eventsStr) : [];
    if (!events.length) {
      const newEvent = {
        id: 1,
        title: "Record an event.",
        dateStart: "2020-11-19T15:05:11.546Z",
        dateEnd: "2020-11-19T16:05:11.546Z",
      };
      localStorage.setItem("events", JSON.stringify([newEvent]));
    }
    dispatch(loadUserEvents());
  }, [dispatch]);

  return (
    <div className="App">
      <Recorder />
      <Calender />
    </div>
  );
}

export default App;
