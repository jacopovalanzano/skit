import React, {useEffect} from "react";
import {DashboardSettingsInterface} from "@/app/types/skit";

/**
 * YMDashboardSettingsProps
 */
interface YMDashboardSettingsProps {
    settings: DashboardSettingsInterface|null
    callback: (settings: DashboardSettingsInterface) => Promise<void>|void|undefined
}

/**
 * The download button component
 *
 * @constructor
 */
const YMDashboardSettings: React.FC<YMDashboardSettingsProps> = ({ settings , callback}) => {

    const [darkMode, setDarkMode] = React.useState(settings!.darkMode);
    const [storagePath, setStoragePath] = React.useState(settings!.storagePath || '~/Downloads');
    const [spotifyClientId, setSpotifyClientId] = React.useState(settings!.spotifyClientId || '');
    const [spotifySecret, setSpotifySecret] = React.useState(settings!.spotifyClientSecret || '');
    const [googleApiKey, setGoogleApiKey] = React.useState(settings!.googleApiKey || '');
    const [youtubeCookie, setYoutubeCookie] = React.useState(settings!.youtubeCookie || '');
    const [isLoading, setIsLoading] = React.useState(false);

    /**
     * Retrieve the settings
     */
    async function getSettings() {
        return fetch('/api/v1/extract/storage/v1/settings_json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Save the settings
     * @param settings
     */
    async function saveSettings(settings_: DashboardSettingsInterface) {

        // Check if "download path" is valid
        if(! settings_.storagePath) {
            throw new Error('Invalid storage path');
        }

        // Check if "spotify client id" is valid
        if(! settings_.spotifyClientId) {
            throw new Error('Invalid spotify client id');
        }

        // Check if "spotify client secret" is valid
        if(! settings_.spotifyClientSecret) {
            throw new Error('Invalid spotify client secret');
        }

        const response = await fetch('/api/v1/insert/storage/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({key: 'settings_json', value: settings_})
        });

        if(! response.ok) {
            throw new Error(`Error saving settings: ${response.status}`);
        }

        // Update settings
        setDarkMode(settings_.darkMode);
        setStoragePath(settings_.storagePath!);
        setSpotifyClientId(settings_.spotifyClientId!)
        setSpotifySecret(settings_.spotifyClientSecret!)
        setGoogleApiKey(settings_.googleApiKey!);
        setYoutubeCookie(settings_.youtubeCookie!);

        settings = settings_;
        callback(settings_); // Callback
        setIsLoading(false); // Stop loading
    }

    useEffect(() => {
        const init = async () => {
            const response = await getSettings();
            const settingsText = await response.text();

            if(settingsText !== '' && settingsText !== null && settingsText !== undefined) {
                settings = JSON.parse(settingsText);
            } else {
                settings = {
                    darkMode: darkMode,
                    storagePath: storagePath,
                    spotifyClientId: spotifyClientId,
                    spotifyClientSecret: spotifySecret,
                    googleApiKey: googleApiKey,
                    youtubeCookie: undefined
                } // Initialize
            }

            if (settings !== null && settings !== undefined) {
                setDarkMode(settings.darkMode);
                setStoragePath(settings.storagePath);
                setSpotifyClientId(settings.spotifyClientId);
                setSpotifySecret(settings.spotifyClientSecret);
                setGoogleApiKey(settings.googleApiKey);
                setYoutubeCookie(settings.youtubeCookie || '');
            }
        }

        init();
    }, [settings]);

    useEffect(() => {

        // Switch dark mode
        if (darkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
            document.documentElement.classList.add("dark");
            document.querySelector('html')!.classList.add("dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.classList.remove("dark");
            document.querySelector('html')!.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className="pt-6 px-4 md:px-10">
            {
                <div className="min-h-screen items-start justify-center">

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16">
                        {/* Storage path */}
                        <div className="flex flex-col items-start justify-between mb-10">
                            <p className="text-2xl text-gray-600">Storage Path<span className="text-red-500">*</span></p>
                            <p className="text-sm text-gray-600">Where to store your downloads and metadata.</p>
                            <input
                                type="text"
                                value={storagePath}
                                onChange={(e) => setStoragePath(e.target.value)}
                                className="mt-5 bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded focus:ring-cyan-600 focus:ring-cyan-600 block w-full p-2.5"
                            />
                        </div>

                        {/* Youtube cookie */}
                        <div className="flex flex-col items-start justify-between mb-10">
                            <p className="text-2xl text-gray-600">YouTube cookie string</p>
                            <p className="text-sm text-gray-600">The cookie can help you avoid being rate limited.</p>
                            <textarea
                                value={youtubeCookie}
                                onChange={(e) => setYoutubeCookie(e.target.value)}
                                className="mt-5 bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded focus:ring-cyan-600 focus:ring-cyan-600 block w-full p-2.5"
                            />
                        </div>

                        {/* Spotify API keys */}
                        <div className="flex flex-col items-start justify-between mb-10">
                            <p className="text-2xl text-gray-600">Spotify Client ID<span className="text-red-500">*</span></p>
                            <p className="text-sm text-gray-600">Required to browse the Spotify library.</p>
                            <textarea
                                value={spotifyClientId}
                                onChange={(e) => setSpotifyClientId(e.target.value)}
                                className="mt-5 bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded focus:ring-cyan-600 focus:ring-cyan-600 block w-full p-2.5"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-between mb-10">
                            <p className="text-2xl text-gray-600">Spotify Client Secret<span className="text-red-500">*</span></p>
                            <p className="text-sm text-gray-600">Required to browse the Spotify library.</p>
                            <textarea
                                value={spotifySecret}
                                onChange={(e) => setSpotifySecret(e.target.value)}
                                className="mt-5 bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded focus:ring-cyan-600 focus:ring-cyan-600 block w-full p-2.5"
                            />
                        </div>

                        {/* Google API key */}
                        <div className="flex flex-col items-start justify-between mb-10">
                            <p className="text-2xl text-gray-600">Google API Key</p>
                            <p className="text-sm text-gray-600">Required to download restricted videos.</p>
                            <textarea
                                value={googleApiKey}
                                onChange={(e) => setGoogleApiKey(e.target.value)}
                                className="mt-5 bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded focus:ring-cyan-600 focus:ring-cyan-600 block w-full p-2.5"
                            />
                        </div>

                        {/* Dark mode */}
                        <div className="flex flex-col items-start justify-between mb-10">
                            <p className="text-2xl text-gray-600">Dark Mode</p>
                            <p className="text-sm text-gray-600">Enable or disable dark mode.</p>

                            {/* Switch */}
                            <label className="mt-5 flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={(e) => setDarkMode(e.target.checked)}
                                    className="hidden"
                                />
                                <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${darkMode ? "bg-black" : "bg-gray-300"}`}>
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${darkMode ? "translate-x-5" : ""}`}
                                    ></div>
                                </div>
                            </label>
                        </div>

                        {/* Save button */}
                        <div className="w-full flex justify-center mb-10">
                            {/* Save button */}
                            <button
                                onClick={async () => {
                                    setIsLoading(true);
                                    await saveSettings({
                                        darkMode: darkMode,
                                        storagePath: storagePath,
                                        spotifyClientId: spotifyClientId,
                                        spotifyClientSecret: spotifySecret,
                                        googleApiKey: googleApiKey,
                                        youtubeCookie: youtubeCookie
                                    } as DashboardSettingsInterface);
                                }}
                                type="button"
                                className="margin-right-auto mt-10 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                {
                                    isLoading ?
                                        <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        </svg>
                                        : "Save"
                                }
                            </button>
                        </div>

                    </div>
                </div>
            }
        </div>
    );
};

export default YMDashboardSettings;