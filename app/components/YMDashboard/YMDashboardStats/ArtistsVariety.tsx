import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ArtistsVarietyProps {
    playMetadata: any;
}

const ArtistsVariety: React.FC<ArtistsVarietyProps> = ({ playMetadata }) => {
    const chartData = useMemo(() => {
        // Check if playMetadata exists and is an array
        if (!playMetadata || !Array.isArray(playMetadata) || playMetadata.length === 0) {
            return [];
        }

        // Create a map to track artists by day
        const artistsByDay: Record<string, { uniqueArtists: Set<string>; totalSessions: number; totalDuration: number; }> = {};

        // Process all items in the playMetadata array
        playMetadata.forEach(item => {
            if (!item.listeningSession || !item.artist) return;

            let _ = false;
            item.listeningSession.forEach((session: { date: string | number | Date; duration: any; }) => {
                const date = new Date(session.date);
                // Format the date to include month and day to differentiate between days
                const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                if (!artistsByDay[day]) {
                    artistsByDay[day] = {
                        uniqueArtists: new Set(),
                        totalSessions: 0,
                        totalDuration: 0
                    };
                }

                artistsByDay[day].uniqueArtists.add(item.artist);
                artistsByDay[day].totalDuration += session.duration;

                if(!_) {
                    _ = true;
                    artistsByDay[day].totalSessions += 1;
                }
            });
        });

        // Convert to array format needed for chart and sort by date
        const result = Object.keys(artistsByDay).map(day => ({
            day,
            artistCount: artistsByDay[day].uniqueArtists.size,
            sessionCount: artistsByDay[day].totalSessions,
            duration: Number((artistsByDay[day].totalDuration).toFixed(2)),
            // Store original date for sorting
            dateObj: new Date(day)
        }));

        // Sort by date
        return result.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
            .map(item => {
                // Remove the dateObj property as it's not needed for the chart
                const { dateObj, ...rest } = item;
                return rest;
            });
    }, [playMetadata]);

    // Add dummy data if we only have one data point to avoid vertical line
    const displayData = useMemo(() => {
        if (chartData.length === 1) {
            const point = chartData[0];
            // Add a dummy point before and after with zero values
            return [
                { day: "Previous", artistCount: 0, sessionCount: 0, duration: 0 },
                point,
                { day: "Next", artistCount: 0, sessionCount: 0, duration: 0 }
            ];
        }
        return chartData;
    }, [chartData]);

    return (
        <div className="w-full h-96 p-4 bg-white dark:bg-gray-600 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Artist listening activity</h2>
            {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                    No listening data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="artistCount"
                            name="Unique Artists"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="duration"
                            name="Duration (sec)"
                            stroke="#ff7300"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default ArtistsVariety;