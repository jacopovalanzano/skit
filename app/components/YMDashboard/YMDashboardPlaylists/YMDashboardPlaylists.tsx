import React, {useEffect, useState} from "react";
import {createHash} from "crypto";
import DashboardPlaylistSnippets from "@/app/components/YMDashboard/YMDashboardPlaylists/DashboardPlaylistSnippets";
import DashboardPlaylistsOpen from "@/app/components/YMDashboard/YMDashboardPlaylists/DashboardPlaylistsOpen";
import {PlaylistJsonInterface, TrackSnippetInterface, VideoSnippetInterface, PlaylistJsonRecordInterface} from "@/app/types/skit";

/**
 * YMDashboardPlaylistsProps
 */
interface YMDashboardPlaylistsProps {
    playlists: PlaylistJsonRecordInterface;
    tracks: TrackSnippetInterface[];
    videos: VideoSnippetInterface[];
    playVideoHandle: (video: VideoSnippetInterface, url: string) => void;
    addNewPlaylistHandle: (playlist: PlaylistJsonRecordInterface) => void;
}

/**
 * The download button component
 *
 * @constructor
 */
const YMDashboardPlaylists: React.FC<YMDashboardPlaylistsProps> = ({ tracks, videos, playlists, playVideoHandle, addNewPlaylistHandle }) => {

    /**
     * The new playlist title (see input below)
     */
    const [newPlaylistTitle, setNewPlaylistTitle] = useState<string>('');

    /**
     * The new playlist description (see textarea below)
     */
    const [newPlaylistDescription, setNewPlaylistDescription] = useState<string>('');

    /**
     * The list of playlists
     */
    const [playlistsList, setPlaylistsList] = useState<PlaylistJsonRecordInterface>(playlists);

    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistJsonInterface | null>(null);

    /**
     * Creates a new playlist
     */
    const createNewPlaylist = async () => {

        const title = newPlaylistTitle; // Playlist Title
        const description = newPlaylistDescription; // Playlist Description

        // @todo implement error reporting/validation
        if(title === '' || title === null || title === undefined) {
            return;
        }

        // Generate a new playlist ID (Playlist Title MD5)
        const newPlaylistId = createHash("md5").update(title).digest("hex");

        // Add new playlist
        const playlistData = {
            id: newPlaylistId,
            title: title,
            description: description,
            date: new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(new Date()).replace(",", ""),
            tracks: [],
            videos: [],
        };

        playlists[newPlaylistId] = playlistData; // Update playlists
        setPlaylistsList(playlists); // Update UI

        try {

            const response = await fetch(`/api/v1/update/storage/v2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({key: 'playlists_json', entryKey: newPlaylistId, value: playlistData}),
            })


            // If the playlist was created, reset the title and description inputs
            if(response.ok) {
                setNewPlaylistTitle('');
                setNewPlaylistDescription('');
                addNewPlaylistHandle(playlists);
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    /**
     * Return all saved playlists
     *
     * @returns {Promise<Playlist[]>}
     */
    const getAllSavedPlaylists = async () => {
        try {
            const response = await fetch('/api/v1/extract/storage/v1/playlists_json');

            const responseText = await response.text();

            if(responseText !== '' && responseText !== null && responseText !== undefined) {
                return JSON.parse(responseText);
            }

            return {};

        } catch (error) {
            console.error('Error fetching playlists:', error);
            return {};
        }
    }

    const getSpotifyTracks = async (playlists: object) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/extract/storage/v1/');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching playlists:', error);
            return [];
        }
    };

    const getYoutubeMusicVideos = async (playlists: object) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/extract/storage/v1/');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching playlists:', error);
            return [];
        }
    };

    async function openSnippetHandle(playlist: PlaylistJsonInterface) {
        setSelectedPlaylist(playlist)
    }

    useEffect(() => {
        getAllSavedPlaylists().then((playlists) => {
            setPlaylistsList(playlists);
        });
    }, []);

    return (
        <div className="pt-6 px-4">

            {/* Dashboard: first 2 square cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">

                {/* Create a new playlist (card) */}
                <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 sm:p-6 xl:p-8 mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">New Playlist</h3>
                            <span className="text-base font-normal text-gray-500">Create a new playlist.</span>
                        </div>
                        <div className="flex-shrink-0">
                            <span
                                onClick={createNewPlaylist}
                                className="cursor-pointer text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2">Create</span>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex flex-col w-full mr-4">
                            <input
                                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                                value={newPlaylistTitle}
                                type="text" className="mb-2 appearance-none border rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" placeholder="Playlist Title" />

                            <textarea
                                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                                value={newPlaylistDescription}
                                className="appearance-none border rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Playlist Description"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {
                ((Object.entries(playlistsList).length) === 0) &&
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-2xl text-gray-500">You have no saved playlists.</p>
                </div>
            }

            {/* The open playlist */}
            <DashboardPlaylistsOpen playlist={selectedPlaylist} playlists={playlists} tracks={tracks} videos={videos} playVideoHandle={playVideoHandle}  />


            {/* The list of playlists */}
            <DashboardPlaylistSnippets openSnippetHandle={openSnippetHandle} playlists={playlistsList} />
        </div>
    );
};

export default YMDashboardPlaylists;