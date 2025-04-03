import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ListeningRepartitionGraphProps {
    playMetadata: any;
}

const DownloadsGraph: React.FC<ListeningRepartitionGraphProps> = ({ playMetadata }) => {
    const [unit, setUnit] = useState<'seconds' | 'minutes' | 'hours'>('seconds'); // Default is 'seconds'

    // Convert duration based on the selected unit
    const convertDuration = (duration: number) => {
        switch (unit) {
            case 'minutes':
                return duration / 60; // Convert to minutes
            case 'hours':
                return duration / 3600; // Convert to hours
            default:
                return duration; // Default is seconds
        }
    };

    const chartData = useMemo(() => {
        // Check if playMetadata exists and is an array
        if (!playMetadata || !Array.isArray(playMetadata) || playMetadata.length === 0) {
            return [];
        }

        // Initialize days of the week
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyData: Record<string, number> = {
            Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
        };

        // Process all items in the playMetadata array
        playMetadata.forEach(item => {
            if (!item.listeningSession) return;

            item.listeningSession.forEach((session: { date: string | number | Date; duration: number }) => {
                const date = new Date(session.date);
                const dayOfWeek = daysOfWeek[date.getDay()]; // Get day of the week (0-6)

                // Add session duration to the corresponding day
                if (weeklyData[dayOfWeek] !== undefined) {
                    weeklyData[dayOfWeek] += session.duration;
                }
            });
        });

        // Convert weeklyData to chartData format and apply the selected unit
        return Object.keys(weeklyData).map(day => ({
            day,
            totalDuration: convertDuration(weeklyData[day]), // Convert to selected unit
        }));
    }, [playMetadata, unit]);

    return (
        <div className="w-full h-96 p-4 bg-white dark:bg-gray-600 rounded-lg shadow-md mb-8">

            <div className="flex flex-row justify-between">
                <h2 className="text-xl font-bold mb-4">Time listened this week</h2>

                {/* Unit switcher */}
                <div className="">
                    <select
                        className="py-1 px-2 border border-gray-300 rounded-md"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as 'seconds' | 'minutes' | 'hours')}
                    >
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalDuration" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DownloadsGraph;
