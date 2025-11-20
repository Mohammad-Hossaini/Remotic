import { useQuery } from "@tanstack/react-query";
import { FaChartBar, FaClipboardList } from "react-icons/fa";
import { HiPaperAirplane } from "react-icons/hi";
import { HiDocumentCheck } from "react-icons/hi2";
import { MdOutlineArrowOutward, MdOutlineFavorite } from "react-icons/md";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useAuth } from "../../../hook/AuthContext";
import { getJobs } from "../../../services/apiAllJobs";
import { getDashboardStats } from "../../../services/apiDashboard";

import LineChart from "../../../ui/LineChart";
import "./JobSeekerDashboard.css";

// Utility function for ordinal suffix
const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

export default function JobSeekerDashboard() {
    const { user } = useAuth();
    const token = user?.token;

    const now = new Date();
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
    const dayNumber = now.getDate();
    const monthName = now.toLocaleDateString("en-US", { month: "long" });
    const year = now.getFullYear();
    const formattedDate = `${dayName}, ${dayNumber}${getOrdinal(
        dayNumber
    )} of ${monthName}, ${year}`;

    const { data: dashboardData } = useQuery({
        queryKey: ["dashboardStats", token],
        queryFn: () => getDashboardStats(token),
        enabled: !!token,
    });

    const { data: all_jobs } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
    });

    const allJobs = all_jobs ? all_jobs.length : 0;

    const total_jobs =
        (dashboardData?.total_favorite_jobs || 0) +
        (dashboardData?.total_applied_jobs || 0);

    const testApplicationsPerDay = [
        { date: "2025-10-01", count: 2 },
        { date: "2025-10-02", count: 5 },
        { date: "2025-10-03", count: 3 },
        { date: "2025-10-04", count: 7 },
    ];

    const testApplicationsPerMonth = [
        { month: "Jan", count: 8 },
        { month: "Feb", count: 12 },
        { month: "Mar", count: 6 },
        { month: "Apr", count: 10 },
    ];

    const applicationsPerDay =
        dashboardData?.charts?.applications_per_day?.length > 0
            ? dashboardData.charts.applications_per_day
            : testApplicationsPerDay;

    const applicationsPerMonth =
        dashboardData?.charts?.applications_per_month?.length > 0
            ? dashboardData.charts.applications_per_month
            : testApplicationsPerMonth;

    return (
        <div className="jobdash-container">
            <div className="jobdash-message-box">
                <h1 className="jobdash-welcome">
                    Welcome back,{" "}
                    <span>
                        {user?.data?.user?.profile?.first_name ||
                            user?.user?.name}{" "}
                        {user?.data?.user?.profile?.last_name}
                    </span>{" "}
                    👋
                </h1>
                <p className="jobdash-date">Today is {formattedDate}</p>
            </div>
            <div className="jobdash-stats-box">
                {/* Box 1 – Favorite Jobs */}
                <div className="jobdash-stat-box favJobs">
                    <div className="jobdash-icon-wrap">
                        <MdOutlineFavorite className="jobdash-icon" />
                    </div>
                    <div>
                        <p className="jobdash-number">
                            0{dashboardData?.total_favorite_jobs || 0}
                        </p>
                        <p className="jobdash-name">Favorite Jobs</p>
                    </div>
                </div>

                {/* Box 2 – Jobs Applied */}
                <div className="jobdash-stat-box jobsApplied">
                    <div className="jobdash-icon-wrap">
                        <HiPaperAirplane className="jobdash-icon" />
                    </div>
                    <div>
                        <p className="jobdash-number">
                            0{dashboardData?.total_applied_jobs || 0}
                        </p>
                        <p className="jobdash-name">Jobs Applied</p>
                    </div>
                </div>

                {/* Box 3 – Total Jobs Available */}
                <div className="jobdash-stat-box totalJobs">
                    <div className="jobdash-icon-wrap">
                        <FaClipboardList className="jobdash-icon" />
                    </div>
                    <div>
                        <p className="jobdash-number">0{total_jobs}</p>
                        <p className="jobdash-name">Total Jobs Available</p>
                    </div>
                </div>

                {/* Box 4 – All Listed Jobs */}
                <div className="jobdash-stat-box allListed">
                    <div className="jobdash-icon-wrap">
                        <HiDocumentCheck className="jobdash-icon" />
                    </div>
                    <div>
                        <p className="jobdash-number">0{allJobs}</p>
                        <p className="jobdash-name">All Listed Jobs</p>
                    </div>
                </div>
            </div>

            <div className="jobdash-charts-section">
                <div className="jobdash-chart-card">
                    <h2 className="jobdash-chart-title">
                        Applications per Day
                       
                    </h2>
                    <h6>
                        <MdOutlineArrowOutward className="arrow" />
                        <span>50% more</span> in 2025
                    </h6>
                    <div className="jobdash-chart-wrapper">
                        <LineChart />
                    </div>
                </div>

                <div className="jobdash-chart-card">
                    <h3 className="jobdash-chart-title">
                        <FaChartBar /> Applications per Month
                    </h3>
                    <div className="jobdash-chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={applicationsPerMonth}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="count"
                                    radius={[6, 6, 0, 0]}
                                    barSize={35}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
