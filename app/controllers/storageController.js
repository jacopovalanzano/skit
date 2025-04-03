const storageService = require('../services/storageService');

/**
 * Get value by key
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
async function storageGetKeyV1(req, res) {
    const key = req.params.key; // Get key from url params "../:key"
    const value = await storageService.get(key); // Get value by key
    res.send(value); // Send key and value
}

/**
 * Set value by key
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
async function storagePostKeyValueV1(req, res) {
    const key = req.body.key // Get key from body
    const value = req.body.value; // Get value from body
    const r = await storageService.set(key, value)
    res.status(200).send(r); // Set key and value in storage
}

/**
 * Set value by key
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
async function storagePostAddValueJSONV1(req, res) {
    const key = req.body.key // Get key from body
    const value = req.body.value; // Get value from body

    let oldValue = await storageService.get(key);

    if (!Array.isArray(oldValue)) {
        oldValue = []; // Ensure it's an array
    }

    oldValue.push(value);

    const r = await storageService.set(key, oldValue);
    res.status(200).send(r);
}

/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
async function storagePostAddKeyValueJSONV1(req, res)
{
    const key = req.body.key;    // Get key from body
    const value = req.body.value; // Get value from body (should be an object)
    const entryKey = req.body.entryKey; // Unique key for the new entry

    let oldValue = await storageService.get(key);

    if (! oldValue || typeof oldValue !== 'object') {
        oldValue = {};
    }

    oldValue[entryKey] = value;

    const r = await storageService.set(key, oldValue);
    res.status(200).send(r);
}

/**
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
async function storagePostUpdatePlaylistV1(req, res) {
    const { playlistId, field, value } = req.body;

    if (!playlistId || !field || typeof value !== "object") {
        return res.status(400).json({ error: "Invalid input" });
    }

    let jsonArray = await storageService.get("playlists_json");

    if (!jsonArray || typeof jsonArray !== "object") {
        jsonArray = {};
    }

    if (!jsonArray[playlistId]) {
        return res.status(404).json({ error: "Playlist not found" });
    }

    if (! Array.isArray(jsonArray[playlistId][field])) {
        jsonArray[playlistId][field] = [];
    }

    jsonArray[playlistId][field].push(value);

    await storageService.set("playlists_json", jsonArray);

    res.status(200).json({ success: true, updatedPlaylist: jsonArray[playlistId] });
}


/* EXPORTS */
module.exports = {
    storageGetKeyV1,
    storagePostKeyValueV1,
    storagePostAddValueJSONV1,
    storagePostAddKeyValueJSONV1,
    storagePostUpdatePlaylistV1
};