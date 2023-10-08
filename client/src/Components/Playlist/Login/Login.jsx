import React, { useEffect } from 'react';
import { authenticateWithSpotify, setAccessToken } from '../Spotify';
import { useNavigate } from 'react-router-dom';
import './Login.scss'

const Login = () => {
    const history = useNavigate();

    useEffect(() => {
      const token = window.location.hash.match(/access_token=([^&]+)/)?.[1];
      
      if (token) {
        // If a token is present in the URL, set it and redirect to the playlist page
        setAccessToken(token);
        history.push('/playlist');
      }
    }, [history]);
  
    return (
      <div>
        <h2>Spotify Playlist Player</h2>
        <button onClick={authenticateWithSpotify}>Log in with Spotify</button>
      </div>
    );
}

export default Login
