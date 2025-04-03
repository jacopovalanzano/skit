import React, { useState } from "react";

/**
 * A representation of the download status
 */
interface DownloadStatus {
    isDownloading: boolean;
    progress: number;
    error: string | null;
}
/**
 * Starts the download process
 * @param url
 * @param setDownloadStatus
 */
async function initiateDownload(
    url: string,
    setDownloadStatus: React.Dispatch<React.SetStateAction<DownloadStatus>>
): Promise<void> {

    // Set the initial download status
    setDownloadStatus({ isDownloading: true, progress: 0, error: null });

    try {

        const proxyUrl = `/api/v1/download/video/youtube/v1?url=${encodeURIComponent(url)}`; // Proxy URL
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        }); // Fetch the response

        if (! response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        if (! response.body) {
            throw new Error('Response body is not available');
        }

        // Get the content length
        const contentLength = Number(response.headers.get('Content-Length')) || 0;
        const reader = response.body.getReader(); // Get the response body stream
        const chunks: Uint8Array[] = []; // Store the received chunks
        let receivedLength = 0; // Keep track of the received length

        // While the stream is not completed
        while (true) {

            const { done, value } = await reader.read();

            /**
             * If the stream is completed: stop the loop
             */
            if (done) { break }

            /**
             * If data was received
             */
            if (value) {

                // Update the received length
                receivedLength += value.length;

                // Calculate the progress
                const progress = contentLength ? (receivedLength / contentLength) * 100 : 0;

                // Update the download status
                setDownloadStatus((prev) => ({ ...prev, progress: Math.min(progress, 100) }));

                // Store the received chunk
                chunks.push(value);
            }
        }

        // If no data was received
        if (receivedLength === 0) {
            throw new Error('No data received from stream');
        }

        await handleDownloadResponse(chunks, response, setDownloadStatus);

    } catch (error) {
        setDownloadStatus({
            isDownloading: false,
            progress: 0,
            error: error instanceof Error ? error.message : 'Failed to download video.',
        });
    }
}

/**
 * Handles the download response: downloads the video to the user's device.
 * @param chunks
 * @param response
 * @param setDownloadStatus
 */
async function handleDownloadResponse(
    chunks: Uint8Array[],
    response: Response,
    setDownloadStatus: React.Dispatch<React.SetStateAction<DownloadStatus>>
): Promise<void> {
    // The video blob
    const blob = new Blob(chunks, { type: 'video/mp4' });

    // The video title
    const videoTitle = response.headers
        .get('Content-Disposition')
        ?.match(/filename="(.+)"/)?.[1] || 'video.mp4';

    // Create the download link
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob); // Add the blob object to the download link
    link.download = videoTitle; // Set the download filename
    document.body.appendChild(link); // Add the link to the DOM
    link.click(); // Click the download link: start the download
    document.body.removeChild(link); // Remove the link from the DOM

    // Update the download status
    setDownloadStatus({ isDownloading: false, progress: 100, error: null });
}

const MediaDownloadBar: React.FC = () => {

    /**
     * The URL to download
     */
    const [url, setUrl] = useState<string>('');

    /**
     * The download status
     */
    const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
        isDownloading: false,
        progress: 0,
        error: null,
    });

    /**
     * Handle the change of the URL, such as when the user pastes a link or types it manually
     * @param e
     */
    function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUrl(e.target.value);
    };

    /**
     * Handle the click of the download button on the URL bar (right side)
     */
    async function handleDownloadClick() {

        // Return if downloading
        if (downloadStatus.isDownloading) {
            return;
        }

        // If the URL is empty, show an error
        if (! url) {
            setDownloadStatus({ ...downloadStatus, error: 'Please enter a URL' });
            return;
        }

        await initiateDownload(url, setDownloadStatus);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Download Bar */}
            <div className="flex justify-end w-full max-w-lg border border-gray-400 rounded-full overflow-hidden bg-gray-100 focus-within:border-red-500">
                {/* Input Field */}
                <input
                    value={url}
                    onChange={handleUrlChange}
                    disabled={downloadStatus.isDownloading}
                    style={{width: '100%'}}
                    type="text"
                    placeholder="Paste link here..."
                    className=" px-3 py-1 bg-transparent focus:outline-none text-sm"
                />

                {/* Download Button */}
                <button
                    onClick={handleDownloadClick}
                    disabled={downloadStatus.isDownloading || !url}
                    className="flex items-center justify-center px-3 py-1 bg-red-500 text-white hover:bg-red-600 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 5v10m0 0l4-4m-4 4l-4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </button>
            </div>

            {/* Download Status */}
            <div className="flex flex-col w-full mt-1 px-2">
                {downloadStatus.isDownloading && (
                    <div className="relative flex">
                        <progress
                            className="w-full rounded px-4 h-1"
                            value={downloadStatus.progress} max="100" />
                        <span style={{visibility: 'hidden', display: 'none'}} className="absolute inset-0 flex items-center justify-center text-xs">{Math.round(downloadStatus.progress)}%</span>
                    </div>
                )}

                {downloadStatus.error && (
                    <div className="flex text-xs" style={{ color: 'red' }}>
                        {downloadStatus.error} - Try again later
                    </div>
                )}
            </div>

        </div>
    );
};

export default MediaDownloadBar;
