const ytdl = require("ytdl-core");
const https = require("https");

/**
 * Returns all available video URLs for the given video ID
 *
 * @param videoId
 * @return {Promise<any>}
 */
async function getVideoDownloadUrl(videoId) {
    try {
        const info = await ytdl.getInfo(videoId);
        const formats = info.formats.filter(format => format.url); // Ensure we get valid URLs
        if (formats.length === 0) throw new Error("No video URLs found");
        return formats.map(format => format.url); // Return all available video URLs
    } catch (error) {
        return null;
    }
}

/**
 * Returns the M3U8 URL for the given video URL:
 *
 * actually, no M3U8 URL is returned. ytdl returns the MP4 URL for direct download.
 * @param videoUrl
 * @return {Promise<null|string>}
 */
async function getPlaybackURL(videoUrl) {
    try {
        const info = await ytdl.getInfo(videoUrl);
        const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
        const mp4Format = formats.find(format => format.container === 'mp4');
        return mp4Format ? mp4Format.url : null;
    } catch (error) {
        return null;
    }
}

/**
 * Downloads the video from the given video playback URL and streams it directly to the client
 * @param url
 * @param res
 * @param videoName
 * @return {Promise<unknown>}
 */
function downloadVideoFromPlaybackURL(url, res, videoName) {
    return new Promise((resolve, reject) => {
        https.get(url, (videoStream) => {
            if (videoStream.statusCode === 200) {

                let downloadedBytes = 0;
                let totalBytes = 0; // We don't have a content-length header

                // @todo Retrieve content-length somehow
                videoStream.on('response', (response) => {
                    // If Content-Length header is available, store it
                    if (response.headers['content-length']) {
                        totalBytes = parseInt(response.headers['content-length'], 10);
                    }
                });

                res.setHeader("Content-Type", "application/octet-stream"); // Force download
                res.setHeader('Content-Disposition', `attachment; filename=${videoName}.mp4`);

                videoStream.pipe(res);

                // When the stream ends, resolve the promise
                videoStream.on('end', resolve);
                videoStream.on('error', reject);
            } else {
                reject(new Error(`Failed to fetch video. Status code: ${videoStream.statusCode}`));
            }
        }).on('error', reject);
    });
}

/* EXPORTS */
module.exports = {
    downloadVideoFromPlaybackURL,
    getPlaybackURL
};