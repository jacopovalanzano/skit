const youtubeService = require('../services/youtubeService');
const ytdl = require("ytdl-core");

/**
 * The YouTube watch URL
 * @type {string}
 */
const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';

/**
 * @todo
 * @type {string}
 */
const YOUTUBE_COOKIES = '';

/**
 * Fetches video information (uses ytdl-core)
 * @param req
 * @param res
 * @return {Promise<*>}
 */
async function youtubeGetInfoVideoV1(req, res) {

    const videoId = req.query.videoId; // Get the URL from the query parameter

    if (! videoId) {
        return res.status(400).send('No ID provided');
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Validate the YouTube URL
    if (! ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoDirectLink = await youtubeService.getPlaybackURL(videoUrl);
    const base64VideoLink = Buffer.from(videoDirectLink).toString('base64');

    return res.json({
        videoId: videoId,
        videoUrl: base64VideoLink
    });
}

/**
 * Download a YouTube video (uses ytdl-core)
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
async function youtubeGetDownloadVideoV2(req, res) {
    const videoId = req.query.videoId; // Get the URL from the query parameter

    if (! videoId) {
        return res.status(400).send('No ID provided');
    }

    const url = YOUTUBE_WATCH_URL + videoId;

    // Validate the YouTube URL
    if (! ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get the video name
    const videoName = await ytdl.getInfo(url).then(info => info.videoDetails.title);

    const playbackUrl = await youtubeService.getPlaybackURL(url);

    try {
        await youtubeService.downloadVideoFromPlaybackURL(playbackUrl, res, videoName); // Stream the video directly to the client
    } catch (error) {
        res.status(500).send('Failed to download video');
    }
}

/**
 * Download a YouTube video (uses ytdl-core).
 * May fail. Use as a fallback only.
 *
 * @param req
 * @param res
 * @return {Promise<*>}
 */
async function youtubeGetDownloadVideoV1(req, res) {
    const videoUrl = req.body.url

    if (! videoUrl) {
        return res.status(400).send('No URL provided');
    }

    // Validate the YouTube URL
    if (! ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        // Retrieve video information
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    Cookie: YOUTUBE_COOKIES,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': videoUrl,
                    'Accept': 'application/json',
                },
            },
        });

        // Get the video title
        const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '') || 'Untitled YouTube Video';

        // Start the download
        const stream = ytdl(videoUrl, {
            quality: 'highest',
            filter: (format) => format.container === 'mp4' && format.hasVideo && format.hasAudio,
            requestOptions: {
                headers: {
                    Cookie: YOUTUBE_COOKIES,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': videoUrl,
                    'Accept': 'application/json'
                },
                maxRetries: 5,
                backoff: { inc: 100, max: 1000 },
            },
        });

        res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        stream.pipe(res);

        stream.on('error', (error) => {
            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
        });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
}

/**
 * Download video by visiting the video URL
 * @param req
 * @param res
 * @return {Promise<*>}
 */
async function directGetDownloadVideoV1(req, res) {
    const url = req.query.url;

    if (! url) {
        return res.status(400).send('Base64-encoded URL is required');
    }

    const videoUrl = Buffer.from(url, 'base64').toString('utf-8');

    const videoName = await ytdl.getInfo(videoUrl).then(info => info.videoDetails.title);

    if (! videoUrl) {
        return res.status(400).send('No URL provided');
    }

    try {
        await youtubeService.downloadVideoFromPlaybackURL(videoUrl, res, videoName); // Stream the video directly to the client
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('Failed to download video');
    }
}

/**
 * Search YouTube videos
 * @param req
 * @param res
 * @return {Promise<*>}
 */
