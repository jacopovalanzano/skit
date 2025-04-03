import React from "react";
import OneEyedButton from "@/app/components/YMButtons/OneEyedButton";

interface Props {
    videoId: string;
}

/**
 * The download button component
 *
 * @param videoID
 * @constructor
 */
const DirectVideo: React.FC<Props> = ({ videoId }) => {

    const [isLoading, setIsLoading] = React.useState(false);

    /**
     * Handle download button click
     */
    async function handleDownloadClick() {

        // Return if downloading
        if (isLoading) {
            return;
        }

        setIsLoading(true); // Update UI

        // Retrieve the video URL
        const response = await fetch(`/api/v1/info/video/youtube/v1?videoId=${videoId}`);

        if (response.ok) {
            setIsLoading(false); // Update UI

            const data = await response.json();
            const decodedVideoURLFromBase64 = atob(data.videoUrl);

            // Open the video URL in a new tab
            window.open(decodedVideoURLFromBase64, '_blank');
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
    ) : <OneEyedButton handleClick={handleDownloadClick} />;
};

export default DirectVideo;