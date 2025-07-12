console.log('Offscreen audio script loaded');

let currentAudio = null;
let currentSoundId = null;

const soundUrls = {
  rain: 'https://www.soundjay.com/nature/sounds/rain-07.mp3',
  forest: 'https://assets.mixkit.co/active_storage/sfx/1210/1210-preview.mp3',
  fireplace: 'https://assets.mixkit.co/active_storage/sfx/1736/1736-preview.mp3',
  meditation: 'https://assets.mixkit.co/active_storage/sfx/2452/2452-preview.mp3',
  night: 'https://assets.mixkit.co/active_storage/sfx/1782/1782-preview.mp3',
  waves: 'https://assets.mixkit.co/active_storage/sfx/1196/1196-preview.mp3'
};

async function loadAudio(soundId) {
  const url = soundUrls[soundId];
  if (!url) {
    throw new Error(`No URL for sound: ${soundId}`);
  }

  const audio = new Audio(url);
  audio.crossOrigin = 'anonymous';
  audio.loop = true;
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Audio load timeout'));
    }, 8000);

    audio.addEventListener('canplaythrough', () => {
      clearTimeout(timeout);
      resolve(audio);
    }, { once: true });

    audio.addEventListener('error', () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load: ${soundId}`));
    }, { once: true });

    audio.load();
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  switch (type) {
    case 'PLAY_MUSIC':
      playMusic(payload.soundId, payload.volume)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    case 'STOP_MUSIC':
      stopMusic();
      sendResponse({ success: true });
      break;
    case 'UPDATE_AUDIO_VOLUME':
      updateVolume(payload.volume);
      sendResponse({ success: true });
      break;
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

async function playMusic(soundId, volume = 0.7) {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    currentAudio = await loadAudio(soundId);
    currentSoundId = soundId;
    currentAudio.volume = Math.max(0, Math.min(1, volume));
    await currentAudio.play();
    console.log(`Playing: ${soundId}`);
  } catch (error) {
    console.error(`Failed to play ${soundId}:`, error);
    throw error;
  }
}

function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    currentSoundId = null;
    console.log('Audio stopped');
  }
}

function updateVolume(volume) {
  if (currentAudio) {
    currentAudio.volume = Math.max(0, Math.min(1, volume));
  }
}

window.addEventListener('beforeunload', stopMusic);