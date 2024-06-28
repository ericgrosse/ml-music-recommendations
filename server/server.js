const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
const app = express();
const port = 8888;

const clientID = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

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

// Route to fetch playlist tracks
app.get('/fetch-playlist-tracks', async (req, res) => {
  const playlistId = req.query.playlist_id;

  if (!playlistId) {
    return res.status(400).send('Playlist ID is required');
  }

  try {
    const accessToken = await getAccessToken();
    
    // Fetch playlist details
    const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Fetch playlist tracks
    const playlistTracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const playlistTracks = playlistTracksResponse.data.items.map(item => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists.map(artist => artist.name).join(', '),
      features: null // Placeholder for features
    }));

    res.json({
      playlistDetails: {
        name: playlistResponse.data.name,
        description: playlistResponse.data.description,
        owner: playlistResponse.data.owner.display_name,
        tracks: playlistTracks
      }
    });
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
