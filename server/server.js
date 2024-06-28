require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
const app = express();
const port = 8888;

const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

app.use(cors());

// Function to get access token using client credentials flow
const getAccessToken = async () => {
  const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
    grant_type: 'client_credentials'
  }), {
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data.access_token;
};

// Function to fetch track features
const fetchTrackFeatures = async (trackId, accessToken) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching track features:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Route to fetch playlist tracks with features
app.get('/fetch-playlist-tracks', async (req, res) => {
  const playlistId = req.query.playlist_id;

  if (!playlistId) {
    return res.status(400).send('Playlist ID is required');
  }

  try {
    const accessToken = await getAccessToken();

    // Fetch playlist tracks
    const playlistTracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Fetch track features for each track in the playlist
    const playlistTracks = await Promise.all(playlistTracksResponse.data.items.map(async (item) => {
      const trackId = item.track.id;
      const features = await fetchTrackFeatures(trackId, accessToken);
      return {
        id: trackId,
        title: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        features: features ? {
          danceability: features.danceability,
          energy: features.energy,
          key: features.key,
          loudness: features.loudness,
          mode: features.mode,
          speechiness: features.speechiness,
          acousticness: features.acousticness,
          instrumentalness: features.instrumentalness,
          liveness: features.liveness,
          valence: features.valence,
          tempo: features.tempo,
          duration_ms: features.duration_ms,
          time_signature: features.time_signature
        } : null        
      };
    }));

    res.json({
      playlistDetails: {
        name: playlistTracksResponse.data.name,
        description: playlistTracksResponse.data.description,
        //owner: playlistTracksResponse.data.owner.display_name,
        tracks: playlistTracks
      }
    });
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.response ? error.response.data : error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
