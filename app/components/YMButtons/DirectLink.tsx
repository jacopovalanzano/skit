import React from "react";

interface Props {
    videoId: string;
}

/**
 * The download button component
 *
 * @param videoID
 * @constructor
 */
const DirectLink: React.FC<Props> = ({ videoId }) => {

    /**
     * Handle download button click
     */
    async function handleDownloadClick() {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    };

    /**
     * The download button
     */
    return (
        <div className="flex flex-row items-center justify-center">
            <button
                onClick={handleDownloadClick}
                className="flex flex-row items-center justify-center px-1.5 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
            >
                <span className="text-xs">YouTube</span>
            </button>
        </div>
    );
};

export default DirectLink;