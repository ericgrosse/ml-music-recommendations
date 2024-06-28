import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [playlistId, setPlaylistId] = useState('');
  const [playlistDetails, setPlaylistDetails] = useState(null);

  const fetchPlaylistTracks = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/fetch-playlist-tracks?playlist_id=${playlistId}`);
      setPlaylistDetails(response.data.playlistDetails);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const handleFetchPlaylist = () => {
    if (playlistId) {
      fetchPlaylistTracks();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Playlist ID"
        value={playlistId}
        onChange={(e) => setPlaylistId(e.target.value)}
      />
      <button onClick={handleFetchPlaylist}>Fetch Playlist</button>

      {playlistDetails && (
        <div>
          <h2>{playlistDetails.name}</h2>
          <p>{playlistDetails.description}</p>
          <p>Owner: {playlistDetails.owner}</p>
          <ul>
            {playlistDetails.tracks.map(track => (
              <li key={track.id}>
                <div>
                  <strong>Title:</strong> {track.title}
                </div>
                <div>
                  <strong>Artist:</strong> {track.artist}
                </div>
                {track.features && (
                  <div>
                    <strong>Features:</strong>
                    <ul>
                      <li>Danceability: {track.features.danceability}</li>
                      <li>Energy: {track.features.energy}</li>
                      <li>Key: {track.features.key}</li>
                      <li>Loudness: {track.features.loudness}</li>
                      <li>Mode: {track.features.mode}</li>
                      <li>Speechiness: {track.features.speechiness}</li>
                      <li>Acousticness: {track.features.acousticness}</li>
                      <li>Instrumentalness: {track.features.instrumentalness}</li>
                      <li>Liveness: {track.features.liveness}</li>
                      <li>Valence: {track.features.valence}</li>
                      <li>Tempo: {track.features.tempo}</li>
                      <li>Duration: {track.features.duration_ms} ms</li>
                      <li>Time Signature: {track.features.time_signature}</li>
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
