export const isChromeExtension = () => {
  return typeof window !== 'undefined' &&
    typeof window.chrome !== 'undefined' &&
    window.chrome.runtime &&
    typeof window.chrome.runtime.id !== 'undefined';
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

export const sendRuntimeMessage = async (message, retries = 3) => {
  if (!isChromeExtension()) {
    return { success: false, error: 'Not in Chrome extension environment' };
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (!chrome.runtime?.id) {
        throw new Error('Extension runtime not available');
      }
      const response = await chrome.runtime.sendMessage(message);
      if (chrome.runtime.lastError) {
        const error = chrome.runtime.lastError.message;
        if (error.includes('Could not establish connection') || 
            error.includes('Receiving end does not exist')) {
          throw new Error(error);
        }
        throw new Error(error);
      }
      return response;
    } catch (error) {
      if (error.message.includes('Could not establish connection') || 
          error.message.includes('Receiving end does not exist')) {
        if (attempt === retries - 1) {
          return { success: true };
        }
      } else {
        console.warn(`Runtime message attempt ${attempt + 1} failed:`, error.message);
      }
      if (attempt === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
};

export const connectToBackground = () => {
  if (isChromeExtension()) {
    try {
      const port = window.chrome.runtime.connect({ name: 'popup-keepalive' });
      return port;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const checkBackgroundConnection = async () => {
  if (!isChromeExtension()) {
    return false;
  }
  try {
    const response = await chrome.runtime.sendMessage({ type: 'PING' });
    return response && response.success;
  } catch (error) {
    return false;
  }
};