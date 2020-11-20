import React, { useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { addZero } from "../../lib/utils";
import { RootState } from "../../store/index";
import {
  loadUserEvents,
  selectUserEventsArray,
  UserEvent,
} from "../../store/userEvents";
import "./Calender.css";
import EventItem from "./EventItem";

const mapState = (state: RootState) => ({
  events: selectUserEventsArray(state),
});
const mapDispatch = {
  loadUserEvents,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

const createDateKey = (date: Date) => {
  const year = date.getFullYear();
  const months = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${addZero(months)}-${addZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
  const group: Record<string, UserEvent[]> = {};

  const addToGroup = (dateKey: string, evt: UserEvent) => {
    if (group[dateKey] === undefined) {
      group[dateKey] = [];
    }

    group[dateKey].push(evt);
  };

  events.forEach((event) => {
    const dateStartKey = createDateKey(new Date(event.dateStart));
    const dateEndKey = createDateKey(new Date(event.dateEnd));

    addToGroup(dateStartKey, event);

    if (dateStartKey !== dateEndKey) {
      addToGroup(dateEndKey, event);
    }
  });

  return group;
};

const Calender: React.FC<Props> = ({ loadUserEvents, events }) => {
  const loadUserEventsRef = useRef(loadUserEvents);

  useEffect(() => {
    loadUserEventsRef.current();
  }, []);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date2) - +new Date(date1)
    );
  }

  if (!groupedEvents && !sortedGroupKeys) return <p>Loading...</p>;
  return (
    <div className="calendar">
      {sortedGroupKeys!.map((dateKey: string) => {
        const events = groupedEvents![dateKey];
        const date = new Date(dateKey);
        const day = date.getDate();
        const month = date.toLocaleString(undefined, { month: "long" });

        return (
          <div className="calendar-day" key={dateKey}>
            <div className="calendar-day-label">
              <span>
                {day} {month}
              </span>
            </div>
            <div className="calendar-events">
              {events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default connector(Calender);