async function youtubeGetSearchVideoV1(req, res) {

    const query = req.query.query;
    const page = parseInt(req.query.p) || 1; // Default to page 1
    const videos = [];
    let currentPage = 1;
    let continuationToken = null;

    const url = "https://www.youtube.com/youtubei/v1/search";
    const data = {
        context: {
            client: {
                clientName: "WEB",
                clientVersion: "2.20210101.00.00",
                hl: "en",
                gl: "US",
            }
        },
        query: query
    };

    try {
        do {
            // Request body with continuation token
            const requestBody = continuationToken
                ? { context: data.context, continuation: continuationToken }
                : data;

            // Ask youtube for videos
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const responseText = await response.text();

            if (! response.ok) {
                res.status(404).json({ error: "No videos found" });
            }

            const result = JSON.parse(responseText);

            let contents; // Variable to store the contents
            if (continuationToken) {
                contents = result?.onResponseReceivedCommands?.[0]?.appendContinuationItemsAction?.continuationItems;
            } else {
                contents = result?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
            }

            // Check if contents are available
            if (! contents) {
                return videos.length > 0
                    ? res.json({ items: videos })
                    : res.status(404).json({ error: "No videos found" });
            }

            contents.forEach(item => {
                let videoData = null; // Variable to store the video data

                if (item.videoRenderer) {
                    videoData = item.videoRenderer;
                } else if (item.richItemRenderer?.content?.videoRenderer) {
                    videoData = item.richItemRenderer.content.videoRenderer;
                } else if (item.itemSectionRenderer?.contents) {
                    // Search for the videoRenderer in the itemSectionRenderer
                    item.itemSectionRenderer.contents.forEach(subItem => {
                        // If subItem is a video renderer
                        if (subItem.videoRenderer) {

                            // Assign the video data
                            videoData = subItem.videoRenderer;

                            // If video data is found
                            if (videoData) {

                                const videoId = videoData.videoId;
                                const title = videoData.title?.runs?.[0]?.text || "No title";
                                const thumbnail = videoData.thumbnail?.thumbnails?.[0]?.url || "";
                                const views = videoData.shortViewCountText?.simpleText || videoData.viewCountText?.simpleText || "N/A";
                                const length = videoData.lengthText?.simpleText || "N/A";
                                const uploadDate = videoData.publishedTimeText?.simpleText || "N/A";
                                const description = videoData.detailedMetadataSnippets?.[0]?.snippetText?.runs?.[0]?.text || "No description available";
                                const channelThumbnail = videoData.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail?.thumbnails?.[0]?.url || "";
                                const channelTitle = videoData.ownerText?.runs?.[0]?.text || "Unknown";
                                const channelId = videoData.ownerText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId || "Unknown";
                                const videoURL = videoData.navigationEndpoint?.watchEndpoint?.watchEndpointSupportedOnesieConfig?.html5PlaybackOnesieConfig?.commonConfig?.url;
                                const inlineVideoURL = videoData.inlinePlaybackEndpoint?.watchEndpoint?.watchEndpointSupportedOnesieConfig?.html5PlaybackOnesieConfig?.commonConfig?.url;

                                videos.push({
                                    type: "video",
                                    id: { videoId },
                                    snippet: {
                                        title,
                                        thumbnails: { medium: { url: thumbnail } },
                                        channelTitle,
                                        views,
                                        length,
                                        uploadDate,
                                        description,
                                        channel: {
                                            thumbnails: { medium: { url: channelThumbnail } },
                                            title: channelTitle,
                                            id: channelId
                                        },
                                        playbackUrl: videoURL,
                                        inlineUrl: inlineVideoURL
                                    }
                                });
                            }
                        }
                    });
                }
            });

            // Get continuation token for next page
            const continuationItem = contents.find(item => item.continuationItemRenderer);
            continuationToken = continuationItem?.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;

            // Increment current page
            currentPage++;
        } while (continuationToken && currentPage <= page);

        return videos.length > 0
            ? res.json({ items: videos })
            : res.status(404).json({ error: "No videos found" });

    } catch (error) {
        res.status(500).send('Error fetching data');
    }
}

/* EXPORT */
module.exports = {
    directGetDownloadVideoV1,
    youtubeGetDownloadVideoV1,
    youtubeGetDownloadVideoV2,
    youtubeGetInfoVideoV1,
    youtubeGetSearchVideoV1
};

