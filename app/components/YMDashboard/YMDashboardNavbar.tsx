import React, {forwardRef} from "react";
import MediaSearchBar from "@/app/components/YMSearchBar/MediaSearchBar";
import {SearchResultsInterface, TrackSnippetInterface, VideoSnippetInterface} from "@/app/types/skit";

/**
 * The music-video search bar interface to handle the search request
 */
interface VideoSearchbarProps {
    onSearch: (results: SearchResultsInterface) => void;
}

// Define the type of the ref we will forward
interface MediaSearchBarRef {
    triggerSearchFunction: (p: number, q: string) => Promise<{ tracks: TrackSnippetInterface[], videos: VideoSnippetInterface[] }>;
}

/**
 * The download button component
 *
 * @param videoID
 * @constructor
 */
const YMDashboardNavbar = forwardRef<MediaSearchBarRef, VideoSearchbarProps>(({ onSearch }, ref) => {
    return (
        <nav className="bg-white dark:bg-gray-800 border-b light:border-gray-200 dark:border-gray-900 fixed z-30 w-full">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <button id="toggleSidebarMobile" aria-expanded="true" aria-controls="sidebar" className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded">
                            <svg id="toggleSidebarMobileHamburger" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <svg id="toggleSidebarMobileClose" className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                        <a href="#" className="text-xl font-bold flex items-center lg:ml-2.5">
                            <img src="/logo.png" className="h-6 mr-2" alt="Windster Logo" />
                            <span className="self-center whitespace-nowrap">Skit</span>
                        </a>
                        {/* YoutubeSearchBar */}
                        <div className="hidden lg:block lg:pl-32">
                            <MediaSearchBar ref={ref} onSearch={onSearch} />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button id="toggleSidebarMobileSearch" type="button" className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg">
                            <span className="sr-only">Search</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                        <div className="hidden lg:flex items-center">
                            <span className="text-base font-normal text-gray-500 mr-5">Open source ❤️</span>
                        </div>
                        <span className="hidden sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3">
                            <svg className="svg-inline--fa fa-gem -ml-1 mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gem" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M378.7 32H133.3L256 182.7L378.7 32zM512 192l-107.4-141.3L289.6 192H512zM107.4 50.67L0 192h222.4L107.4 50.67zM244.3 474.9C247.3 478.2 251.6 480 256 480s8.653-1.828 11.67-5.062L510.6 224H1.365L244.3 474.9z"></path>
                            </svg>
                            Upgrade to Pro
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
});

YMDashboardNavbar.displayName = 'YMDashboardNavbar';

export default YMDashboardNavbar;