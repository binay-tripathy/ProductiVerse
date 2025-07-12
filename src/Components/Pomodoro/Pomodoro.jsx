import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Pomodoro.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons';
import BackButton from '../BackButton/BackButton';
import { sendRuntimeMessage, isChromeExtension, connectToBackground } from '../../utils/chromeAPI';

const Pomodoro = () => {
  const [pomodoroState, setPomodoroState] = useState({
    workTime: 25 * 60,
    breakTime: 5 * 60,
    currentTime: 25 * 60,
    isRunning: false,
    mode: 'work',
    completedPomodoros: 0
  });

  useEffect(() => {
    const loadState = async () => {
      try {
        const response = await sendRuntimeMessage({ type: 'GET_POMODORO_STATE' });
        if (response && response.success !== false) {
          setPomodoroState(response);
        }
      } catch (error) {
        if (!error.message.includes('Could not establish connection')) {
          console.error('Error loading Pomodoro state:', error);
        }
      }
    };

    loadState();

    if (isChromeExtension()) {
      const handleMessage = (message, sender, sendResponse) => {
        if (message.type === 'POMODORO_TICK' || message.type === 'POMODORO_MODE_CHANGE') {
          setPomodoroState(message.payload);
        }
        sendResponse({ received: true });
      };

      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        try {
          chrome.runtime.onMessage.removeListener(handleMessage);
        } catch (error) {}
      };
    }
  }, []);

  useEffect(() => {
    let port;
    if (isChromeExtension()) {
      try {
        port = connectToBackground();
      } catch (error) {}
    }
    return () => {
      if (port) {
        try {
          port.disconnect();
        } catch (error) {}
      }
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getProgress = () => {
    const max = pomodoroState.mode === 'work' ? pomodoroState.workTime : pomodoroState.breakTime;
    return ((max - pomodoroState.currentTime) / max) * 100;
  };

  const handleStart = async () => {
    try {
      const response = await sendRuntimeMessage({ type: 'START_POMODORO' });
      if (response.success !== false) {
        setPomodoroState(prev => ({ ...prev, isRunning: true }));
      }
    } catch (error) {
      setPomodoroState(prev => ({ ...prev, isRunning: true }));
    }
  };

  const handlePause = async () => {
    try {
      const response = await sendRuntimeMessage({ type: 'PAUSE_POMODORO' });
      if (response.success !== false) {
        setPomodoroState(prev => ({ ...prev, isRunning: false }));
      }
    } catch (error) {
      setPomodoroState(prev => ({ ...prev, isRunning: false }));
    }
  };

  const handleReset = async () => {
    try {
      const response = await sendRuntimeMessage({ type: 'RESET_POMODORO' });
      if (response.success !== false) {
        setPomodoroState(prev => ({ 
          ...prev, 
          isRunning: false, 
          mode: 'work',
          currentTime: prev.workTime 
        }));
      }
    } catch (error) {
      setPomodoroState(prev => ({ 
        ...prev, 
        isRunning: false, 
        mode: 'work',
        currentTime: prev.workTime 
      }));
    }
  };

  const handleWorkTimeChange = async (minutes) => {
    try {
      const response = await sendRuntimeMessage({ 
        type: 'UPDATE_WORK_TIME', 
        payload: { minutes } 
      });
      if (response.success !== false) {
        const newWorkTime = minutes * 60;
        setPomodoroState(prev => ({
          ...prev,
          workTime: newWorkTime,
          currentTime: prev.mode === 'work' && !prev.isRunning ? newWorkTime : prev.currentTime
        }));
      }
    } catch (error) {
      const newWorkTime = minutes * 60;
      setPomodoroState(prev => ({
        ...prev,
        workTime: newWorkTime,
        currentTime: prev.mode === 'work' && !prev.isRunning ? newWorkTime : prev.currentTime
      }));
    }
  };

  const handleBreakTimeChange = async (minutes) => {
    try {
      const response = await sendRuntimeMessage({ 
        type: 'UPDATE_BREAK_TIME', 
        payload: { minutes } 
      });
      if (response.success !== false) {
        const newBreakTime = minutes * 60;
        setPomodoroState(prev => ({
          ...prev,
          breakTime: newBreakTime,
          currentTime: prev.mode === 'break' && !prev.isRunning ? newBreakTime : prev.currentTime
        }));
      }
    } catch (error) {
      const newBreakTime = minutes * 60;
      setPomodoroState(prev => ({
        ...prev,
        breakTime: newBreakTime,
        currentTime: prev.mode === 'break' && !prev.isRunning ? newBreakTime : prev.currentTime
      }));
    }
  };

  return (
    <div className={`pomodoro-container ${pomodoroState.mode}-mode`}>
      <BackButton />

      <div className="pomodoro-header">
        <h2>Pomodoro Timer</h2>
      </div>
      
      <div className="pomodoro-content">
        <div className="timer-controls-section">
          <div className="timer-circle">
            <CircularProgressbar
              value={getProgress()}
              text={formatTime(pomodoroState.currentTime)}
              strokeWidth={8}
              styles={buildStyles({
                textSize: '18px',
                pathColor: pomodoroState.mode === 'work' ? '#f43f5e' : '#10b981',
                textColor: '#1e293b',
                trailColor: '#f1f5f9'
              })}
            />
          </div>
          
          <div className="controls-right">
            <div className="mode-indicator">
              {pomodoroState.mode === 'work' ? '🍅 Focus Time' : '☕ Break Time'}
            </div>
            
            <div className="controls">
              <button 
                className={`control-btn ${pomodoroState.isRunning ? 'pause' : 'play'}`}
                onClick={pomodoroState.isRunning ? handlePause : handleStart}
              >
                <FontAwesomeIcon icon={pomodoroState.isRunning ? faPause : faPlay} />
              </button>
              <button 
                className="control-btn reset"
                onClick={handleReset}
              >
                <FontAwesomeIcon icon={faRedo} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="bottom-section">
          <div className="settings">
            <div className="settings-title">Timer Settings</div>
            <div className="settings-grid">
              <div className="setting-group">
                <label>Work Time (minutes)</label>
                <input
                  type="number"
                  value={pomodoroState.workTime / 60}
                  onChange={(e) => handleWorkTimeChange(parseInt(e.target.value) || 25)}
                  min="1"
                  max="60"
                  disabled={pomodoroState.isRunning}
                />
              </div>
              <div className="setting-group">
                <label>Break Time (minutes)</label>
                <input
                  type="number"
                  value={pomodoroState.breakTime / 60}
                  onChange={(e) => handleBreakTimeChange(parseInt(e.target.value) || 5)}
                  min="1"
                  max="30"
                  disabled={pomodoroState.isRunning}
                />
              </div>
            </div>
          </div>
          
          <div className="stats">
            <div className="stats-title">Sessions Completed : </div>
            <div className="stat-item">
              <strong>{pomodoroState.completedPomodoros}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;