const express = require('express');
const router = express.Router();
const storageController = require("../controllers/storageController");

router.get('/extract/storage/v1/:key', storageController.storageGetKeyV1);
router.post('/insert/storage/v1', storageController.storagePostKeyValueV1);
router.post('/update/storage/v1', storageController.storagePostAddValueJSONV1);
router.post('/update/storage/v2/', storageController.storagePostAddKeyValueJSONV1);
router.post('/update/playlist/v1', storageController.storagePostUpdatePlaylistV1);

/* EXPORTS */
module.exports = router;