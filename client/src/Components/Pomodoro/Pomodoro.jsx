import React, { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Pomodoro.scss'

const Pomodoro = () => {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [currentTime, setCurrentTime] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro');

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            if (mode === 'pomodoro') {
              setMode('break');
              setCurrentTime(breakTime);
            } else if (mode === 'break') {
              setMode('pomodoro');
              setCurrentTime(workTime);
            }
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning, workTime, breakTime, mode]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleStartClick = () => {
    setIsRunning(true);
  };

  const handlePauseClick = () => {
    setIsRunning(false);
  };

  const handleResetClick = () => {
    setIsRunning(false);
    setCurrentTime(workTime);
    setMode('pomodoro');
  };

  const handleWorkTimeChange = (e) => {
    setWorkTime(e.target.value * 60);
    if (!isRunning) {
      setCurrentTime(e.target.value * 60);
    }
  };

  const handleBreakTimeChange = (e) => {
    setBreakTime(e.target.value * 60);
  };

  return (
    <div className="pomodoro">
      <div className="timer">
        <CircularProgressbar value={(currentTime / workTime) * 100} text={formatTime(currentTime)} />
      </div>
      <div className="controls">
        <button onClick={handleStartClick} disabled={isRunning}>Start</button>
        <button onClick={handlePauseClick} disabled={!isRunning}>Pause</button>
        <button onClick={handleResetClick} disabled={isRunning}>Reset</button>
      </div>
      <div className="settings">
        <div className="setting">
          <label htmlFor="work-time">Work Time:</label>
          <input type="number" id="work-time" value={workTime / 60} onChange={handleWorkTimeChange} />
        </div>
        <div className="setting">
          <label htmlFor="break-time">Break Time:</label>
          <input type="number" id="break-time" value={breakTime / 60} onChange={handleBreakTimeChange} />
        </div>
      </div>
      <div className="mode">
        {mode === 'pomodoro' ? 'Pomodoro' : 'Break'}
      </div>
    </div>
  );
};

export default Pomodoro;
