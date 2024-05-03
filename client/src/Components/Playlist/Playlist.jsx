import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import ReactPlayer from 'react-player';
import './Playlist.scss'; // Import SCSS file for styling

const spotifyApi = new SpotifyWebApi();

const Playlist = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSource, setCurrentSource] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlistURL, setPlaylistURL] = useState('');
  const [currentTrackThumbnail, setCurrentTrackThumbnail] = useState('');

  // Function to fetch Spotify access token
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

  // useEffect to fetch access token and set interval for refreshing token
  useEffect(() => {
    fetchAccessToken(); 
    const intervalId = setInterval(fetchAccessToken, 3600);
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle play/pause button click
  const handlePlayPause = () => setIsPlaying(prevIsPlaying => !prevIsPlaying);

  // Function to set current source and start playing
  const handleSetSource = source => {
    setCurrentSource(source);
    setIsPlaying(true);
  };

  // Function to handle playlist URL change
  const handlePlaylistUrlChange = event => {
    const url = event.target.value;
    setPlaylistURL(url);
    if (url.includes('open.spotify.com')) {
      const playlistId = url.split('/playlist/')[1].split('?')[0];
      spotifyApi.getPlaylistTracks(playlistId).then(response => {
        const tracks = response.items.map(item => item.track);
        setPlaylistTracks(tracks);
        setCurrentTrackIndex(0);
        const firstTrack = tracks[0];
        const trackUri = firstTrack.preview_url;
        setCurrentTrackThumbnail(firstTrack.album.images[0].url); // Set the thumbnail of the first track
        handleSetSource(trackUri);
      }).catch(error => {
        console.error('Error fetching Spotify playlist:', error);
        setCurrentSource('');
        setIsPlaying(false);
      });
    } else if (url.includes('youtube.com')) {
      handleSetSource(url);
    } else {
      console.log('Invalid playlist URL');
    }
  };

  // Function to play the next track in the playlist
  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlistTracks.length;
    setCurrentTrackIndex(nextIndex);
    const nextTrack = playlistTracks[nextIndex];
    const trackUri = nextTrack.preview_url;
    setCurrentTrackThumbnail(nextTrack.album.images[0].url); // Set the thumbnail of the next track
    handleSetSource(trackUri);
  };

  return (
    <div className="playlist-container">
      <h1>Custom Playlist Player</h1>
      <div className="playlist-input">
        <input type="text" placeholder="Enter Spotify or YouTube Playlist URL" value={playlistURL} onChange={handlePlaylistUrlChange} />
      </div>
      <div className="track-thumbnail">
        {currentTrackThumbnail && <img src={currentTrackThumbnail} alt="Current Track Thumbnail" />}
      </div>
      <div className="player-wrapper">
        <div className="react-player-wrapper">
          <ReactPlayer url={currentSource} playing={isPlaying} controls width="100%" height="100%" />
        </div>
      </div>
      <div className="controls">
        <button className="play-pause-btn" onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        {playlistTracks.length > 0 && (
          <button className="next-track-btn" onClick={handleNextTrack}>
            Next Track
          </button>
        )}
      </div>
    </div>
  );
};

export default Playlist;
