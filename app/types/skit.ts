/**
 * The interface for the downloaded media
 */
export interface DownloadMediaInterface {
    type: string;
    title: string;
    date: string;
    media: VideoSnippetInterface|TrackSnippetInterface;
    size: number;
}

/**
 * The interface for the dashboard settings
 */
export interface DashboardSettingsInterface {
    darkMode: boolean;
    storagePath: string;
    spotifyClientId: string;
    spotifyClientSecret: string;
    googleApiKey: string;
    youtubeCookie: string|undefined;
}

/**
 * The interface for the playlist
 */
export interface PlaylistJsonInterface {
    id: string;
    title: string;
    description: string;
    date: string;
    tracks: TrackSnippetInterface[];
    videos: VideoSnippetInterface[];
}

/**
 * The interface for the playlist record
 */
export interface PlaylistJsonRecordInterface {
    [key: string]: PlaylistJsonInterface;
}

/**
 * The interface for the video snippets
 */
export interface VideoSnippetInterface {
    type: "video";
    id: { videoId: string };
    snippet: {
        title: string;
        thumbnails: { medium: { url: string } };
        channelTitle: string;
        views: string;
        length: string;
        uploadDate: string;
        description: string;
        channel: {
            thumbnails: { medium: { url: string } };
            title: string;
            id: string;
        };
        playbackUrl: string;
        inlineUrl: string;
    };
}

/**
 * The interface for the track snippets
 */
export interface TrackSnippetInterface {
    type: "track";
    href: string;
    id: string;
    name: string; // Name of the track
    album: {
        name: string; // Name of the album
        images: {
            url: string; // URL of the album's cover image
        }[];
    };
    artists: {
        name: string; // Name of the artist
        external_urls: {
            spotify: string; // URL to the artist's Spotify page
        };
    }[];
    external_urls: {
        spotify: string; // URL to the track on Spotify
    };
    popularity?: number; // Optional: Popularity score
    duration_ms?: number; // Optional: Duration in milliseconds
    explicit?: boolean; // Optional: Explicit content flag
}

/**
 * Interface for the search results
 * @todo
 */
export interface SearchResultsInterface {
    youtube: any;
    spotify: any;
    query: string;
    p: number;
}

/**
 * DownloadStatusInterface
 */
export interface DownloadStatusInterface {
    isDownloading: boolean;
    progress: number;
    blobSize: number;
    error: string | null;
}