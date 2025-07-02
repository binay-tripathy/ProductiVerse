import { useState, useEffect } from 'react';
import './WebBlocker.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import BackButton from '../BackButton/BackButton';

const WebBlocker = () => {
  const [blockedSites, setBlockedSites] = useState([]);
  const [siteToAdd, setSiteToAdd] = useState('');
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load data from Chrome storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Check if Chrome extension APIs are available
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
          const result = await chrome.storage.sync.get(['blockedSites', 'isBlockingEnabled']);
          
          setBlockedSites(result.blockedSites || []);
          setIsBlockingEnabled(result.isBlockingEnabled ?? false);
          
          // Update blocking rules on load
          updateBlockingRules(result.blockedSites || [], result.isBlockingEnabled ?? false);
        } else {
          // Fallback to localStorage
          const blockedSitesStored = localStorage.getItem('blockedSites');
          const isBlockingEnabledStored = localStorage.getItem('isBlockingEnabled');
          
          setBlockedSites(blockedSitesStored ? JSON.parse(blockedSitesStored) : []);
          setIsBlockingEnabled(isBlockingEnabledStored ? JSON.parse(isBlockingEnabledStored) : false);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
        // Set defaults if loading fails
        setBlockedSites([]);
        setIsBlockingEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update Chrome's blocking rules
  const updateBlockingRules = async (sites, enabled) => {
    try {
      // Only update rules if Chrome extension APIs are available
      if (typeof chrome !== 'undefined' && chrome.declarativeNetRequest) {
        // Remove existing rules
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const ruleIds = currentRules.map(rule => rule.id);
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: ruleIds
        });

        // Add new rules if blocking is enabled
        if (enabled && sites.length > 0) {
          const rules = sites.map((site, index) => ({
            id: index + 1,
            priority: 1,
            action: {
              type: 'redirect',
              redirect: {
                extensionPath: '/blocked.html'
              }
            },
            condition: {
              urlFilter: `||${site}`,
              resourceTypes: ['main_frame']
            }
          }));

          await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: rules
          });
        }
      }
    } catch (err) {
      console.error('Error updating blocking rules:', err);
      setError('Failed to update blocking rules');
    }
  };

  // Save settings to Chrome storage and update rules
  const saveSettings = async (sites, enabled) => {
    try {
      // Check if Chrome extension APIs are available
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        await chrome.storage.sync.set({
          blockedSites: sites,
          isBlockingEnabled: enabled
        });
      } else {
        // Fallback to localStorage
        localStorage.setItem('blockedSites', JSON.stringify(sites));
        localStorage.setItem('isBlockingEnabled', JSON.stringify(enabled));
      }

      await updateBlockingRules(sites, enabled);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    }
  };

  // Validate and normalize domain
  const normalizeDomain = (input) => {
    let domain = input.trim().toLowerCase();
    
    // Remove protocol and www
    domain = domain.replace(/(^\w+:|^)\/\/(www\.)?/, '');
    
    // Remove paths and parameters
    domain = domain.split('/')[0];
    
    const domainRegex = /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setError('Invalid domain format. Use: example.com');
      return null;
    }
    
    return domain;
  };

  const handleAddSite = () => {
    if (!siteToAdd.trim()) return;
    
    const normalizedDomain = normalizeDomain(siteToAdd);
    if (!normalizedDomain) return;
    
    if (blockedSites.includes(normalizedDomain)) {
      setError('Domain already blocked');
      return;
    }
    
    const updatedSites = [...blockedSites, normalizedDomain];
    setBlockedSites(updatedSites);
    setSiteToAdd('');
    setError('');
    saveSettings(updatedSites, isBlockingEnabled);
  };

  const handleRemoveSite = (site) => {
    const updatedSites = blockedSites.filter(s => s !== site);
    setBlockedSites(updatedSites);
    saveSettings(updatedSites, isBlockingEnabled);
  };

  const handleToggleBlocking = () => {
    const newState = !isBlockingEnabled;
    setIsBlockingEnabled(newState);
    saveSettings(blockedSites, newState);
  };

  if (isLoading) {
    return <div className="web-blocker-container loading">Loading...</div>;
  }

  return (
    <div className="web-blocker-container">
      <BackButton />
      <div className="blocker-header">
        <h2>Website Blocker</h2>
      </div>
      
      <div className="blocker-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="blocker-controls">
          <button 
            className={`toggle-btn ${isBlockingEnabled ? 'enabled' : 'disabled'}`}
            onClick={handleToggleBlocking}
          >
            <FontAwesomeIcon icon={isBlockingEnabled ? faToggleOn : faToggleOff} />
            {isBlockingEnabled ? 'Blocking Enabled' : 'Blocking Disabled'}
          </button>
        </div>

        <div className="site-input">
          <input 
            type="text" 
            placeholder="Enter domain to block (e.g., facebook.com)"
            value={siteToAdd}
            onChange={(e) => {
              setSiteToAdd(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
          />
          <button onClick={handleAddSite}>
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
        </div>

        <div className="blocked-sites-list">
          <h3>Blocked Sites ({blockedSites.length})</h3>
          {blockedSites.length === 0 ? (
            <p className="empty-state">No sites blocked yet</p>
          ) : (
            <ul>
              {blockedSites.map((site, index) => (
                <li key={index} className="blocked-site-item">
                  <span className="site-name">{site}</span>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveSite(site)}
                    title="Remove site"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebBlocker;