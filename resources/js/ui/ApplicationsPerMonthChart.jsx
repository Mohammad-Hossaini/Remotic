import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import styled from "styled-components";

// =====================
// 🌟 Custom Tooltip
// =====================
const TooltipCustom = styled.div`
    padding: 5px 10px;
    background: rgba(10, 19, 20, 0.5);
    backdrop-filter: blur(5px);
    font-size: 1.6rem;
    font-weight: bold;
    color: #fff;
    border-radius: 10px;
`;

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <TooltipCustom>
                {label}: {item.value}
            </TooltipCustom>
        );
    }
    return null;
}

// =====================
// 🌟 Fake monthly data
// =====================
const fakeApplicationsPerMonth = [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 9 },
    { month: "Apr", count: 14 },
    { month: "May", count: 20 },
    { month: "Jun", count: 16 },
    { month: "Jul", count: 22 },
    { month: "Aug", count: 19 },
    { month: "Sep", count: 23 },
    { month: "Oct", count: 17 },
    { month: "Nov", count: 21 },
    { month: "Dec", count: 24 },
];

function ApplicationsPerMonthChart({ data = [] }) {
    const chartData = data.length > 0 ? data : fakeApplicationsPerMonth;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
                {/* Grid */}
                <CartesianGrid
                    stroke="var(--color-grey-700)"
                    strokeDasharray="3 5"
                />

                {/* Axes */}
                <XAxis
                    dataKey="month"
                    stroke="var(--color-grey-500)"
                    tick={{ fontSize: 12, fill: "var(--color-grey-600)" }}
                />
                <YAxis
                    stroke="var(--color-grey-500)"
                    tick={{ fontSize: 12, fill: "var(--color-grey-600)" }}
                />

                {/* Tooltip */}
                <Tooltip content={<CustomTooltip />} />

                {/* Bar */}
                <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    barSize={35}
                    fill="var(--color-primary)"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ApplicationsPerMonthChart;
