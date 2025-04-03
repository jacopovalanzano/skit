import React from "react";
import DirectDownload from "@/app/components/YMButtons/DirectDownload";
import DirectLink from "@/app/components/YMButtons/DirectLink";
import AddToPlaylistButton from "@/app/components/YMButtons/AddToPlaylistButton";
import CopyToClipboardButton from "@/app/components/YMButtons/CopyToClipboardButton";
import PlayVideo from "@/app/components/YMButtons/PlayVideo";
import {PlaylistJsonRecordInterface, VideoSnippetInterface} from "@/app/types/skit";

interface SnippetListProps {
    playlists: PlaylistJsonRecordInterface;
    videos: VideoSnippetInterface[];
    playVideoHandle: (video: VideoSnippetInterface, url: string) => void;
}

const YoutubeVideoSnippets: React.FC<SnippetListProps> = ({ playlists, videos, playVideoHandle }) => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 gap-y-15 mb-10">
            { videos.length > 0 && videos.map((video) => (
                <div key={video.id.videoId} className="flex flex-col justify-between rounded">

                    {/* Video, Title & META */}
                    <div className="flex flex-col">
                        {/* Video & Title */}
                        <div className="p-1">
                            {/* Video thumbnail */}
                            <span>
                                <img
                                    src={video.snippet.thumbnails.medium.url}
                                    alt={video.snippet.title}
                                    className="w-full mb-2 rounded-lg"
                                />
                            </span>

                            {/* Video title */}
                            <h3 className="dark:text-white p-1 mt-2 text-sm font-bold">{video.snippet.title}</h3>
                        </div>

                        {/* Channel info */}
                        <div className="flex items-center space-x-2 px-2">
                            <img
                                src={video.snippet.channel.thumbnails.medium.url}
                                alt={video.snippet.channelTitle}
                                className="w-5 h-5 rounded-full"
                            />
                            <p className="text-xs text-gray-900 dark:text-white-900 font-bold">
                                <a href={`https://www.youtube.com/channel/${video.snippet.channel.id}`} target="_blank">{video.snippet.channelTitle}</a>
                            </p>
                        </div>

                        {/* Video meta */}
                        <div className="flex flex-row text-xs text-gray-500 dark:text-white-900 space-x-1 px-2 mt-2">
                            <small>{video.snippet.views}</small>
                            <span>•</span>
                            <small>{video.snippet.uploadDate}</small>
                        </div>
                    </div>

                    {/* Video description */}
                    <div className="p-2">
                        <p className="text-xs text-gray-500">{video.snippet.description}</p>
                    </div>

                    {/* Video actions (download, view etc.) */}
                    <div className="p-2">
                        {/* Action buttons */}
                        <div className="flex flex-row justify-between space-x-1">

                            <div className="flex flex-row flex-wrap justify-between space-x-1 align-middle">

                                {/* Copy link to clipboard button */}
                                <CopyToClipboardButton stringToCopy={`https://www.youtube.com/watch?v=${video.id.videoId}`} />

                                {/* Direct link to youtube button */}
                                <DirectLink videoId={video.id.videoId} />

                                {/* Download button */}
                                <DirectDownload video={video} />

                                {/* Play video */}
                                <PlayVideo video={video} playVideoHandle={playVideoHandle} />
                            </div>

                            {/* Add to playlist button */}
                            <AddToPlaylistButton playlists={playlists} video={video} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default YoutubeVideoSnippets;
