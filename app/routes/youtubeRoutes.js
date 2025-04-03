const express = require('express');
const router = express.Router();
const youtubeController = require("../controllers/youtubeController");

router.get('/search/video/youtube/v1', youtubeController.youtubeGetSearchVideoV1);
router.get('/info/video/youtube/v1', youtubeController.youtubeGetInfoVideoV1);
router.post('/download/video/youtube/v1', youtubeController.youtubeGetDownloadVideoV1);
router.get('/download/video/youtube/v2', youtubeController.youtubeGetDownloadVideoV2);
router.get('/download/video/direct/v1', youtubeController.directGetDownloadVideoV1);

/* EXPORTS */
module.exports = router;