import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {DownloadMediaInterface} from "@/app/types/skit";

interface DownloadsGraphProps {
    downloads: DownloadMediaInterface[];
}

const DownloadsGraph: React.FC<DownloadsGraphProps> = ({ downloads }) => {
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");

    // Create a structured time series
    const dailyDownloads: Record<string, number> = {};
    const now = new Date();

    if (downloads && typeof downloads === "object") {
        Object.values(downloads).forEach((download) => {
            if (!download?.date || !download?.size) return;

            const dateObj = new Date(download.date);
            const sizeMB = download.size / (1024 * 1024);

            if (period === "daily") {
                // Track by hour (last 12 hours)
                const hour = dateObj.getHours();
                const label = `${hour}:00`; // Example: "14:00"
                dailyDownloads[label] = (dailyDownloads[label] || 0) + sizeMB;
            } else if (period === "weekly") {
                // Track by day of week
                const label = dateObj.toLocaleDateString("en-GB", { weekday: "short" }); // "Mon", "Tue"
                dailyDownloads[label] = (dailyDownloads[label] || 0) + sizeMB;
            } else {
                // Track by month
                const label = dateObj.toLocaleDateString("en-GB", { month: "short" }); // "Jan", "Feb"
                dailyDownloads[label] = (dailyDownloads[label] || 0) + sizeMB;
            }
        });
    }

    // Ensure all expected labels exist (for continuity)
    const fillEmptyLabels = (labels: string[]) => {
        return labels.map((label) => ({
            label,
            mb: dailyDownloads[label] || 0,
        }));
    };

    let chartData: { label: string; mb: number }[] = [];

    if (period === "daily") {
        chartData = fillEmptyLabels(
            Array.from({ length: 12 }, (_, i) => {
                const hour = (now.getHours() - i + 24) % 24;
                return `${hour}:00`;
            }).reverse()
        );
    } else if (period === "weekly") {
        chartData = fillEmptyLabels(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    } else {
        chartData = fillEmptyLabels([
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ]);
    }

    return (
        <div className="w-full h-96 p-4 bg-white dark:bg-gray-600 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">MB downloaded</h2>
                <div className="space-x-2">
                    {["daily", "weekly", "monthly"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p as "daily" | "weekly" | "monthly")}
                            className={`px-3 py-1 rounded ${
                                period === p ? "bg-blue-500 text-white" : "bg-gray-300"
                            }`}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="mb" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DownloadsGraph;
