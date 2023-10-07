import React, { useState } from 'react';
import './WebBlocker.scss'

const WebBlocker = () => {

  const [blockedSites, setBlockedSites] = useState([]);
  const [siteToAdd, setSiteToAdd] = useState('');

  const handleAddSite = () => {
    setBlockedSites([...blockedSites, siteToAdd]);
    setSiteToAdd('');
  };

  const handleRemoveSite = (site) => {
    const updatedSites = blockedSites.filter((s) => s !== site);
    setBlockedSites(updatedSites);
  };

  return (
    <div>
      <h1>Social Media Blocker</h1>
      <input
        type="text"
        placeholder="Enter a social media site (e.g., facebook.com)"
        value={siteToAdd}
        onChange={(e) => setSiteToAdd(e.target.value)}
      />
      <button onClick={handleAddSite}>Add Site</button>
      <ul>
        {blockedSites.map((site) => (
          <li key={site}>
            {site} <button onClick={() => handleRemoveSite(site)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );

}

export default WebBlocker

