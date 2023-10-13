import React, { useRef, useState } from 'react';
import './Pomodoro.scss';
import { CircularProgressbar } from 'react-circular-progressbar';

const Pomodoro = () => {
  const [workInterval, setWorkInterval] = useState(25);
  const [isActive, setIsActive] = useState(false);
  // const [shortBreakInterval, setShortBreakInterval] = useState(5);
  // const [longBreakInterval, setLongBreakInterval] = useState(15);
  // const handleClick = (e) => {
  // setInterval(,1000);
  // handleCallback();
  // console.log(e.target.value);
  // if(value){
  //   console.log('play');
  //   handleCallback();
  //   setValue(false);
  //   console.log(workInterval);
  // }
  // else{
  //   console.log('pause');
  //   clearInterval();
  //   setValue(true);
  //   console.log(workInterval);
  // }
  // setInterval(() => {
  // let interval = workInterval;
  // setWorkInterval(workInterval-1);

  // while(interval>0){
  //   if(interval===0){
  //     break;
  //   }
  //   else
  // }
  // }, 1000);
  // };
  // function handleCallback(){
  //   setInterval(() => {

  //     setWorkInterval(workInterval-1);
  //   }, 1000);
  // }

  // const value = 0.66;

  // return (
  // <>
  {/* <div className="pomodoro">
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
      </div> */}

  const increment = useRef(null);

  const handleStartClick = () => {
    setIsActive(true);
    increment.current = setInterval(() => {
      setWorkInterval((workInterval) => workInterval - 1);
    }, 60000);
  };

  const handleStopClick = () => {
    clearInterval(increment.current);
    setIsActive(false);
  };

  const handleResetClick = () => {
    clearInterval(increment.current);
    setWorkInterval(25);
    setIsActive(false);
  };

  return (
    <div className='pomo'>
      <div className='progress'>
        <CircularProgressbar className='progressbar' value={workInterval} maxValue={25} text={`${workInterval}min`} />;
      </div>
      <button onClick={isActive ? handleStopClick : handleStartClick}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleResetClick}>Reset</button>
    </div>
  );
};



export default Pomodoro