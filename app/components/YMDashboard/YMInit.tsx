import React, {useEffect} from "react";
import YMDashboardSettings from "@/app/components/YMDashboard/YMDashboardSettings/YMDashboardSettings";
import YMDashboard from "./YMDashboard";
import {DashboardSettingsInterface} from "@/app/types/skit";

/**
 * The first component of the dashboard.
 */
const YMInit: React.FC = () => {

    /**
     * The settings
     */
    const [settings, setSettings] = React.useState<DashboardSettingsInterface>({
        darkMode: false,
        storagePath: '',
        spotifyClientId: '',
        spotifyClientSecret: '',
        googleApiKey: '',
        youtubeCookie: undefined
    });

    /**
     * Whether the settings are ready (if so, so is the dashboard)
     */
    const [isReady, setIsReady] = React.useState(true);

    /**
     * Validate settings
     * @param obj
     */
    function validateSettings(obj: any): obj is DashboardSettingsInterface {
        return (
            obj &&
            typeof obj.darkMode === "boolean" &&
            typeof obj.storagePath === "string"
        );
    }

    /**
     * @param settings
     */
    function saveSettingsCallback(settings: DashboardSettingsInterface) {
        setSettings(settings);
        setIsReady(true);
    }

    useEffect( () => {

        // Switch dark mode
        if (settings.darkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
            document.documentElement.classList.add("dark");
            document.querySelector('html')!.classList.add("dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.classList.remove("dark");
            document.querySelector('html')!.classList.remove("dark");
        }

        /**
         * Check if the settings are ready
         */
        const init = async () => {
            // Fetch the settings
            const response = await fetch('/api/v1/extract/storage/v1/settings_json');

            if(! response.ok) {
                throw new Error(`Error fetching settings: ${response.status}`);
            }

            let responseJson; // Initialize

            // Get the text (response text may be empty "" and `response.json()` could fail)
            const responseText = await response.text();

            // Make sure response text is not empty
            if(responseText !== '' && responseText !== null && responseText !== undefined) {

                responseJson = JSON.parse(responseText); // Parse text response

                // Validate settings
                if(! validateSettings(responseJson)) {
                    throw new Error('Invalid settings');
                }

                setSettings(responseJson);
                setIsReady(true);

                // Switch dark mode
                if (responseJson.darkMode) {
                    document.documentElement.setAttribute("data-theme", "dark");
                    document.documentElement.classList.add("dark");
                    document.querySelector('html')!.classList.add("dark");
                } else {
                    document.documentElement.setAttribute("data-theme", "light");
                    document.documentElement.classList.remove("dark");
                    document.querySelector('html')!.classList.remove("dark");
                }
                return;
            }

            setIsReady(false);
        }

        init(); // Initialize dashboard
    }, [isReady]);

    /**
     * The download button
     */
    return (
        <main>
            {
                (! isReady) &&
                (
                    <div className="h-full flex overflow-hidden light:bg-white dark:bg-gray-800 pt-16">

                        {/* Backdrop */}
                        <div className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>

                        {/* The actual Dashboard contents */}
                        <div id="main-content" className="h-full w-full flex justify-center items-center bg-gray-50 relative overflow-y-auto">
                            <YMDashboardSettings settings={settings} callback={saveSettingsCallback} />
                        </div>
                    </div>
                )
            }

            { isReady && <YMDashboard settings={settings} /> }
        </main>
    );
};

export default YMInit;