import {useEffect, useRef, useState} from "react";
import Draggable from "react-draggable";

interface VideoPlayerProps {
    video: {
        title?: string;
        artist: string;
        artistThumbnailSrc: string;
        src: string;
        type?: string;
    };
    playVideoHandle: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, playVideoHandle }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const listeningSessions = useRef<{ date: string; duration: number }[]>([]);

    const lastTimeRef = useRef(0);
    /**
     * Close the player
     */
    async function closePlayer() {
        setIsClosed(true);
        playVideoHandle();

        // Create the listening data
        const data = {
            listeningSession: listeningSessions.current,
            title: video.title,
            artist: video.artist ?? null,
            artistThumbnailSrc: video.artistThumbnailSrc,
            type: video.type,
        }

        // Save the listened time & metadata
        const result = await fetch("/api/v1/update/storage/v1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({key: "playMetadata_json", value: data})
            }
        );

        if(! result.ok) {
            throw new Error(`Error saving metadata: ${result.status}`);
        }
    };

    /**
     * Play or pause the video
     */
    function togglePlay() {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(! isPlaying);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            // Save session before switching video
            if (listeningSessions.current.length > 0) {

                const saveData = async () => {
                    // Create the listening data
                    const data = {
                        listeningSession: listeningSessions.current,
                        title: video.title,
                        artist: video.artist ?? null,
                        artistThumbnailSrc: video.artistThumbnailSrc,
                        type: video.type,
                    }

                    // Save the listened time & metadata
                    const result = await fetch("/api/v1/update/storage/v1", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({key: "playMetadata_json", value: data})
                        }
                    );

                    if(! result.ok) {
                        throw new Error(`Error saving metadata: ${result.status}`);
                    }
                }

                saveData();
            }

            videoRef.current.pause();
            videoRef.current.load(); // Force reloading the new video
            setIsPlaying(false);
            listeningSessions.current = []; // Reset session tracking for new video
        }
    }, [video.src]);

    useEffect(() => {

        if (!videoRef.current) return;

        const video_ = videoRef.current;

        const handleTimeUpdate = () => {
            if (! video_.paused && ! video_.seeking) {

                const deltaTime = video_.currentTime - lastTimeRef.current;

                if (deltaTime > 0) {
                    lastTimeRef.current = video_.currentTime;

                    listeningSessions.current.push({
                        date: new Date().toISOString(),
                        duration: deltaTime,
                    });
                }
            }
        };

        const handlePlay = () => {
            lastTimeRef.current = video_.currentTime; // Set the initial lastTime properly
        };

        video_.addEventListener("timeupdate", handleTimeUpdate);
        video_.addEventListener("play", handlePlay);

        return () => {
            const closing = async () => {
                video_.removeEventListener("timeupdate", handleTimeUpdate);
                video_.removeEventListener("play", handlePlay);
            }

            closing();
        };
    }, [video]);


    if (isClosed) return null;

    return (
        <Draggable>
            <div className="z-50 cursor-pointer fixed bottom-4 right-4 bg-white dark:bg-blue-800 dark:text-white shadow-lg rounded-lg p-4 w-80">

                {/* Video player top bar */}
                <div className="flex flex-row justify-between items-center">
                    <span className="font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                        {video.title || "Video Player"}
                    </span>
                    <div className="flex flex-row gap-3">
                        <div
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="flex items-center justify-center w-5 h-5 bg-gray-700 text-white rounded shadow-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            {/* Mock SVG - Replace with your own */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={isMinimized ? "M12 5v14M5 12h14" : "M12 5v14"} /> {/* Example: toggle between plus and minus */}
                            </svg>
                        </div>
                        <div
                            onClick={closePlayer}
                            className="flex items-center justify-center w-5 h-5 bg-red-600 text-white rounded shadow-md hover:bg-red-700 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            {/* Mock SVG - Replace with your own */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 6l12 12M18 6L6 18" /> {/* Example: X shape */}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* The actual video & play/pause button */}
                {! isMinimized && (
                    <>
                        <video ref={videoRef} className="w-full rounded-lg shadow-lg mt-2" controls>
                            <source src={video.src} type={video.type || "video/mp4"} />
                            Your browser does not support the video tag.
                        </video>
                        <button onClick={togglePlay} className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                    </>
                )}
            </div>
        </Draggable>
    );
};

export default VideoPlayer;
