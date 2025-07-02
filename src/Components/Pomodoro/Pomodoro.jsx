import { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Pomodoro.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons';
import BackButton from '../BackButton/BackButton';

const Pomodoro = () => {
  const DEFAULT_WORK_TIME = 25 * 60;
  const DEFAULT_BREAK_TIME = 5 * 60;
  
  const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
  const [currentTime, setCurrentTime] = useState(DEFAULT_WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const workCompleteAudioRef = useRef(null);
  const breakCompleteAudioRef = useRef(null);

  // Load saved settings from Chrome storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
          const result = await chrome.storage.sync.get([
            'pomodoroWorkTime',
            'pomodoroBreakTime',
            'completedPomodoros'
          ]);
          
          if (result.pomodoroWorkTime) setWorkTime(result.pomodoroWorkTime);
          if (result.pomodoroBreakTime) setBreakTime(result.pomodoroBreakTime);
          if (result.completedPomodoros) setCompletedPomodoros(result.completedPomodoros);
          setCurrentTime(result.pomodoroWorkTime || DEFAULT_WORK_TIME);
        } else {
          const workTimeStored = localStorage.getItem('pomodoroWorkTime');
          const breakTimeStored = localStorage.getItem('pomodoroBreakTime');
          const completedStored = localStorage.getItem('completedPomodoros');
          
          if (workTimeStored) setWorkTime(parseInt(workTimeStored));
          if (breakTimeStored) setBreakTime(parseInt(breakTimeStored));
          if (completedStored) setCompletedPomodoros(parseInt(completedStored));
          setCurrentTime(parseInt(workTimeStored) || DEFAULT_WORK_TIME);
        }
      } catch (err) {
        console.error('Error loading Pomodoro settings:', err);
        setWorkTime(DEFAULT_WORK_TIME);
        setBreakTime(DEFAULT_BREAK_TIME);
        setCurrentTime(DEFAULT_WORK_TIME);
        setCompletedPomodoros(0);
      }
    };

    loadSettings();
  }, []);

  // Save settings to Chrome storage
  const saveSettings = (work, breakMins, pomodoros) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({
          pomodoroWorkTime: work,
          pomodoroBreakTime: breakMins,
          completedPomodoros: pomodoros
        });
      } else {
        localStorage.setItem('pomodoroWorkTime', work.toString());
        localStorage.setItem('pomodoroBreakTime', breakMins.toString());
        localStorage.setItem('completedPomodoros', pomodoros.toString());
      }
    } catch (err) {
      console.error('Error saving Pomodoro settings:', err);
    }
  };

  // Play alarm sound
  const playAlarm = (type) => {
    try {
      if (type === 'work' && workCompleteAudioRef.current) {
        workCompleteAudioRef.current.currentTime = 0;
        workCompleteAudioRef.current.play();
      } else if (type === 'break' && breakCompleteAudioRef.current) {
        breakCompleteAudioRef.current.currentTime = 0;
        breakCompleteAudioRef.current.play();
      }
    } catch (error) {
      console.log('Could not play alarm sound:', error);
    }
  };

  // Timer logic
  useEffect(() => {
    let timer = null;
    
    if (isRunning && currentTime > 0) {
      timer = setInterval(() => {
        setCurrentTime(time => time - 1);
      }, 1000);
    } else if (currentTime === 0 && isRunning) {
      if (mode === 'work') {
        playAlarm('work');
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        setMode('break');
        setCurrentTime(breakTime);
        saveSettings(workTime, breakTime, newCount);
      } else {
        playAlarm('break');
        setMode('work');
        setCurrentTime(workTime);
        saveSettings(workTime, breakTime, completedPomodoros);
      }
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, currentTime, mode, workTime, breakTime, completedPomodoros]);

  // Format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculate progress
  const getProgress = () => {
    const max = mode === 'work' ? workTime : breakTime;
    return ((max - currentTime) / max) * 100;
  };

  // Control handlers
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    setMode('work');
    setCurrentTime(workTime);
  };

  // Time change handlers
  const handleWorkTimeChange = (minutes) => {
    const newTime = minutes * 60;
    setWorkTime(newTime);
    saveSettings(newTime, breakTime, completedPomodoros);
    
    if (!isRunning && mode === 'work') {
      setCurrentTime(newTime);
    }
  };

  const handleBreakTimeChange = (minutes) => {
    const newTime = minutes * 60;
    setBreakTime(newTime);
    saveSettings(workTime, newTime, completedPomodoros);
    
    if (!isRunning && mode === 'break') {
      setCurrentTime(newTime);
    }
  };

  return (
    <div className={`pomodoro-container ${mode}-mode`}>
      <BackButton />
      <audio ref={workCompleteAudioRef} preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/1277/1277-preview.mp3" type="audio/mp3" />
      </audio>
      
      <audio ref={breakCompleteAudioRef} preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/2470/2470-preview.mp3" type="audio/mp3" />
      </audio>

      <div className="pomodoro-header">
        <h2>Pomodoro Timer</h2>
      </div>
      
      <div className="pomodoro-content">
        <div className="timer-controls-section">
          <div className="timer-circle">
            <CircularProgressbar
              value={getProgress()}
              text={formatTime(currentTime)}
              strokeWidth={8}
              styles={buildStyles({
                textSize: '18px',
                pathColor: mode === 'work' ? '#f43f5e' : '#10b981',
                textColor: '#1e293b',
                trailColor: '#f1f5f9'
              })}
            />
          </div>
          
          <div className="controls-right">
            <div className="mode-indicator">
              {mode === 'work' ? '🍅 Focus Time' : '☕ Break Time'}
            </div>
            
            <div className="controls">
              <button 
                className={`control-btn ${isRunning ? 'pause' : 'play'}`}
                onClick={isRunning ? handlePause : handleStart}
              >
                <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
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
                  value={workTime / 60}
                  onChange={(e) => handleWorkTimeChange(parseInt(e.target.value) || 25)}
                  min="1"
                  max="60"
                  disabled={isRunning}
                />
              </div>
              <div className="setting-group">
                <label>Break Time (minutes)</label>
                <input
                  type="number"
                  value={breakTime / 60}
                  onChange={(e) => handleBreakTimeChange(parseInt(e.target.value) || 5)}
                  min="1"
                  max="30"
                  disabled={isRunning}
                />
              </div>
            </div>
          </div>
          
          <div className="stats">
            <div className="stats-title">Sessions Completed : </div>
            <div className="stat-item">
              <strong>{completedPomodoros}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;