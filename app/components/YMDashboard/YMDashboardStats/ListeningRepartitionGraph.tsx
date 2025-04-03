import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ListeningRepartitionGraphProps {
    playMetadata: any;
}

const ListeningRepartitionGraph: React.FC<ListeningRepartitionGraphProps> = ({ playMetadata }) => {
    const chartData = useMemo(() => {
        // Check if playMetadata exists and is an array
        if (!playMetadata || !Array.isArray(playMetadata) || playMetadata.length === 0) {
            return [];
        }

        // Create time slots for every 3 hours
        const timeSlots: Record<string, { listens: number; duration: number }> = {
            "00:00": { listens: 0, duration: 0 },
            "03:00": { listens: 0, duration: 0 },
            "06:00": { listens: 0, duration: 0 },
            "09:00": { listens: 0, duration: 0 },
            "12:00": { listens: 0, duration: 0 },
            "15:00": { listens: 0, duration: 0 },
            "18:00": { listens: 0, duration: 0 },
            "21:00": { listens: 0, duration: 0 },
        };

        // Process all items in the playMetadata array
        playMetadata.forEach(item => {

            if (!item.listeningSession) return;

            let _ = false;
            item.listeningSession.forEach((session: { date: string | number | Date; duration: number }) => {
                const date = new Date(session.date);
                const hour = date.getHours();

                // Determine which 3-hour slot this falls into
                const slotIndex = Math.floor(hour / 3);
                const slotKey = `${(slotIndex * 3).toString().padStart(2, '0')}:00`;

                if (timeSlots[slotKey]) {
                    timeSlots[slotKey].duration += session.duration;
                }

                if(_ === false) {
                    timeSlots[slotKey].listens += 1;
                    _ = true;
                }
            });
        });

        // Convert to array format needed for chart
        return Object.keys(timeSlots).map(time => ({
            time,
            listens: timeSlots[time].listens,
            duration: Number(timeSlots[time].duration.toFixed(2))
        }));
    }, [playMetadata]);

    return (
        <div className="w-full h-96 p-4 bg-white dark:bg-gray-600 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Listening repartition over day</h2>
            {chartData.every(item => item.listens === 0) ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                    No listening data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{fill: '#c9c9c9'}} />
                        <YAxis tick={{fill: '#c9c9c9'}} />
                        <Tooltip />
                        <Bar dataKey="listens" name="Play Count" fill="#82ca9d" barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default ListeningRepartitionGraph;