import React from "react";
import {
    DownloadMediaInterface,
    PlaylistJsonRecordInterface,
    TrackSnippetInterface,
    VideoSnippetInterface
} from "@/app/types/skit";
import YoutubeVideoSnippets from "@/app/components/YMSnippets/YoutubeVideoSnippets";

/**
 * YMDashboardDownloadsProps
 */
interface YMDashboardDownloadsProps {
    playlists: PlaylistJsonRecordInterface;
    playVideoHandle: (video: VideoSnippetInterface, url: string) => void;
}

interface DownloadObjectRecordInterface {
    [key: string]: DownloadMediaInterface;
}

async function retrieveDownloadsList() {
    return fetch('/api/v1/extract/storage/v1/downloads_json');
}

/**
 * The download button component
 *
 * @constructor
 */
const YMDashboardDownloads: React.FC<YMDashboardDownloadsProps> = ({  playlists, playVideoHandle}) => {

    const [downloadsList, setDownloadsList] = React.useState<DownloadObjectRecordInterface>({});
    const [localTracks, setLocalTracks] = React.useState<TrackSnippetInterface[]>([]);
    const [localVideos, setLocalVideos] = React.useState<VideoSnippetInterface[]>([]);

    React.useEffect(() => {

        retrieveDownloadsList().then(async res => {
            let data: DownloadObjectRecordInterface = {};
            const dataText = await res.text();

            if(dataText !== '' && dataText !== undefined && dataText !== null) {
                data = JSON.parse(dataText);
                setDownloadsList(data);
            }

            let tracks_: TrackSnippetInterface[] = [];
            let videos_: VideoSnippetInterface[] = [];

            Object.entries(data).forEach(([downloadId, download]) => {
                if(download.type === 'track') {
                    tracks_.push(download.media as TrackSnippetInterface);
                }

                if(download.type === 'video') {
                    videos_.push(download.media as VideoSnippetInterface);
                }
            });

            setLocalVideos(videos_);
            setLocalTracks(tracks_);

        })

    }, []);

    return (
        <div className="pt-6 px-4 min-h-screen">
            {
                ((Object.entries(downloadsList).length) === 0) &&
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-2xl text-gray-500">No media found.</p>
                </div>
            }

            <YoutubeVideoSnippets playlists={playlists} videos={localVideos} playVideoHandle={playVideoHandle}  />
        </div>
    );
};

export default YMDashboardDownloads;