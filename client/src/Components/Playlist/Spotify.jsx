import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
const clientId = '58cb66cc37d14bcfa0bf8aba4658a435'; //client id
const redirectUri = 'http://localhost:3000/#/playlist'; // URI update as per domain

export const authenticateWithSpotify = () => {
  window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user-library-read user-read-private playlist-read-private`;
};

export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
};

export const getPlaylist = async (playlistId) => {
  try {
    const response = await spotifyApi.getPlaylist(playlistId);
    return response;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};
