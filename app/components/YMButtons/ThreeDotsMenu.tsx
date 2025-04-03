import React, { useState } from "react";

interface ThreeDotMenuOptions {
    label: string;
    action: () => void;
}

interface ThreeDotMenuProps {
    options: ThreeDotMenuOptions[];
}

const ThreeDotsMenu: React.FC<ThreeDotMenuProps> = ({ options }) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block">
            {/* Three-dot button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <svg
                    className="w-5 h-5 text-gray-700 dark:text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M10 3a2 2 0 11-4 0 2 2 0 014 0zM10 10a2 2 0 11-4 0 2 2 0 014 0zM10 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            </button>

            {/* Popup Menu (shown when `isOpen` is true) */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">
                        {
                            options.map((option, index) => (
                                <li key={index}>
                                    <button
                                        onClick={option.action}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default ThreeDotsMenu;
