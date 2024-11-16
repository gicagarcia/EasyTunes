const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors())
const PORT = 3000;

let accessToken = "";

async function getSpotifyAccessToken() {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIPY_CLIENT_SECRET
                ).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    
    accessToken = response.data.access_token;
}

app.get('/playlist/bpm', async (req, res) => {
    const { playlistUrl } = req.query;
    const playlistId = playlistUrl.split('/playlist/')[1].split('?')[0];

    try {
        if (!accessToken) {
            await getSpotifyAccessToken();
        }

        const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const trackIds = playlistResponse.data.items.reduce((acc, item) => {
            acc[item.track.name] = item.track.id;
            return acc;
        }, {});
        
        const tracksWithBPM = [];

        for (const [trackName, trackId] of Object.entries(trackIds)) {
            const trackResponse = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            tracksWithBPM.push({
                name: trackName,
                bpm: trackResponse.data.tempo
            });
        }
        res.json(tracksWithBPM)
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
