import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteUserEvent,
  updateUserEvent,
  UserEvent,
} from "../../store/userEvents";

interface Props {
  event: UserEvent;
}

const EventItem: React.FC<Props> = ({ event }) => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(event.title);

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    }
  }, [editable]);

  const handleDeleteEvent = () => {
    dispatch(deleteUserEvent(event.id));
  };

  return (
    <div className="calendar-event">
      <div className="calendar-event-info">
        <div className="calendar-event-time">10:00 - 12:00</div>
        <div className="calendar-event-title">
          {editable ? (
            <input
              type="text"
              ref={inputRef}
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              onBlur={() => {
                dispatch(updateUserEvent({ ...event, title }));
                setEditable(false);
              }}
            />
          ) : (
            <span onClick={() => setEditable(true)}>{event.title}</span>
          )}
        </div>
      </div>
      <button
        className="calendar-event-delete-button"
        onClick={handleDeleteEvent}
      >
        &times;
      </button>
    </div>
  );
};

export default EventItem;
