import React from "react";
import SpotifyDirectLink from "@/app/components/YMButtons/SpotifyDirectLink";
import AddToPlaylistButton from "@/app/components/YMButtons/AddToPlaylistButton";
import CopyToClipboardButton from "@/app/components/YMButtons/CopyToClipboardButton";
import {PlaylistJsonRecordInterface, TrackSnippetInterface} from "@/app/types/skit";

interface SnippetListProps {
    playlists: PlaylistJsonRecordInterface;
    tracks: TrackSnippetInterface[];
}

function formatDuration (durationMs: number) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
};

const SpotifyTrackSnippets: React.FC<SnippetListProps> = ({ playlists, tracks }) => {

    return (
        <div key="tracks" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {tracks.map((track, index) => (

                <div key={index} className="flex flex-col justify-between rounded">

                    {/* Video, Title & META */}
                    <div className="flex flex-col">
                        {/* Video & Title */}
                        <div className="p-1">
                            {/* Video thumbnail */}
                            <a
                                href={track.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer">
                                <img
                                    src={track.album.images[0].url}
                                    className="w-full mb-2 rounded-lg"
                                />
                            </a>

                            {/* Video title */}
                            <h3 className="dark:text-white p-1 mt-2 text-sm font-bold">{track.name}</h3>
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            {/* Channel info */}
                            <div className="flex flex-row items-center space-x-2 px-2">
                                <img
                                    src={track.album.images[1].url}
                                    alt={track.name}
                                    className="w-5 h-5 rounded-full"
                                />
                                <p className="text-xs text-gray-900 dark:text-white-900 font-bold">
                                    <a href={track.artists[0].external_urls.spotify} target="_blank">{track.artists[0].name}</a>
                                </p>
                            </div>

                            {/* Video meta */}
                            <div className="flex flex-row text-xs text-gray-500 dark:text-white-900 space-x-1 px-2">
                                <small>{track.popularity}</small>
                                <span>•</span>
                                <small>{formatDuration( track.duration_ms ?? 0)}</small>
                            </div>
                        </div>
                    </div>

                    {/* Video actions (download, view etc.) */}
                    <div className="">
                        {/* Action buttons */}
                        <div className="flex flex-row justify-between items-center align-center space-x-1 pl-2">
                            <div className="flex flex-row justify-between space-x-1 align-middle">
                                {/* Copy to clipboard button */}
                                <CopyToClipboardButton stringToCopy={`https://open.spotify.com/track/${track.id}`} />

                                {/* Direct link to spotify button */}
                                <SpotifyDirectLink trackId={track.id} />
                            </div>

                            {/* Add to playlist button */}
                            <AddToPlaylistButton playlists={playlists} track={track} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpotifyTrackSnippets;
