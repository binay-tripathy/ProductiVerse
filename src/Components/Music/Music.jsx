import { useState, useEffect, useRef } from 'react';
import './Music.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPause, 
  faVolumeHigh, 
  faVolumeOff,
  faHeadphones
} from '@fortawesome/free-solid-svg-icons';
import BackButton from '../BackButton/BackButton';
import { sendRuntimeMessage, connectToBackground } from '../../utils/chromeAPI';

const AMBIENT_SOUNDS = [
  {
    id: 'rain',
    name: 'Rain',
    description: 'Gentle rainfall',
    iconColor: '#4285f4'
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Birds chirping',
    iconColor: '#0f9d58'
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    description: 'Crackling fire',
    iconColor: '#ea4335'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Peaceful ambient',
    iconColor: '#795548'
  },
  {
    id: 'night',
    name: 'Night Sounds',
    description: 'Crickets & nature',
    iconColor: '#9c27b0'
  },
  {
    id: 'waves',
    name: 'Ocean',
    description: 'Gentle waves',
    iconColor: '#03a9f4'
  }
];

const Music = () => {
  const [musicState, setMusicState] = useState({
    currentSound: null,
    masterVolume: 0.7,
    muted: false,
    isPlaying: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const volumeTimeoutRef = useRef(null);

  const syncMusicState = async () => {
    try {
      const response = await sendRuntimeMessage({ type: 'GET_MUSIC_STATE' });
      if (response?.success !== false) {
        setMusicState(response);
      }
    } catch (error) {
      console.error("Error syncing music state:", error);
    }
  };

  useEffect(() => {
    const loadState = async () => {
      await syncMusicState();
      setIsLoading(false);
    };
    loadState();

    const port = connectToBackground();
    return () => port?.disconnect();
  }, []);

  const playSound = async (soundId) => {
    if (pending) return;
    setPending(true);
    
    try {
      if (musicState.currentSound === soundId && musicState.isPlaying) {
        await sendRuntimeMessage({ type: 'STOP_SOUND' });
      } else {
        await sendRuntimeMessage({ 
          type: 'PLAY_SOUND', 
          payload: { soundId } 
        });
      }
      await syncMusicState();
    } catch (error) {
      console.error('Error controlling sound:', error);
    } finally {
      setPending(false);
    }
  };

  const handleVolumeChange = (volume) => {
    setMusicState(prev => ({ ...prev, masterVolume: volume }));
    
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    
    volumeTimeoutRef.current = setTimeout(async () => {
      try {
        await sendRuntimeMessage({ 
          type: 'UPDATE_VOLUME', 
          payload: { volume } 
        });
      } catch (error) {
        console.error('Error updating volume:', error);
        await syncMusicState();
      }
    }, 300);
  };

  const toggleMute = async () => {
    if (pending) return;
    setPending(true);
    
    try {
      await sendRuntimeMessage({ type: 'TOGGLE_MUTE' });
      await syncMusicState();
    } catch (error) {
      console.error('Error toggling mute:', error);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

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
        <div className="main-controls">
          <div className="volume-control">
            <button 
              className="volume-toggle" 
              onClick={toggleMute}
              disabled={pending}
            >
              <FontAwesomeIcon icon={musicState.muted ? faVolumeOff : faVolumeHigh} />
            </button>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={musicState.masterVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
        
        <div className="sound-grid">
          {AMBIENT_SOUNDS.map(sound => (
            <div 
              key={sound.id}
              className={`sound-card ${
                musicState.currentSound === sound.id && musicState.isPlaying ? 'active' : ''
              } ${pending ? 'disabled' : ''}`}
              onClick={() => !pending && playSound(sound.id)}
            >
              <div 
                className="sound-icon"
                style={{ backgroundColor: sound.iconColor }}
              >
                <FontAwesomeIcon 
                  icon={musicState.currentSound === sound.id && musicState.isPlaying ? faPause : faHeadphones} 
                />
              </div>
              <div className="sound-info">
                <h3>{sound.name}</h3>
                <p>{sound.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {musicState.currentSound && musicState.isPlaying && (
          <div className="now-playing">
            <span>Now playing:</span>
            <strong>{AMBIENT_SOUNDS.find(s => s.id === musicState.currentSound)?.name}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default Music;