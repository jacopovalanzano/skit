const spotifyService = require('../services/spotifyService');
const https = require("https");

/**
 * Retrieves search results for music
 * @param req
 * @param res
 * @return {Promise<void>}
 */
async function spotifyGetSearchMusicV1(req, res) {
    const clientId = req.query.clientId;
    const clientSecret = req.query.clientSecret;

    const accessToken = await spotifyService.getAccessToken(clientId, clientSecret);

    // Get page number from query, default to 1
    const page = parseInt(req.query.p) || 1;
    const limit = 10; // Items per page
    const offset = (page - 1) * limit; // Calculate offset based on page number

    const options = {
        hostname: 'api.spotify.com',
        port: 443,
        path: `/v1/search?q=${encodeURIComponent(`track:${req.query.query}`)}&type=track,album,artist&limit=${limit}&offset=${offset}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    };

    const sreq = https.request(options, (response) => {

        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            res.send(data);
        });
    });

    sreq.on('error', (error) => {
        res.status(500).send('Failed to fetch data');
    });

    sreq.end();
}

/* EXPORTS */
module.exports = {
    spotifyGetSearchMusicV1
};