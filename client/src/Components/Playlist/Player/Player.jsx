import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylist, setAccessToken } from '../Spotify';
import './Playlist.scss';

const Player = () => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const token = window.location.hash.match(/access_token=([^&]+)/)[1];
        setAccessToken(token);

        getPlaylist(playlistId)
            .then((response) => setPlaylist(response))
            .catch((error) => console.error(error));
    }, [playlistId]);
    if (!playlist) {
        return <div>Loading</div>;
    }

    return (
        <div>
            <h2>Playlist: {playlist.name}</h2>
            {/* Render playlist tracks here */}
        </div>
    );
}

export default Player