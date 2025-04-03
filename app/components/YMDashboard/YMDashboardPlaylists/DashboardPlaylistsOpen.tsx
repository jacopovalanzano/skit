import React, {useState} from "react";
import {
    TrackSnippetInterface,
    VideoSnippetInterface,
    PlaylistJsonRecordInterface,
    PlaylistJsonInterface
} from "@/app/types/skit";
import SpotifyTrackSnippets from "@/app/components/YMSnippets/SpotifyTrackSnippets";
import YoutubeVideoSnippets from "@/app/components/YMSnippets/YoutubeVideoSnippets";

/**
 * YMDashboardPlaylistsOpenProps
 */
interface YMDashboardPlaylistsOpenProps {
    playlist: PlaylistJsonInterface|null;
    playlists: PlaylistJsonRecordInterface;
    tracks: TrackSnippetInterface[];
    videos: VideoSnippetInterface[];
    playVideoHandle: (video: VideoSnippetInterface, url: string) => void;
}

/**
 * The download button component
 *
 * @constructor
 */
const DashboardPlaylistsOpen: React.FC<YMDashboardPlaylistsOpenProps> = ({ playlist, playlists, tracks, videos, playVideoHandle }) => {
    const [activeTab, setActiveTab] = useState<"tracks" | "videos">("tracks");

    return (
        <div className="h-full w-full">
            <SpotifyTrackSnippets playlists={playlists} tracks={playlist?.tracks ?? []} />
            <YoutubeVideoSnippets playlists={playlists} videos={playlist?.videos ?? []} playVideoHandle={playVideoHandle} />
        </div>
    );
};

export default DashboardPlaylistsOpen;