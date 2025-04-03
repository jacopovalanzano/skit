const express = require('express');
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

router.get('/search/music/spotify/v1', spotifyController.spotifyGetSearchMusicV1);

/* EXPORTS */
module.exports = router;