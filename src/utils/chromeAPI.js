/**
 * Utility functions for interacting with Chrome extension APIs
 * that work safely in both extension and development environments
 */

export const isChromeExtension = () => {
  return typeof window !== 'undefined' && 
         window.chrome && 
         window.chrome.storage && 
         window.chrome.runtime;
};

export const saveToStorage = (key, value) => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      window.chrome.storage.sync.set({ [key]: value }, () => resolve(true));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(true);
    }
  });
};

export const getFromStorage = (key, defaultValue = null) => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      window.chrome.storage.sync.get([key], (result) => {
        resolve(result[key] !== undefined ? result[key] : defaultValue);
      });
    } else {
      const value = localStorage.getItem(key);
      resolve(value !== null ? JSON.parse(value) : defaultValue);
    }
  });
};

export const saveMultipleToStorage = (items) => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      window.chrome.storage.sync.set(items, () => resolve(true));
    } else {
      Object.keys(items).forEach(key => {
        localStorage.setItem(key, JSON.stringify(items[key]));
      });
      resolve(true);
    }
  });
};

export const getMultipleFromStorage = (keys) => {
  return new Promise((resolve) => {
    if (isChromeExtension()) {
      window.chrome.storage.sync.get(keys, (result) => {
        resolve(result);
      });
    } else {
      const result = {};
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch (e) {
            result[key] = value;
          }
        }
      });
      resolve(result);
    }
  });
};

export const sendRuntimeMessage = (message) => {
  return new Promise((resolve, reject) => {
    if (isChromeExtension()) {
      try {
        window.chrome.runtime.sendMessage(message, (response) => {
          const runtimeError = window.chrome.runtime.lastError;
          if (runtimeError) {
            console.warn('Chrome runtime error:', runtimeError.message);
            resolve({ success: false, error: runtimeError.message });
          } else {
            resolve(response || { success: true });
          }
        });
      } catch (error) {
        console.error('Error sending chrome message:', error);
        resolve({ success: false, error: error.message });
      }
    } else {
      console.log('Chrome runtime not available, message would be:', message);
      
      // Simulate storage operations for development environment
      if (message.action === 'updateBlockedSites') {
        localStorage.setItem('blockedSites', JSON.stringify(message.sites));
        localStorage.setItem('isBlockingEnabled', JSON.stringify(message.enabled));
        localStorage.setItem('workStartTime', message.startTime);
        localStorage.setItem('workEndTime', message.endTime);
        console.log('Website blocking settings saved to localStorage (development mode)');
      }
      
      resolve({ success: false, development: true });
    }
  });
}
