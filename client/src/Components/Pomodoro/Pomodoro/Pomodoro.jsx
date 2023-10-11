import React, { useState } from 'react';
import './Pomodoro.scss';
// import { CircularProgressbar } from 'react-circular-progressbar';

const Pomodoro = () => {
  const [workInterval, setWorkInterval] = useState(25);
  const [shortBreakInterval, setShortBreakInterval] = useState(5);
  const [longBreakInterval, setLongBreakInterval] = useState(15);

  const handleChange = (e, setInterval) => {
    setInterval(parseInt(e.target.value));
  };

  // const value = 0.66;

  return (
    <>
      <div className="pomodoro">
        <h2>Custom Pomodoro</h2>
        <div className="interval-inputs">
          <div className="input-container">
            <label htmlFor="work-interval">Work Interval (minutes)</label>
            <input
              id="work-interval"
              type="number"
              value={workInterval}
              onChange={(e) => handleChange(e, setWorkInterval)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="short-break-interval">Short Break Interval (minutes)</label>
            <input
              id="short-break-interval"
              type="number"
              value={shortBreakInterval}
              onChange={(e) => handleChange(e, setShortBreakInterval)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="long-break-interval">Long Break Interval (minutes)</label>
            <input
              id="long-break-interval"
              type="number"
              value={longBreakInterval}
              onChange={(e) => handleChange(e, setLongBreakInterval)}
            />
          </div>
        </div>
        <button type='submit'>Submit</button>
      </div>
      {/* <div style={{ width: 200, height: 200 }}>
        <CircularProgressbar value={value} maxValue={1} text={`${value * 100}%`} />;
      </div> */}
    </>
  );
};

export default Pomodoro