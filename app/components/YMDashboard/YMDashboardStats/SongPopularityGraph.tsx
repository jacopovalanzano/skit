import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { day: "Mon", mb: 120 },
    { day: "Tue", mb: 200 },
    { day: "Wed", mb: 150 },
    { day: "Thu", mb: 300 },
    { day: "Fri", mb: 250 },
    { day: "Sat", mb: 400 },
    { day: "Sun", mb: 320 },
];

const DownloadsGraph = () => {
    return (
        <div className="w-full h-96 p-4 bg-white dark:bg-gray-600 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">MB Downloaded This Week</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="mb" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DownloadsGraph;
