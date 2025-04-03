import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
    "#0088FE", // Blue
    "#FF0000", // Red
    "#FFBB28", // Yellow
    "#34D399", // Light Green
    "#F472B6", // Pink
    "#3B82F6", // Bright Blue
    "#10B981", // Emerald Green
    "#F59E0B", // Amber
    "#9333EA", // Purple
    "#2563EB", // Blue (Darker)
    "#F43F5E", // Red (Darker)
    "#6B7280", // Gray
    "#E5E7EB", // Light Gray
    "#059669", // Green (Dark)
    "#8B5CF6", // Violet
    "#D97706", // Orange
    "#EF4444", // Red (Lighter)
    "#14B8A6", // Teal
    "#9CA3AF", // Slate Gray
];

interface ListeningPieChartProps {
    playMetadata: any;
}

const ListeningPieChart: React.FC<ListeningPieChartProps> = ({ playMetadata }) => {

    const trackDurations = playMetadata.reduce((acc: { [key: string]: number }, track: any) => {
        const key = `${track.title} by ${track.artist}`;
        const totalDuration = track.listeningSession.reduce((sum: any, session: { duration: any; }) => sum + session.duration, 0).toFixed(2);
        acc[key] = (acc[key] || 0) + totalDuration;
        return acc;
    }, {});

    const data = Object.entries(trackDurations).map(([name, value]) => ({
        name,
        value: value as number * 60, // Convert to minutes
    }));

    return (
        <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Listening distribution</h2>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ListeningPieChart;
