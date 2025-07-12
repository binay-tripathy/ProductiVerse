let pomodoroState = {
  workTime: 25 * 60,
  breakTime: 5 * 60,
  currentTime: 25 * 60,
  isRunning: false,
  mode: 'work',
  completedPomodoros: 0,
  timerId: null
};

let musicState = {
  currentSound: null,
  masterVolume: 0.7,
  muted: false,
  isPlaying: false
};

let keepAliveInterval;

setInterval(() => {
  chrome.storage.local.set({ lastActivity: Date.now() });
  chrome.alarms.create('keepAlive', { delayInMinutes: 0.1 });
}, 15000);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('Service worker keep-alive ping');
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get([
    'pomodoroWorkTime',
    'pomodoroBreakTime',
    'completedPomodoros',
    'pomodoroState',
    'ambientSettings'
  ]).then((result) => {
    applySettings(result);
  }).catch(() => {
    chrome.storage.local.get([
      'pomodoroWorkTime',
      'pomodoroBreakTime',
      'completedPomodoros',
      'pomodoroState',
      'ambientSettings'
    ]).then((result) => {
      applySettings(result);
    });
  });
});

function applySettings(result) {
  if (result.pomodoroWorkTime) pomodoroState.workTime = result.pomodoroWorkTime;
  if (result.pomodoroBreakTime) pomodoroState.breakTime = result.pomodoroBreakTime;
  if (result.completedPomodoros) pomodoroState.completedPomodoros = result.completedPomodoros;
  if (result.pomodoroState) pomodoroState = { ...pomodoroState, ...result.pomodoroState };
  else pomodoroState.currentTime = pomodoroState.workTime;
  if (result.ambientSettings) musicState = { ...musicState, ...result.ambientSettings };
  if (pomodoroState.isRunning) startPomodoroTimer();
}

let saveTimeout;
function saveSettings(immediate = false) {
  const settingsToSave = {
    pomodoroWorkTime: pomodoroState.workTime,
    pomodoroBreakTime: pomodoroState.breakTime,
    completedPomodoros: pomodoroState.completedPomodoros,
    pomodoroState: pomodoroState,
    ambientSettings: musicState
  };

  if (immediate) {
    if (saveTimeout) clearTimeout(saveTimeout);
    chrome.storage.local.set(settingsToSave);
    chrome.storage.sync.set(settingsToSave).catch(() => {
      console.warn('Sync storage unavailable, using local storage');
    });
    return;
  }

  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    chrome.storage.local.set(settingsToSave);
    chrome.storage.sync.set(settingsToSave).catch(() => {
      console.warn('Sync storage unavailable, using local storage');
    });
  }, 1000);
}

function safeSendRuntimeMessage(message) {
  chrome.runtime.getContexts?.({
    contextTypes: ['POPUP', 'SIDE_PANEL', 'TAB']
  }).then(contexts => {
    if (contexts && contexts.length > 0) {
      chrome.runtime.sendMessage(message).catch(error => {
        console.debug('Message send failed (receiver disconnected):', error.message);
      });
    }
  }).catch(() => {
    chrome.runtime.sendMessage(message).catch(error => {
      console.debug('Message send failed (receiver disconnected):', error.message);
    });
  });
}

function startPomodoroTimer() {
  if (pomodoroState.timerId) clearInterval(pomodoroState.timerId);
  pomodoroState.timerId = setInterval(() => {
    if (pomodoroState.currentTime > 0) {
      pomodoroState.currentTime--;
      saveSettings();
      safeSendRuntimeMessage({ type: 'POMODORO_TICK', payload: pomodoroState });
    } else {
      if (pomodoroState.mode === 'work') {
        pomodoroState.completedPomodoros++;
        pomodoroState.mode = 'break';
        pomodoroState.currentTime = pomodoroState.breakTime;
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/favicon-32x32.png',
          title: 'Work Session Complete!',
          message: 'Time for a break. Great job! 🎉'
        });
      } else {
        pomodoroState.mode = 'work';
        pomodoroState.currentTime = pomodoroState.workTime;
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/favicon-32x32.png',
          title: 'Break Time Over!',
          message: 'Ready to focus again? 🍅'
        });
      }
      saveSettings();
      safeSendRuntimeMessage({ type: 'POMODORO_MODE_CHANGE', payload: pomodoroState });
    }
  }, 1000);
}

function stopPomodoroTimer() {
  if (pomodoroState.timerId) {
    clearInterval(pomodoroState.timerId);
    pomodoroState.timerId = null;
  }
}

