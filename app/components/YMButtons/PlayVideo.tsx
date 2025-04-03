import React from "react";
import {VideoSnippetInterface} from "@/app/types/skit";

interface Props {
    video: VideoSnippetInterface;
    playVideoHandle: (video: VideoSnippetInterface, url: string) => void;
}

/**
 * The download button component
 *
 * @param videoID
 * @param playVideoHandle
 * @constructor
 */
const PlayVideo: React.FC<Props> = ({ video, playVideoHandle }) => {

    const [isLoading, setIsLoading] = React.useState(false);

    /**
     * Handle download button click
     */
    async function playVideo() {

        // Return if downloading
        if (isLoading) {
            return;
        }

        setIsLoading(true); // Update UI

        // Retrieve the video URL
        const response = await fetch(`/api/v1/info/video/youtube/v1?videoId=${video.id.videoId}`);

        if (response.ok) {
            setIsLoading(false); // Update UI

            const data = await response.json();
            const decodedVideoURLFromBase64 = atob(data.videoUrl);

            // Open the video
            playVideoHandle(video, decodedVideoURLFromBase64);
        }
    };

    /**
     * The download button
     */
    return isLoading ? (
        <div className="flex flex-row items-center justify-center">
            <svg
                className="animate-spin h-5 w-5 text-gray-500"
                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612" stroke="#9e9e9e" strokeWidth="3.55556" strokeLinecap="round"></path>
                </g>
            </svg>
        </div>
    ) :
        <div className="flex flex-row items-center justify-center">
            <button
                onClick={playVideo}
                className="flex flex-row items-center justify-center px-1 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-gray-600 transition"
            >
                <svg height="17" width="17"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                </svg>
            </button>
        </div>
};

export default PlayVideo;