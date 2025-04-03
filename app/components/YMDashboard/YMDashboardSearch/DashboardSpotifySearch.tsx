import React from "react";
import SpotifyTrackSnippets from "@/app/components/YMSnippets/SpotifyTrackSnippets";
import {PlaylistJsonRecordInterface, TrackSnippetInterface, VideoSnippetInterface} from "@/app/types/skit";

// Define props
interface YMDashboardSearchProps {
    playlists: PlaylistJsonRecordInterface;
    tracks: TrackSnippetInterface[];
}

/**
 * The download button component
 *
 * @constructor
 * @param videos
 * @param tracks
 */
const DashboardSpotifySearch: React.FC<YMDashboardSearchProps> = ({playlists, tracks}) => {
    return(
        <div className="pt-6 px-4 min-h-screen">

            {
                ((tracks.length) === 0) &&
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-2xl text-gray-500"> Try searching to get started.</p>
                </div>
            }


            <SpotifyTrackSnippets playlists={playlists} tracks={tracks} />
        </div>
    );
}

export default DashboardSpotifySearch;