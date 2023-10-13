import React, { useRef, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

const LongBreak = () => {
    const [workInterval, setWorkInterval] = useState(15);
  const [isActive, setIsActive] = useState(false);
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
    setWorkInterval(15);
    setIsActive(false);
  };

  return (
    <div className='pomo'>
      <div className='progress'>
        <CircularProgressbar className='progressbar' value={workInterval} maxValue={15} text={`${workInterval}min`} />;
      </div>
      <button onClick={isActive ? handleStopClick : handleStartClick}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleResetClick}>Reset</button>
    </div>
  );
}

export default LongBreak