import React from "react";
import YoutubeVideoSnippets from "@/app/components/YMSnippets/YoutubeVideoSnippets";
import {PlaylistJsonRecordInterface, VideoSnippetInterface} from "@/app/types/skit";

// Define props
interface YMDashboardSearchProps {
    playlists: PlaylistJsonRecordInterface;
    videos: VideoSnippetInterface[];
    playVideoHandle: (video: VideoSnippetInterface, url: string) => void;
}

/**
 * The download button component
 *
 * @constructor
 * @param videos
 * @param tracks
 */
const DashboardYoutubeSearch: React.FC<YMDashboardSearchProps> = ({playlists, videos, playVideoHandle }) => {
    return(
        <div className="pt-6 px-4 min-h-screen">

            {
                ((videos.length) === 0) &&
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-2xl text-gray-500"> Try searching to get started.</p>
                </div>
            }

            <YoutubeVideoSnippets playlists={playlists} videos={videos} playVideoHandle={playVideoHandle}  />
        </div>
    );
}

export default DashboardYoutubeSearch;