import React, {useState} from "react";
import {DownloadStatusInterface, DownloadMediaInterface, VideoSnippetInterface} from "@/app/types/skit";

interface Props {
    video: VideoSnippetInterface
}

/**
 * Initiates the download process
 *
 * @param videoId
 * @param setDownloadStatus
 */
async function initiateDownload(
    video: VideoSnippetInterface,
    setDownloadStatus: React.Dispatch<React.SetStateAction<DownloadStatusInterface>>
): Promise<void> {

    setDownloadStatus({ isDownloading: true, progress: 0, blobSize: 0, error: null });

    try {
        const response = await fetch(`http://localhost:3000/api/v1/download/video/youtube/v2?videoId=${video.id.videoId}`);

        if (! response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        if (! response.body) {
            throw new Error('Response body is not available');
        }

        const contentLength = Number(response.headers.get('Content-Length')) || 0;
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while (true) {

            const { done, value } = await reader.read();

            if (done) { break }

            if (value) {
                chunks.push(value);
                receivedLength += value.length;
                const progress = contentLength ? (receivedLength / contentLength) * 100 : 0;
                setDownloadStatus((prev) => ({ ...prev, progress: Math.min(progress, 100), blobSize: prev.blobSize + value.length }));
            }
        }

        if (receivedLength === 0) {
            throw new Error('No data received from stream');
        }

        // Download the video
        await handleDownloadResponse(chunks, setDownloadStatus, video);
    } catch (error) {
        setDownloadStatus({
            isDownloading: false,
            progress: 0,
            blobSize: 0,
            error: error instanceof Error ? error.message : 'Failed to download video.',
        });
    }
}

/**
 * Download the video to the user's device
 *
 * @param chunks
 * @param setDownloadStatus
 * @param video
 */
async function handleDownloadResponse(
    chunks: Uint8Array[],
    setDownloadStatus: React.Dispatch<React.SetStateAction<DownloadStatusInterface>>,
    video: VideoSnippetInterface
): Promise<void> {

    const blob = new Blob(chunks, { type: 'video/mp4' }); // Create a Blob from the chunks
    const link = document.createElement('a'); // Create the download link

    link.href = URL.createObjectURL(blob); // Add the blob object to the download link
    link.download = video.snippet.title; // Set the download filename
    document.body.appendChild(link); // Add the link to the DOM
    link.click(); // Click the download link: start the download

    // Clean up
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
    blob.stream().getReader().releaseLock();

    // Update the download status
    setDownloadStatus({ isDownloading: false, blobSize: 0,  progress: 100, error: null });

    const videoData = {
        type: 'video',
        title: video.snippet?.title || 'Unknown Title', // Avoids undefined errors
        date: new Date().toISOString(),
        media: video,
        size: blob?.size || 0  // Ensures blob.size is defined
    };

    const response = await fetch(`/api/v1/update/storage/v2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({key: 'downloads_json', entryKey: video.id.videoId, value: videoData}),
    })

    if(! response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
    }
}

/**
 * The download button component
 *
 * @param videoID
 * @constructor
 */
const DirectDownload: React.FC<Props> = ({ video }) => {

    /**
     * Set a few state variables
     */
    const [downloadStatus, setDownloadStatus] = useState<DownloadStatusInterface>({
        isDownloading: false,
        progress: 0,
        blobSize: 0,
        error: null,
    });

    /**
     * Handle download button click callback
     */
    async function handleDownloadClick() {
        if (! video || Object.entries(video).length === 0) {
            setDownloadStatus({ ...downloadStatus, error: 'Please enter a URL' });
            return;
        }

        await initiateDownload(video, setDownloadStatus);
    };

    /**
     * The download button
     */
    return (
        <div className="flex flex-row items-center justify-center">
            <button
                onClick={handleDownloadClick}
                className="flex flex-col items-center justify-center px-1.5 h-5 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition"
            >

                <div className="flex flex-column items-center justify-center">
                    {downloadStatus.error && (
                        <span className="text-xs text-red" style={{fontSize: "9px", lineHeight: "1.5"}}>Error</span>

                    )}

                    {! downloadStatus.error && (
                        <span className="text-xs" style={{fontSize: "9px", lineHeight: "1.5"}}>Download</span>

                    )}
                    {! downloadStatus.error && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="11"
                            width="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 5v14"></path>
                            <path d="M19 12l-7 7-7-7"></path>
                        </svg>
                    )}
                </div>

                <div className="w-full" style={{marginBottom: "1px"}}>
                    {downloadStatus.isDownloading && (
                        <div className="flex relative w-full h-0.5 bg-gray-300 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-progress" />
                            <span className="w-full flex"></span>
                        </div>
                    )}

                    {! downloadStatus.isDownloading && (
                        <div className="h-0.5"></div>
                    )}
                </div>
            </button>
        </div>
    );
};

export default DirectDownload;