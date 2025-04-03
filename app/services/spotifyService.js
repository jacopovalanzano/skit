/**
 * Request an access token from Spotify:
 * you need a client id & secret
 *
 * @param clientId
 * @param clientSecret
 * @return {Promise<*>}
 */
async function getAccessToken(clientId, clientSecret) {

    const url = 'https://accounts.spotify.com/api/token';

    // Prepare the request body
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);

    // Make the POST request
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(), // Convert the body to a URL-encoded string
        });

        if (!response.ok) {
            throw new Error('Failed to fetch token');
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};

/* EXPORTS */
module.exports = {
    getAccessToken
};