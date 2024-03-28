import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import ReactPlayer from 'react-player';

const spotifyApi = new SpotifyWebApi();

const Playlist = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSource, setCurrentSource] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const fetchAccessToken = async () => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&client_id=58cb66cc37d14bcfa0bf8aba4658a435&client_secret=91459c94932c4f67a0c1f02af5247f59"
      });
      const data = await response.json();
      spotifyApi.setAccessToken(data.access_token);
    }
    catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  useEffect(() => {
    fetchAccessToken(); 
    const intervalId = setInterval(fetchAccessToken, 3600);
    return () => clearInterval(intervalId);
  }, []);

  const handlePlayPause = () => setIsPlaying(prevIsPlaying => !prevIsPlaying);

  const handleSetSource = source => {
    setCurrentSource(source);
    setIsPlaying(true);
  };

  const handlePlaylistUrlChange = event => {
    const url = event.target.value;
    if (url.includes('open.spotify.com')) {
      const playlistId = url.split('/playlist/')[1].split('?')[0];
      spotifyApi.getPlaylistTracks(playlistId).then(response => {
        const tracks = response.items.map(item => item.track);
        setPlaylistTracks(tracks);
        setCurrentTrackIndex(0);
        const firstTrack = tracks[0];
        const trackUri = firstTrack.preview_url;
        handleSetSource(trackUri);
      }).catch(error => {
        console.error('Error fetching Spotify playlist:', error);
        setCurrentSource('');
        setIsPlaying(false);
      });
    }
    else if (url.includes('youtube.com'))
      handleSetSource(url);
    else
      console.log('Invalid playlist URL');
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlistTracks.length;
    setCurrentTrackIndex(nextIndex);
    const nextTrack = playlistTracks[nextIndex];
    const trackUri = nextTrack.preview_url;
    handleSetSource(trackUri);
  };

  return (
    <div>
      <h3>Custom Audio Player</h3>
      <form>
        <label htmlFor="playlist-url">Enter Spotify or YouTube Playlist URL:</label>
        <input type="text" id="playlist-url" onChange={handlePlaylistUrlChange} />
      </form>
      <ReactPlayer url={currentSource} playing={isPlaying} controls width="100%" height="50px" />
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      {playlistTracks.length > 0 && (
        <button onClick={handleNextTrack}>
          Next Track
        </button>
      )}
    </div>
  );
};

export default Playlist;
