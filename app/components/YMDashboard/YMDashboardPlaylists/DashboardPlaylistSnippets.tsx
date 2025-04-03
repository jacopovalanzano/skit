import React from "react";
import {PlaylistJsonInterface, PlaylistJsonRecordInterface} from "@/app/types/skit";

interface YMDashboardPlaylistsProps {
    openSnippetHandle: (playlist: PlaylistJsonInterface) => void
    playlists: PlaylistJsonRecordInterface
}

const DashboardPlaylistSnippets: React.FC<YMDashboardPlaylistsProps> = ({ openSnippetHandle, playlists }) => {

    const [activeTab, setActiveTab] = React.useState<string>('playlists');
    const [selectedPlaylist, setSelectedPlaylist] = React.useState<PlaylistJsonInterface | null>(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Playlists list */
                (Object.entries(playlists).length > 0) && Object.entries(playlists).map(([playlistId, playlist], index: number) => {
                return (
                    <div key={playlistId} className="flex flex-col justify-between rounded">

                        {/* Video, Title & META */}
                        <div className="flex flex-col items-center">
                            {/* Video & Title */}
                            <div className="flex flex-col items-center">
                                {/* Video thumbnail */}
                                <span onClick={() => {
                                    openSnippetHandle(playlist);
                                    setSelectedPlaylist(playlist);
                                }
                                }>
                                    <img
                                        src={
                                            playlist.tracks?.[0]?.album?.images?.[0]?.url ??
                                            playlist.videos?.[0]?.snippet?.thumbnails?.medium?.url ??
                                            "/images/600x400.png"
                                        }
                                        className="w-full mb-2 rounded-lg"
                                    />
                                </span>

                                {/* Video title */}
                                <h3 className="dark:text-white p-1 mt-2 text-sm font-bold">{playlist.title}</h3>
                            </div>

                            <div className="flex flex-row items-center justify-between">
                                {/* Channel info */}
                                <div className="flex flex-row items-center space-x-2">
                                    <p className="text-xs text-gray-900 dark:text-white-900 font-bold">
                                        <a href="#" target="_blank">{
                                            playlist.tracks?.[0]?.artists?.[0]?.name ??
                                            playlist.videos?.[0]?.snippet?.channelTitle
                                        }</a>
                                    </p>
                                </div>

                                {/* Video meta */}
                                <div className="flex flex-row text-xs text-gray-500 dark:text-white-900 space-x-1 px-2">
                                    <small style={{textWrap: "nowrap"}}>{(playlist.tracks?.length + playlist.videos?.length) == 1 ? `${(playlist.tracks?.length + playlist.videos?.length)} Track` : `${(playlist.tracks?.length + playlist.videos?.length)} Tracks`}</small>
                                    <span>•</span>
                                    <small>{playlist.date}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

        </div>
    );
}

export default DashboardPlaylistSnippets;