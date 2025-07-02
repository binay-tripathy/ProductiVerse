import { useState, useEffect, useRef } from 'react';
import './Music.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPause, 
  faVolumeHigh, 
  faVolumeOff,
  faHeadphones
} from '@fortawesome/free-solid-svg-icons';
import { getMultipleFromStorage, saveMultipleToStorage } from '../../utils/chromeAPI';
import BackButton from '../BackButton/BackButton';

const AMBIENT_SOUNDS = [
  {
    id: 'rain',
    name: 'Rain',
    description: 'Gentle rainfall',
    iconColor: '#4285f4',
    audioUrl: 'https://www.soundjay.com/nature/sounds/rain-07.mp3'
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Birds chirping',
    iconColor: '#0f9d58',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/1210/1210-preview.mp3'
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    description: 'Crackling fire',
    iconColor: '#ea4335',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/1736/1736-preview.mp3'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Peaceful ambient',
    iconColor: '#795548',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2452/2452-preview.mp3'
  },
  {
    id: 'night',
    name: 'Night Sounds',
    description: 'Crickets & nature',
    iconColor: '#9c27b0',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/1782/1782-preview.mp3'
  },
  {
    id: 'waves',
    name: 'Ocean',
    description: 'Gentle waves',
    iconColor: '#03a9f4',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/1196/1196-preview.mp3'
  }
];

const Music = () => {
  const [currentSound, setCurrentSound] = useState(null);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const result = await getMultipleFromStorage(['ambientSettings']);
        
        if (result.ambientSettings) {
          if (result.ambientSettings.currentSound) {
            setCurrentSound(result.ambientSettings.currentSound);
          }
          setMasterVolume(result.ambientSettings.masterVolume || 0.7);
          setMuted(result.ambientSettings.muted || false);
        }
      } catch (error) {
        console.error("Error loading audio settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (currentSound) {
      const soundData = AMBIENT_SOUNDS.find(s => s.id === currentSound);
      if (soundData) {
        audioRef.current.src = soundData.audioUrl;
        audioRef.current.volume = muted ? 0 : masterVolume;
        audioRef.current.loop = true;
        
        const handleCanPlay = () => {
          audioRef.current.play()
            .then(() => {
              setAudioLoaded(true);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
              setAudioLoaded(false);
            });
        };
        
        const handleError = (error) => {
          console.error("Audio playback error:", error);
          setAudioLoaded(false);
        };
        
        audioRef.current.addEventListener('canplaythrough', handleCanPlay);
        audioRef.current.addEventListener('error', handleError);
        
        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
            audioRef.current.removeEventListener('error', handleError);
          }
        };
      }
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
  }, [currentSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : masterVolume;
    }
  }, [masterVolume, muted]);

  const saveSettings = async () => {
    try {
      await saveMultipleToStorage({
        ambientSettings: {
          currentSound,
          masterVolume,
          muted
        }
      });
    } catch (error) {
      console.error("Error saving audio settings:", error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [currentSound, masterVolume, muted]);

  const playSound = (soundId) => {
    if (currentSound === soundId) {
      setCurrentSound(null);
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      setCurrentSound(soundId);
      setAudioLoaded(false);
    }
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="ambient-container loading">
        <BackButton />
        <div className="spinner"></div>
        <span>Loading sounds...</span>
      </div>
    );
  }

  return (
    <div className="ambient-container">
      <BackButton />
      <div className="music-header">
        <h2>Focus Sounds</h2>
      </div>
      
      <div className="music-content">
        <audio ref={audioRef} />
        
        <div className="main-controls">
          <div className="volume-control">
            <button 
              className="volume-toggle" 
              onClick={toggleMute}
            >
              <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeHigh} />
            </button>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
        
        <div className="sound-grid">
          {AMBIENT_SOUNDS.map(sound => (
            <div 
              key={sound.id}
              className={`sound-card ${currentSound === sound.id ? 'active' : ''}`}
              onClick={() => playSound(sound.id)}
            >
              <div 
                className="sound-icon"
                style={{ backgroundColor: sound.iconColor }}
              >
                <FontAwesomeIcon icon={currentSound === sound.id ? faPause : faHeadphones} />
              </div>
              <div className="sound-info">
                <h3>{sound.name}</h3>
                <p>{sound.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {currentSound && (
          <div className="now-playing">
            <span>Now playing:</span>
            <strong>{AMBIENT_SOUNDS.find(s => s.id === currentSound)?.name}</strong>
            {!audioLoaded && <span className="loading-indicator">Loading...</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Music;