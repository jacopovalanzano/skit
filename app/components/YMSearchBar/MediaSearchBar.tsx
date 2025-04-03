import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {SearchResultsInterface, TrackSnippetInterface, VideoSnippetInterface} from "@/app/types/skit";

const GOOGLE_API_KEY = "";

/**
 * Interface for the MediaSearchBar component
 */
interface MediaSearchBarProps {
    onSearch: (results: SearchResultsInterface) => void;
}

/**
 * Interface for the search status
 */
interface SearchStatus {
    isSearching: boolean;
    error: string | null;
}

/**
 * Obsolete function to search YouTube
 * @param query
 * @param setSearchStatus
 */
async function searchYoutubeGoogleapis(
    query: string,
    setSearchStatus: React.Dispatch<React.SetStateAction<SearchStatus>>
)
{
    setSearchStatus({ isSearching: true, error: null });

    const url =
        "https://www.googleapis.com/youtube/v3/search?" +
        "part=snippet" +
        `&q=${encodeURIComponent(query)}` +
        "&type=video" +
        "&maxResults=100" +
        "&order=relevance" +
        // Channel id could be used "&channelId=UCX6OQ3DkcsbYNE6H8uQQuVA" +
        "&relevanceLanguage=en" + // Prioritize English results
        "&videoDefinition=any" + // Include all video qualities
        "&videoEmbeddable=true" + // Ensure videos can be embedded (optional)
        "&safeSearch=moderate" +
        "&topicId=/m/04rlf" +  // Filter for Music
        `&key=${GOOGLE_API_KEY}`;
    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        setSearchStatus({ isSearching: false, error: null });

        return data.items; // Returns an array of video results
    } catch (error: any) {
        setSearchStatus({ isSearching: false, error: error.message });
        return { error: error.message };
    }
}

/**
 * Searches YouTube using the YouTube Data API:
 * it sends a request to our special proxy server.
 *
 * @param query
 * @param page
 */
async function searchYouTube(query: string, page: number = 1) {
    const url = `/api/v1/search/video/youtube/v1?query=${encodeURIComponent(query)}&p=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
    }
    const data = await response.json()

    return data.items;
};

/**
 * Searches Spotify using the Spotify API
 *
 * @param query
 * @param page
 * @param spotifyClientId
 * @param spotifyClientSecret
 */
async function searchSpotify(query: string, page: number = 1, spotifyClientId: string, spotifyClientSecret: string) {
    const url = `/api/v1/search/music/spotify/v1?query=${encodeURIComponent(query)}&p=${page}&clientId=${spotifyClientId}&clientSecret=${spotifyClientSecret}`;
    const response = await fetch(url);
    if (! response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
    }
    return await response.json();
};

// Define the type of the ref we will forward
interface MediaSearchBarRef {
    triggerSearchFunction: (p: number, q: string) => Promise<{ tracks: TrackSnippetInterface[], videos: VideoSnippetInterface[] }|undefined>;
}

// Forward ref with proper typing
const MediaSearchBar = forwardRef<MediaSearchBarRef, MediaSearchBarProps>(({ onSearch }, ref) => {

    const [spotifyClientId, setSpotifyClientId] = useState<string>('');
    const [spotifyClientSecret, setSpotifyClientSecret] = useState<string>('');

    /**
     * Search term (user input)
     */
    const [searchTerm, setSearchTerm] = useState<string>('');

    /**
     * The current page (for pagination)
     */
    const [page, setPage] = useState<number>(1);

    /**
     * Whether the search is in progress
     */
    const [searchStatus, setSearchStatus] = useState<SearchStatus>({
        isSearching: false,
        error: null,
    });

    /**
     * @param e
     */
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
    };

    /**
     * @param e
     */
    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(e.target.value);
    };

    /**
     * Handle search button click
     */
    async function handleSearchClick() {
        if (! searchTerm) {
            setSearchStatus({ ...searchStatus, error: 'Please enter a term' });
            return;
        }

        const youtubeResults = await searchYouTube(searchTerm, );
        const spotifyResults = await searchSpotify(searchTerm, 1, spotifyClientId, spotifyClientSecret);

        // Call the onSearch callback
        onSearch({
            youtube: youtubeResults,
            spotify: spotifyResults,
            query: searchTerm,
            p: 1
        });
    };

    async function handleSearchPagination(p:number, q:string) {
        if(! searchTerm) {
            setSearchStatus({ ...searchStatus, error: 'Please enter a term' });
            return;
        }

        const youtubeResults: VideoSnippetInterface[] = await searchYouTube(searchTerm, p);
        const spotifyResponse = await searchSpotify(searchTerm, p, spotifyClientId, spotifyClientSecret);
        const spotifyResults: TrackSnippetInterface[] = spotifyResponse.tracks.items

        return { videos: youtubeResults, tracks: spotifyResults };
    }

    useImperativeHandle(ref, () => ({
        triggerSearchFunction: async (p: number, q: string) => {
            return await handleSearchPagination(p, q);
        },
    }))

    useEffect(() => {
        const fetchSpotifyCredentials = async () => {
            try {
                const response = await fetch('/api/v1/extract/storage/v1/settings_json');
                const data = await response.json();
                setSpotifyClientId(data.spotifyClientId);
                setSpotifyClientSecret(data.spotifyClientSecret);
            } catch (error) {
                console.error('Error fetching Spotify credentials:', error);
            }
        }

        fetchSpotifyCredentials();
    });

    return (
        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md border light:border-gray-300 dark:border-gray-900 rounded-full overflow-hidden focus-within:ring-1 focus-within:ring-blue-500">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={searchStatus.isSearching}
                placeholder="Search"
                className="light:bg-white dark:bg-gray-800 light:text-gray-900 dark:text-gray-100 w-full p-2 px-4 text-sm outline-none"
            />
            <button
                onClick={handleSearchClick}
                disabled={searchStatus.isSearching || (! searchTerm)}
                type="submit" className="light:bg-gray-100 dark:bg-gray-700 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600">
                <svg className="w-5 h-5 light:text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"></circle>
                    <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                </svg>
            </button>
        </form>
    );
});

MediaSearchBar.displayName = 'MediaSearchBar';

export default MediaSearchBar;
