import React from "react";
import DownloadsGraph from "@/app/components/YMDashboard/YMDashboardStats/DownloadsGraph";
import ListeningRepartitionGraph from "@/app/components/YMDashboard/YMDashboardStats/ListeningRepartitionGraph";
import ArtistsVariety from "@/app/components/YMDashboard/YMDashboardStats/ArtistsVariety";
import TimeListenedGraph from "@/app/components/YMDashboard/YMDashboardStats/TimeListenedGraph";
import ListeningPieChart from "@/app/components/YMDashboard/YMDashboardStats/ListeningPieChart";
import {DownloadMediaInterface} from "@/app/types/skit";

/**
 * Returns the downloaded tracks
 * @returns {Promise<object>}
 */
async function getDownloadedTracks() {
    const response = await fetch(`/api/v1/extract/storage/v1/downloads_json`);
    const dataText = await response.text();

    if(dataText !== '' && dataText !== null && dataText !== undefined) {
        return JSON.parse(dataText);
    }
    return null;
}

/**
 * Returns the saved playlists
 * @returns {Promise<object>}
 */
async function getSavedPlaylists() {
    const response = await fetch(`/api/v1/extract/storage/v1/playlists_json`);
    const dataText = await response.text();

    if(dataText !== '' && dataText !== null && dataText !== undefined) {
        return JSON.parse(dataText);
    }
    return null;
}

/**
 * Returns the metadata
 * @returns {Promise<object>}
 */
async function getPlayMetadata() {
    const response = await fetch(`/api/v1/extract/storage/v1/playMetadata_json`);
    const dataText = await response.text();

    if(dataText !== '' && dataText !== null && dataText !== undefined) {
        return JSON.parse(dataText);
    }

    return null;
}

/**
 * The download button component
 *
 * @param videoID
 * @constructor
 */
