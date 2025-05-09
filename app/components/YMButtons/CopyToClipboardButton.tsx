import { useState } from "react";

const CopyToClipboardButton = ({ stringToCopy }: { stringToCopy: string }) => {

    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(stringToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Hide message after 2 sec
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div className="relative inline-flex justify-center items-center">
            <button
                onClick={copyToClipboard}
                type="button"
                className="p-1 bg-gray-500 text-white rounded-full transition-all duration-300 hover:bg-gray-600 active:scale-90"
            >
                <svg
                    fill={"#ffffff"}
                    height="12px"
                    width="12px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 458 458"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <g>
                                <path d="M339.588,314.529c-14.215,0-27.456,4.133-38.621,11.239l-112.682-78.67c1.809-6.315,2.798-12.976,2.798-19.871c0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764,8.356,26.133,13.286,41.662,13.286c39.79,0,72.047-32.257,72.047-72.047C411.634,32.258,379.378,0,339.588,0c-39.79,0-72.047,32.257-72.047,72.047c0,5.255,0.578,10.373,1.646,15.308l-112.424,78.491c-10.974-6.759-23.892-10.666-37.727-10.666c-39.79,0-72.047,32.257-72.047,72.047s32.256,72.047,72.047,72.047c13.834,0,26.753-3.907,37.727-10.666l113.292,79.097c-1.629,6.017-2.514,12.34-2.514,18.872c0,39.79,32.257,72.047,72.047,72.047c39.79,0,72.047-32.257,72.047-72.047C411.635,346.787,379.378,314.529,339.588,314.529z"></path>
                            </g>
                        </g>
                    </g>
                </svg>
            </button>

            {/* Show popup when copied */}
            {copied && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded shadow-lg transition-opacity duration-300">
                    Link copied
                </div>
            )}
        </div>
    );
};

export default CopyToClipboardButton;
