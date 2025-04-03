import React, { useState } from "react";
import {PlaylistJsonRecordInterface, TrackSnippetInterface, VideoSnippetInterface} from "@/app/types/skit";

interface AddToPlaylistButtonProps {
    playlists: PlaylistJsonRecordInterface;
    video?: VideoSnippetInterface|null|undefined;
    track?: TrackSnippetInterface|null|undefined;
}

/**
 * Add a video or track to a playlist.
 *
 * @param playlistId
 * @param media
 */
async function addToPlaylist(playlistId: string, media: VideoSnippetInterface|TrackSnippetInterface ) {

    // Retrieve the playlist
    const playlistResponse = await fetch(`/api/v1/extract/storage/v1/playlists_json`);

    // If the playlist exists
    if (playlistResponse.ok) {

        let playlistData: Record<string, any> = {}; // Initialize playlist data

        const playlistResponseT = await playlistResponse.text(); // Retrieve playlist data

        // If the playlist data is not empty
        if (playlistResponseT !== '' && playlistResponseT !== null && playlistResponseT !== undefined) {
            playlistData = JSON.parse(playlistResponseT); // Parse playlist data
        }

        // If the playlist does not exist
        if (playlistData[playlistId] === undefined) {
            return false;
        }

        if(media.type !== "video") {

            // Media is already in playlist
            if(playlistData[playlistId].tracks.find((t: TrackSnippetInterface) => t.id === media.id)) {
                return false;
            }

            playlistData[playlistId].tracks.push(media);
        }

        if(media.type === "video") {

            // Check if video is already in playlist
            if (playlistData[playlistId].videos.find((v: VideoSnippetInterface) => v.id.videoId === media.id.videoId)) {
                return false;
            }

            playlistData[playlistId].videos.push(media);
        }

        const playlistUpdateResponse = await fetch(`/api/v1/update/playlist/v1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({playlistId: playlistId, field: media.type === "video" ? "videos" : "tracks", value: media })
        });

        if (! playlistUpdateResponse.ok) {
            throw new Error('Playlist could not be created');
        }

        return true;
    }

    throw new Error('Playlist could not be created');
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ playlists, video, track }) => {

    /**
     * Whether the button is loading
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Whether the popup menu is open
     */
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block w-auto">

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <svg
                    className="w-5 h-5 text-gray-700 dark:text-gray-300"
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 16.9999C11.25 16.5857 10.9142 16.2499 10.5 16.2499C10.0858 16.2499 9.75 16.5857 9.75 16.9999C9.75 17.4142 10.0858 17.7499 10.5 17.7499C10.9142 17.7499 11.25 17.4142 11.25 16.9999Z" fill="#c9c9c9"></path> <path fillRule="evenodd" clipRule="evenodd" d="M8.67239 7.54199H15.3276C18.7024 7.54199 20.3898 7.54199 21.3377 8.52882C22.2855 9.51564 22.0625 11.0403 21.6165 14.0895L21.1935 16.9811C20.8437 19.3723 20.6689 20.5679 19.7717 21.2839C18.8745 21.9999 17.5512 21.9999 14.9046 21.9999H9.09534C6.4488 21.9999 5.12553 21.9999 4.22834 21.2839C3.33115 20.5679 3.15626 19.3723 2.80648 16.9811L2.38351 14.0895C1.93748 11.0403 1.71447 9.51565 2.66232 8.52882C3.61017 7.54199 5.29758 7.54199 8.67239 7.54199ZM12.75 10.4999C12.75 10.0857 12.4142 9.74995 12 9.74995C11.5858 9.74995 11.25 10.0857 11.25 10.4999V14.878C11.0154 14.7951 10.763 14.7499 10.5 14.7499C9.25736 14.7499 8.25 15.7573 8.25 16.9999C8.25 18.2426 9.25736 19.2499 10.5 19.2499C11.7426 19.2499 12.75 18.2426 12.75 16.9999V13.3197C13.4202 13.8633 14.2617 14.2499 15 14.2499C15.4142 14.2499 15.75 13.9142 15.75 13.4999C15.75 13.0857 15.4142 12.7499 15 12.7499C14.6946 12.7499 14.1145 12.5313 13.5835 12.0602C13.0654 11.6006 12.75 11.0386 12.75 10.4999Z" fill="#c9c9c9"></path> <path opacity="0.4" d="M8.50956 2.00001H15.4897C15.7221 1.99995 15.9004 1.99991 16.0562 2.01515C17.164 2.12352 18.0708 2.78958 18.4553 3.68678H5.54395C5.92846 2.78958 6.83521 2.12352 7.94303 2.01515C8.09884 1.99991 8.27708 1.99995 8.50956 2.00001Z" fill="#c9c9c9"></path> <path opacity="0.7" d="M6.3102 4.72266C4.91958 4.72266 3.77931 5.56241 3.39878 6.67645C3.39085 6.69967 3.38325 6.72302 3.37598 6.74647C3.77413 6.6259 4.18849 6.54713 4.60796 6.49336C5.68833 6.35485 7.05367 6.35492 8.6397 6.35501H15.5318C17.1178 6.35492 18.4832 6.35485 19.5635 6.49336C19.983 6.54713 20.3974 6.6259 20.7955 6.74647C20.7883 6.72302 20.7806 6.69967 20.7727 6.67645C20.3922 5.56241 19.2519 4.72266 17.8613 4.72266H6.3102Z" fill="#c9c9c9"></path> </g></svg>
            </button>

            {/* Popup Menu (shown when `isOpen` is true) */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">

                        {/* Show loading spinner instead of playlist buttons when isLoading is true */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-4">
                                <svg
                                    className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-300"
                                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612" stroke="#ffffff" strokeWidth="3.55556" strokeLinecap="round"></path> </g></svg>
                            </div>
                        ) : (
                            Object.entries(playlists).length > 0 ? (
                                Object.entries(playlists).map(([playlistId, playlist], index) => {
                                    return (video !== null && video !== undefined) ?
                                        (
                                            <li key={index}>
                                                <button
                                                    onClick={() => {
                                                        setIsLoading(true);
                                                        addToPlaylist(playlistId, video!)
                                                            .then(() => setIsOpen(false))
                                                            .finally(() => setIsLoading(false));
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {playlist.title}
                                                </button>
                                            </li>
                                        ) : (
                                            <li key={index}>
                                                <button
                                                    onClick={() => {
                                                        setIsLoading(true);
                                                        addToPlaylist(playlistId, track!)
                                                            .then(() => setIsOpen(false))
                                                            .finally(() => setIsLoading(false));
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {playlist.title}
                                                </button>
                                            </li>
                                        );
                                })
                            ) : (
                                <li className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    No Playlists
                                </li>
                            )
                        )}
                    </ul>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddToPlaylistButton;