const YMDashboardStats: React.FC = () => {

    const [savedPlaylists, setSavedPlaylists] = React.useState<DownloadMediaInterface[]>([]);
    const [downloadedTracks, setDownloadedTracks] = React.useState<DownloadMediaInterface[]>([]);
    const [playMetadata, setPlayMetadata] = React.useState<any[]>([]);

    const [timeListened, setTimeListened] = React.useState(0);
    const [timeListenedPercentage, setTimeListenedPercentage] = React.useState(0);

    const [songsListened, setSongsListened] = React.useState(0);
    const [songsListenedPercentage, setSongsListenedPercentage] = React.useState(0);

    const calculateTotalDuration = (sessions: { duration: number }[]) => {
        return sessions.reduce((total, session) => total + session.duration, 0) / 60 / 60;
    };

    const sortedPlayMetadata = [...playMetadata].sort((a, b) => {
        const totalDurationA = calculateTotalDuration(a.listeningSession) * 60;
        const totalDurationB = calculateTotalDuration(b.listeningSession) * 60;
        return totalDurationB - totalDurationA; // Sorting in descending order
    });

    const artistsData = playMetadata.reduce((acc, track) => {
        const totalDuration = calculateTotalDuration(track.listeningSession) * 60; // converting to minutes

        if (! acc[track.artist]) {
            acc[track.artist] = {
                name: track.artist,
                totalDuration,
                artistThumbnailSrc: track.artistThumbnailSrc,
            };
        } else {
            acc[track.artist].totalDuration += totalDuration;
        }

        return acc;
    }, {});

    const sortedArtists = Object.values(artistsData).sort((a: any, b: any) => b.totalDuration - a.totalDuration);

    const totalListeningTime = sortedArtists.reduce((total: number, artist: any) => total + artist.totalDuration, 0);

    React.useEffect(() => {

        const init = async () => {
            const downloadedTracksData = await getDownloadedTracks();
            const savedPlaylistsData = await getSavedPlaylists();
            const playMetadataData = await getPlayMetadata();

            setDownloadedTracks(downloadedTracksData);
            setSavedPlaylists(savedPlaylistsData);

            if (playMetadataData) {
                setPlayMetadata(playMetadataData);
            } else {
                setPlayMetadata([]);  // Set it as an empty array if no data is returned
            }

            let timeListened = 0;
            let timeListenedPercentage = 0;
            let songsListened = 0;
            let songsListenedPercentage = 0;

            if (playMetadataData && playMetadataData.length > 0) {
                playMetadataData.forEach((item: any) => {
                    songsListened += 1;
                    timeListened += item.listeningSession.reduce((total: any, session: any) => total + session.duration, 0) / 60;
                });
                songsListenedPercentage = Math.round((songsListened / 100) * 100);
                timeListenedPercentage = Math.round((timeListened / (24 * 7)) * 100);
            }

            setTimeListened(timeListened);
            setTimeListenedPercentage(timeListenedPercentage);

            setSongsListened(songsListened);
            setSongsListenedPercentage(songsListenedPercentage);
        }

        init();

    }, []);

    return(
        <div className="pt-6 px-4">

            {/* Cards section 1 */}
            <div className="mb-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                {/* First card */}
                <div className="bg-white dark:bg-gray-600 shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">{timeListened.toFixed(1)} Minutes</span>
                            <h3 className="text-base font-normal text-gray-500">Time listened this week</h3>
                        </div>
                        <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                            {timeListenedPercentage}%
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Second card */}
                <div className="bg-white dark:bg-gray-600 shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                              {downloadedTracks && (Object.entries(downloadedTracks).filter(([i, a]) => new Date(a.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length)|| 0} Tracks
                          </span>
                            <h3 className="text-base font-normal text-gray-500">Downloaded this week</h3>
                        </div>
                        <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                            {downloadedTracks && ((Object.entries(downloadedTracks).filter(([_, a]) => new Date(a.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length / Object.entries(downloadedTracks).length) * 100 || 0).toFixed(1) || 0}%
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Third card */}
                <div className="bg-white dark:bg-gray-600 shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">{songsListened}</span>
                            <h3 className="text-base font-normal text-gray-500">Tracks listened this week</h3>
                        </div>
                        <div className="ml-5 w-0 flex items-center justify-end flex-1 text-red-500 text-base font-bold">
                            {songsListenedPercentage}%
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard: first 2 square cards */}
            <div className="mb-4 w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {/* Card: Sales this week */}
                <div className="bg-white dark:bg-gray-600 shadow rounded-lg p-4 sm:p-6 xl:p-8  2xl:col-span-2">
                    <div id="listeningRepartition-chart">
                        <ListeningRepartitionGraph playMetadata={playMetadata ?? []} />
                    </div>
                </div>

                {/* Card: Most listened artists & tracks */}
                <div className="bg-white dark:bg-gray-600 shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Most listened</h3>
                            <span className="text-base font-normal text-gray-500">The artists and music you listen to the most</span>
                        </div>
                        <div className="flex-shrink-0" style={{display: "none", visibility: "hidden"}}>
                            <a href="#" className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2">View all</a>
                        </div>
                    </div>
                    <div className="flex flex-col mt-8">
                        <div className="overflow-x-auto rounded-lg">
                            <div className="align-middle inline-block min-w-full">
                                <div className="shadow overflow-hidden sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Artist or track
                                            </th>
                                            <th
                                                scope="col"
                                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Minutes listened
                                            </th>
                                            <th
                                                scope="col"
                                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Plays
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-600">
                                        {sortedPlayMetadata.slice(0, 5).map((track, index) => {
                                            // Calculate total duration for the track in minutes
                                            const totalDurationInMinutes = (calculateTotalDuration(track.listeningSession) * 60).toFixed(2);

                                            // Count how many times the track.title and track.artist appears in playMetadata
                                            const plays = playMetadata.filter(
                                                (item) => item.title === track.title && item.artist === track.artist
                                            ).length;

                                            return (
                                                <tr key={index}>
                                                    <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                                                        <img
                                                            className="w-8 h-8 rounded-full inline-block mr-3"
                                                            src={track.artistThumbnailSrc}
                                                            alt={track.artist}
                                                        />
                                                        {track.title} by <span className="font-semibold">{track.artist}</span>
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                                                        {totalDurationInMinutes} min
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {plays} plays
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4 w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Downloads Graph */}
                <DownloadsGraph  downloads={downloadedTracks}/>

                {/* Time Listened Graph */}
                <TimeListenedGraph playMetadata={playMetadata ?? []} />
            </div>

            <div className="mb-4 w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Artists Variety */}
                <ArtistsVariety playMetadata={playMetadata ?? []} />

                {/* Listening Pie Chart */}
                <ListeningPieChart playMetadata={playMetadata ?? []} />
            </div>

            {/* Latest customers section */}
            <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
                {/* Latest customers card */}
                <div className="bg-white dark:bg-gray-600 shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold leading-none text-gray-900">Top artists</h3>
                        <a style={{display: "none", visibility: "hidden"}} href="#" className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex items-center p-2">
                            View all
                        </a>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200">
                            {sortedArtists.slice(0, 20).map((track: any, index) => (
                                <li key={index} className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={track.artistThumbnailSrc}
                                                alt={track.name}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{track.name}</p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {track.totalDuration.toFixed(2)} minutes listened
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                            {track.totalDuration.toFixed(2)} min
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Usage trend */}
                <div className="bg-white dark:bg-gray-600 shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <h3 className="text-xl leading-none font-bold text-gray-900 mb-10">Usage trend</h3>
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <tbody className="divide-y divide-gray-100">
                            {sortedArtists.slice(0, 20).map((track: any, index) => {
                                const percentage = ((track.totalDuration / totalListeningTime) * 100).toFixed(2);
                                return (
                                    <tr key={index} className="text-gray-500">
                                        <th className="border-t-0 px-4 align-middle text-sm font-normal whitespace-nowrap p-4 text-left">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={track.artistThumbnailSrc}
                                                    alt={track.name}
                                                />
                                                <span className="ml-2">{track.name}</span>
                                            </div>
                                        </th>
                                        <td className="border-t-0 px-4 align-middle text-xs whitespace-nowrap p-4">
                                            <div className="flex items-center">
                                                <span className="mr-2 text-xs font-medium">{percentage}%</span>
                                                <div className="relative w-full">
                                                    <div className="w-full bg-gray-200 rounded-sm h-2">
                                                        <div
                                                            className="bg-cyan-600 h-2 rounded-sm"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default YMDashboardStats;