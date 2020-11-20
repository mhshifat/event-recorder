import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addZero } from "../../lib/utils";
import { selectDateStart, start, stop } from "../../store/recorder";
import { createUserEvent } from "../../store/userEvents";
import "./Recorder.css";

const Recorder = () => {
  const dispatch = useDispatch();
  const dateStart = useSelector(selectDateStart);
  const [, setCount] = useState<number>(0);

  const started = dateStart !== "";
  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0;
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  seconds -= minutes * 60;
  const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
  seconds -= hours * 60 * 60;
  const handleClick = async () => {
    if (started) {
      dispatch(createUserEvent());
      dispatch(stop());
    } else {
      dispatch(start());
      setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  return (
    <div className={`recorder ${started ? "recorder-started" : ""}`}>
      <button onClick={handleClick} className="recorder-record">
        <span></span>
      </button>
      <div className="recorder-counter">
        {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
    </div>
  );
};

export default Recorder;
