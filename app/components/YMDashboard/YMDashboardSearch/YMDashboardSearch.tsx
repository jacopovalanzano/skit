import React from "react";
import YoutubeVideoSnippets from "@/app/components/YMSnippets/YoutubeVideoSnippets";
import SpotifyTrackSnippets from "@/app/components/YMSnippets/SpotifyTrackSnippets";
import {PlaylistJsonRecordInterface, TrackSnippetInterface, VideoSnippetInterface} from "@/app/types/skit";

// Define props
interface YMDashboardSearchProps {
    playlists: PlaylistJsonRecordInterface;
    videos: VideoSnippetInterface[];
    tracks: TrackSnippetInterface[];
    playVideoHandle: (video: VideoSnippetInterface, url: string) => void;
}

/**
 * The download button component
 *
 * @constructor
 * @param playlists
 * @param videos
 * @param tracks
 * @param playVideoHandle
 */
const YMDashboardSearch: React.FC<YMDashboardSearchProps> = ({playlists, videos, tracks, playVideoHandle}) => {

    return(
        <div className="pt-6 px-4">

            {
                ((videos.length + tracks.length) === 0) &&
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-2xl text-gray-500"> Try searching to get started.</p>
                </div>
            }

            <SpotifyTrackSnippets playlists={playlists} tracks={tracks} />
            <YoutubeVideoSnippets playlists={playlists} videos={videos} playVideoHandle={playVideoHandle} />
        </div>
    );
}

export default YMDashboardSearch;