import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [playlistId, setPlaylistId] = useState('');
  const [playlistDetails, setPlaylistDetails] = useState(null);

  const handleFetchPlaylist = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/fetch-playlist-tracks?playlist_id=${playlistId}`);
      setPlaylistDetails(response.data.playlistDetails);
    } catch (error) {
      console.error('Error fetching playlist:', error);
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
                {track.title} by {track.artist}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
