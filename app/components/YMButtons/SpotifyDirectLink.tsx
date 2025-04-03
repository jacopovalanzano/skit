import React from "react";

interface Props {
    trackId: string;
}

/**
 * The download button component
 *
 * @param trackId
 * @constructor
 */
const SpotifyDirectLink: React.FC<Props> = ({ trackId }) => {

    /**
     * Handle download button click
     */
    const handleDownloadClick = async () => {
        window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
    };

    /**
     * The download button
     */
    return (
        <div className="flex flex-row items-center justify-center">
            <button
                onClick={handleDownloadClick}
                className="flex flex-row items-center justify-center px-1.5 py-0.5 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
            >
                <span className="text-xs">Spotify</span>
            </button>
        </div>
    );
};

export default SpotifyDirectLink;