async function ensureOffscreen() {
  if (!chrome.offscreen) return;
  try {
    const contexts = await chrome.runtime.getContexts?.({ 
      contextTypes: ['OFFSCREEN_DOCUMENT'] 
    }) || [];
    if (contexts.length === 0) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play ambient sounds for focus'
      });
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error('Failed to ensure offscreen document:', error);
    throw error;
  }
}

async function sendToOffscreen(message) {
  await ensureOffscreen();
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, response => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

let lastMusicCommandTime = 0;
const MUSIC_COMMAND_DEBOUNCE_MS = 250;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  if (type === 'PING') {
    sendResponse({ success: true, timestamp: Date.now() });
    return;
  }

  if (['PLAY_SOUND', 'STOP_SOUND', 'UPDATE_VOLUME', 'TOGGLE_MUTE'].includes(type)) {
    (async () => {
      const now = Date.now();
      if (now - lastMusicCommandTime < MUSIC_COMMAND_DEBOUNCE_MS) {
        sendResponse({ success: false, error: 'Music command too fast' });
        return;
      }
      lastMusicCommandTime = now;

      try {
        switch (type) {
          case 'PLAY_SOUND':
            if (musicState.isPlaying && musicState.currentSound === payload.soundId) {
              sendResponse({ success: true, ...musicState });
              return;
            }
            musicState.currentSound = payload.soundId;
            musicState.isPlaying = true;
            saveSettings();
            await sendToOffscreen({
              type: 'PLAY_MUSIC',
              payload: {
                soundId: payload.soundId,
                volume: musicState.muted ? 0 : musicState.masterVolume
              }
            });
            break;
          case 'STOP_SOUND':
            if (!musicState.isPlaying) {
              sendResponse({ success: true, ...musicState });
              return;
            }
            musicState.currentSound = null;
            musicState.isPlaying = false;
            saveSettings();
            await sendToOffscreen({ type: 'STOP_MUSIC' });
            break;
          case 'UPDATE_VOLUME':
            if (musicState.masterVolume !== payload.volume) {
              musicState.masterVolume = payload.volume;
              saveSettings();
              await sendToOffscreen({
                type: 'UPDATE_AUDIO_VOLUME',
                payload: { volume: musicState.muted ? 0 : payload.volume }
              });
            }
            break;
          case 'TOGGLE_MUTE':
            musicState.muted = !musicState.muted;
            saveSettings();
            await sendToOffscreen({
              type: 'UPDATE_AUDIO_VOLUME',
              payload: { volume: musicState.muted ? 0 : musicState.masterVolume }
            });
            break;
        }
        sendResponse({ success: true, ...musicState });
      } catch (error) {
        console.error(`Error handling ${type}:`, error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  switch (type) {
    case 'GET_POMODORO_STATE':
      sendResponse(pomodoroState);
      break;
    case 'START_POMODORO':
      pomodoroState.isRunning = true;
      startPomodoroTimer();
      saveSettings(true);
      sendResponse({ success: true });
      break;
    case 'PAUSE_POMODORO':
      pomodoroState.isRunning = false;
      stopPomodoroTimer();
      saveSettings(true);
      sendResponse({ success: true });
      break;
    case 'RESET_POMODORO':
      pomodoroState.isRunning = false;
      pomodoroState.mode = 'work';
      pomodoroState.currentTime = pomodoroState.workTime;
      stopPomodoroTimer();
      saveSettings(true);
      sendResponse({ success: true });
      break;
    case 'UPDATE_WORK_TIME':
      pomodoroState.workTime = payload.minutes * 60;
      if (!pomodoroState.isRunning && pomodoroState.mode === 'work') {
        pomodoroState.currentTime = pomodoroState.workTime;
      }
      saveSettings(true);
      sendResponse({ success: true });
      break;
    case 'UPDATE_BREAK_TIME':
      pomodoroState.breakTime = payload.minutes * 60;
      if (!pomodoroState.isRunning && pomodoroState.mode === 'break') {
        pomodoroState.currentTime = pomodoroState.breakTime;
      }
      saveSettings(true);
      sendResponse({ success: true });
      break;
    case 'GET_MUSIC_STATE':
      sendResponse(musicState);
      break;
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
  return true;
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup-keepalive') {
    port.onDisconnect.addListener(() => {
      console.log('Popup disconnected');
    });
  }
});

chrome.runtime.onSuspend.addListener(() => {
  if (pomodoroState.timerId) clearInterval(pomodoroState.timerId);
  if (saveTimeout) clearTimeout(saveTimeout);
  saveSettings(true);
});

self.addEventListener('unhandledrejection', (event) => {
  if (!event.reason?.message?.includes('Could not establish connection') && 
      !event.reason?.message?.includes('MAX_WRITE_OPERATIONS_PER_MINUTE')) {
    console.error('Unhandled promise rejection:', event.reason);
  }
  event.preventDefault();
});