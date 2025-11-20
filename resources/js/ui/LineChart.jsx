
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import CustomToolTip from "./CustomToolTip";

const data = [
    { name: "Saturday", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Sunday", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Monday", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Tuesday", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Wednesday", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Thursday", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Friday", uv: 3490, pv: 4300, amt: 2100 },
];

function LineChart({ isAnimationActive = true }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
                {/* Gradient مطابق primary color پروژه */}
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-primary)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-primary)"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>

                {/* Grid */}
                <CartesianGrid
                    stroke="var(--color-grey-300)"
                    strokeDasharray="1 5"
                    vertical={false}
                />

                {/* X Axis */}
                <XAxis
                    dataKey="name"
                    stroke="var(--color-grey-500)"
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    tick={{ fontSize: 12, fill: "var(--color-grey-600)" }}
                />

                {/* Y Axis */}
                <YAxis
                    stroke="var(--color-grey-500)"
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--color-grey-600)" }}
                />

                {/* Tooltip */}
                <Tooltip content={<CustomToolTip />} />

                {/* Area */}
                <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="var(--color-primary)"
                    fill="url(#colorUv)"
                    fillOpacity={1}
                    strokeWidth={3}
                    isAnimationActive={isAnimationActive}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default LineChart;
