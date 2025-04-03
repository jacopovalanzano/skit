import React, {useEffect, useRef, useState} from "react";
import YMDashboardSidebar from "@/app/components/YMDashboard/YMDashboardSidebar";
import YMDashboardNavbar from "@/app/components/YMDashboard/YMDashboardNavbar";
import YMDashboardSearch from "@/app/components/YMDashboard/YMDashboardSearch/YMDashboardSearch";
import YMDashboardPlaylists from "@/app/components/YMDashboard/YMDashboardPlaylists/YMDashboardPlaylists";
import YMDashboardDownloads from "@/app/components/YMDashboard/YMDashboardDownloads/YMDashboardDownloads";
import YMDashboardSettings from "@/app/components/YMDashboard/YMDashboardSettings/YMDashboardSettings";
import YMDashboardStats from "@/app/components/YMDashboard/YMDashboardStats/YMDashboardStats";
import DashboardYoutubeSearch from "@/app/components/YMDashboard/YMDashboardSearch/DashboardYoutubeSearch";
import DashboardSpotifySearch from "@/app/components/YMDashboard/YMDashboardSearch/DashboardSpotifySearch";
import {
    DashboardSettingsInterface,
    PlaylistJsonRecordInterface,
    SearchResultsInterface, TrackSnippetInterface,
    VideoSnippetInterface
} from "@/app/types/skit";
import VideoPlayer from "@/app/components/YMVideoPlayer/VideoPlayer";

interface YMDashboardProps {
    settings: DashboardSettingsInterface
}

/**
 * The download button component
 */
const YMDashboard: React.FC<YMDashboardProps> = ({settings}) => {

    /**
     * The current tab: used to display the correct dashboard component
     */
    const [currentTab, setCurrentTab] = useState("search");

    /**
     * The list of playlists
     */
    const [playlists, setPlaylists] = useState<PlaylistJsonRecordInterface>({});

    /**
     * The list of spotify tracks
     */
    const [tracks, setTracks] = useState<TrackSnippetInterface[]>([]);

    /**
     * The list of youtube music-video
     */
    const [videos, setVideos] = useState<VideoSnippetInterface[]>([]);

    /**
     * The search query
     */
    const [query, setQuery] = useState("");

    /**
     * The current page
     */
    const [page, setPage] = useState(1);

    /**
     * The current video source
     */
    const [videoSource, setVideoSource] = useState<{title: string, artist: string, artistThumbnailSrc: string, src: string, type: string}|null>(null);

    const [loading, setLoading] = useState(false);

    /**
     * Handle the search bar
     * @param results
     * @return void
     */
    const handleSearchRequest = async (results: SearchResultsInterface) => {
        setTracks(results.spotify.tracks.items);
        setVideos(results.youtube);
        setQuery(results.query);
        setPage(results.p);
    };

    /**
     * Handle the sidebar click: change the current dashboard component
     * @param tab
     * @returns void
     */
    const handleSidebarClick = (tab: string) => {
        setCurrentTab(tab);
    };

    /**
     * Handle the watch video click
     * @param video
     * @param url
     */
    const handleWatchVideoClick = (video: VideoSnippetInterface, url: string) => {
        setVideoSource({
            title: video.snippet.title,
            artist: video.snippet.channelTitle,
            artistThumbnailSrc: video.snippet.channel.thumbnails.medium.url,
            src: url,
            type: 'video/mp4'
        });
    }

    /**
     * Handle the watch video close
     */
    const handleCloseWatchVideo = () => {
        setVideoSource(null);
    }

    /**
     * Handle the add to playlist
     * @param playlists
     */
    const handleAddToPlaylist = async (playlists: PlaylistJsonRecordInterface) => {
        setPlaylists(playlists)
    }

    /**
     * Return all saved playlists
     *
     * @returns {Promise<Playlist[]>}
     */
    async function getAllSavedPlaylists() {
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

    /**
     * Get and/or refresh the list of playlists
     */
    useEffect( () => {
        const init = async () => {
            const playlists = await getAllSavedPlaylists(); // The playlists json
            setPlaylists(playlists) // Set the playlists (updates UI)
        }

        init(); // Initialize
    }, []);

// Function to load more data
    const loadMoreData = async () => {
        if (loading) return; // Prevent multiple calls
        setLoading(true);

        const result = await triggerSearchFunction(page + 1, query);

        // Updating the page after the fetch request
        setPage((prevPage) => {
            const nextPage = prevPage + 1;
            return nextPage;
        });

        let newTracks = result?.tracks ?? [];
        let newVideos = result?.videos ?? [];

        setTimeout(() => {
            let v = [...videos, ...newVideos!];
            let t = [...tracks, ...newTracks!];
            setVideos(v);
            setTracks(t);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        const handleScroll = async () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 10) {
                if(! loading) await loadMoreData();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [page, loading, tracks, videos]);

    /**
     *
     */
    const searchBarRef = useRef<{ triggerSearchFunction: (p: number, q: string) => Promise<{ tracks: TrackSnippetInterface[], videos: VideoSnippetInterface[] }> }>(null);
    /**
     * Trigger the search
     */
    const triggerSearchFunction = async (page: number, query: string) => {

        if(! searchBarRef.current) return;

        return await searchBarRef.current.triggerSearchFunction(page, query);
    };

    /**
     * The download button
     */
    return (
        <div className="h-full">
            {/* Navigation bar */}
            <YMDashboardNavbar ref={searchBarRef} onSearch={handleSearchRequest} />

            {/* Dashboard wrapper */}
            <div className="h-full flex overflow-hidden light:bg-white dark:bg-gray-800 pt-16">

                {/* YMDashboardSidebar */}
                <YMDashboardSidebar sidebarClickHandler={handleSidebarClick} />

                {/* Backdrop */}
                <div className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>

                {/* The actual Dashboard contents */}
                <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">

                    {/* Dashboard main content */}
                    <main className="h-full">
                        {videoSource && <VideoPlayer video={videoSource} playVideoHandle={handleCloseWatchVideo} />}
                        {currentTab === "search" && <YMDashboardSearch playlists={playlists ?? []} videos={videos ?? []} tracks={tracks ?? []} playVideoHandle={handleWatchVideoClick} />}
                        {currentTab === "youtube" && <DashboardYoutubeSearch playlists={playlists ?? []} videos={videos ?? []} playVideoHandle={handleWatchVideoClick} />}
                        {currentTab === "spotify" && <DashboardSpotifySearch playlists={playlists ?? []} tracks={tracks ?? []} />}
                        {currentTab === "playlist" && <YMDashboardPlaylists playlists={playlists ?? []} videos={videos ?? []} tracks={tracks ?? []} addNewPlaylistHandle={handleAddToPlaylist} playVideoHandle={handleWatchVideoClick} />}
                        {currentTab === "settings" && <YMDashboardSettings settings={settings} callback={() => {}} />}
                        {currentTab === "downloads" && <YMDashboardDownloads playlists={playlists ?? []} playVideoHandle={handleWatchVideoClick} />}
                        {currentTab === "stats" && <YMDashboardStats />}
                    </main>

                    {
                        loading &&
                        <div className="bottom-0 left-0 right-0 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    }

                    {/* Copyright */}
                    <p className="text-center text-sm text-gray-500 my-10">
                        &copy; 2025 <a href="#" className="hover:underline" target="_blank">Jacopo Valanzano</a>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default YMDashboard;