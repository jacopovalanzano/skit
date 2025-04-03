import React from "react";
import MediaDownloadBar from "@/app/components/YMDownloadBar/MediaDownloadBar";

/**
 * The download button component
 *
 * @param videoID
 * @constructor
 */
const YMDashboardSidebar: React.FC<{sidebarClickHandler: (tab: string) => void}> = ({sidebarClickHandler}) => {

    return (
        <aside id="sidebar" className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75" aria-label="Sidebar">
            <div className="relative flex-1 flex flex-col min-h-0 border-r light:border-gray-200 dark:border-gray-900 light:bg-white dark:bg-gray-800 pt-0">

                {/* Main section */}
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex-1 px-3 light:bg-white dark:bg-gray-800 divide-y space-y-1">
                        {/* Options */}
                        <ul className="space-y-2 pb-2">
                            <li>
                                <form action="#" method="GET" className="lg:hidden">
                                    <label htmlFor="mobile-search" className="sr-only">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                            </svg>
                                        </div>
                                        <input type="text" name="email" id="mobile-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:ring-cyan-600 block w-full pl-10 p-2.5" placeholder="Search" />
                                    </div>
                                </form>
                            </li>
                            <li onClick={() => sidebarClickHandler("spotify")}>
                                <div className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center p-2 group cursor-pointer">
                                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="#1abc1a" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.01 2.019c-5.495 0-9.991 4.496-9.991 9.991 0 5.494 4.496 9.99 9.991 9.99 5.494 0 9.99-4.496 9.99-9.99 0-5.495-4.446-9.991-9.99-9.991zm4.595 14.436c-.199.299-.549.4-.85.201-2.349-1.45-5.296-1.75-8.793-.951-.348.102-.648-.148-.748-.449-.101-.35.149-.648.45-.749 3.795-.85 7.093-.499 9.69 1.1.35.149.4.548.251.848zm1.2-2.747c-.251.349-.7.499-1.051.249-2.697-1.646-6.792-2.148-9.939-1.148-.398.101-.85-.1-.949-.498-.101-.402.1-.852.499-.952 3.646-1.098 8.143-.548 11.239 1.351.3.149.45.648.201.998zm.099-2.799c-3.197-1.897-8.542-2.097-11.59-1.146a.938.938 0 0 1-1.148-.6.937.937 0 0 1 .599-1.151c3.547-1.049 9.392-.85 13.089 1.351.449.249.599.849.349 1.298-.25.35-.849.498-1.299.248z"/>
                                    </svg>
                                    <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">Spotify</span>
                                </div>
                            </li>
                            <li onClick={() => sidebarClickHandler("youtube")}>
                                <div className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center p-2 group cursor-pointer">
                                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22.54 6.42a2.765 2.765 0 0 0-1.945-1.957C18.88 4 12 4 12 4s-6.88 0-8.595.463A2.765 2.765 0 0 0 1.46 6.42C1 8.148 1 11.75 1 11.75s0 3.602.46 5.33a2.765 2.765 0 0 0 1.945 1.958C5.121 19.5 12 19.5 12 19.5s6.88 0 8.595-.462a2.765 2.765 0 0 0 1.945-1.958c.46-1.726.46-5.33.46-5.33s0-3.602-.46-5.33ZM9.75 8.479v6.542l5.75-3.271-5.75-3.271Z" fill="#ff0000"/>
                                    </svg>
                                    <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">YouTube</span>
                                </div>
                            </li>

                            <li onClick={() => sidebarClickHandler("search")}>
                                <div className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer">
                                    <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                    </svg>
                                    <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">Home</span>
                                </div>
                            </li>
                            <li onClick={() => sidebarClickHandler("playlist")}>
                                <div className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center p-2 group cursor-pointer">
                                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                    </svg>
                                    <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">Playlists</span>
                                    <span style={{display: "none", visibility: "hidden"}} className="bg-gray-200 text-gray-800 ml-3 text-sm font-medium inline-flex items-center justify-center px-2 rounded-full">Pro</span>
                                </div>
                            </li>
                            <li onClick={() => sidebarClickHandler("downloads")}>
                                <div className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center p-2 group cursor-pointer">
                                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                                        <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                                    </svg>
                                    <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">Downloads</span>
                                    <span style={{display: "none", visibility: "hidden"}} className="bg-gray-200 text-gray-800 ml-3 text-sm font-medium inline-flex items-center justify-center px-2 rounded-full">Pro</span>
                                </div>
                            </li>
                            <li onClick={() => sidebarClickHandler("stats")}>
                                <div className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center p-2 group cursor-pointer">
                                    <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                    </svg>
                                    <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">Stats</span>
                                </div>
                            </li>
                        </ul>

                        {/* Settings */}
                        <div className="space-y-2 pt-2">
                            <div onClick={() => sidebarClickHandler("settings")} className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition duration-75 flex items-center p-2 cursor-pointer">
                                <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">Settings</span>
                            </div>
                            <a href="https://github.com/jacopovalanzano/ym-dashboard" target="_blank" className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group transition duration-75 flex items-center p-2 cursor-pointer">
                                <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-3 flex-1 whitespace-nowrap light:text-gray-800 dark:text-white-500">Help</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom section (fixed) */}
                <div className="pt-3 pb-5 border-t light:border-gray-200 dark:border-gray-900">
                    <div className="px-4">
                        <p className="ml-1 text-xs font-medium text-gray-500">Quick download</p>
                        <div className="mt-1 grid grid-cols-1 gap-px">
                            <MediaDownloadBar />
                        </div>
                    </div>
                </div>

            </div>
        </aside>
    );
}

export default YMDashboardSidebar;