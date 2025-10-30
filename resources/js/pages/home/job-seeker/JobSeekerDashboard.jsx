import { useQuery } from "@tanstack/react-query";
import { FaChartBar } from "react-icons/fa";
import { GrFavorite } from "react-icons/gr";
import {
    HiOutlineBookmark,
    HiOutlineBriefcase,
    HiOutlineClipboardList,
} from "react-icons/hi";
import { MdQueryStats } from "react-icons/md";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import styled from "styled-components";
import { useAuth } from "../../../hook/AuthContext";
import { getJobs } from "../../../services/apiAllJobs";
import { getDashboardStats } from "../../../services/apiDashboard";

// ===== Styled Components =====
const DashboardContainer = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    font-family: "Inter", sans-serif;

    [data-theme="dark"] & {
        background-color: #111827;
        color: #f3f4f6;
    }
`;

const MessageBox = styled.div`
    background: linear-gradient(90deg, #e6f2ef, #f3f4f6);
    padding: 2.5rem 3rem;
    border-radius: var(--radius-xl);
    margin-bottom: 2rem;
    box-shadow: var(--shadow-md);

    [data-theme="dark"] & {
        background: linear-gradient(90deg, #1f2937, #111827);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    }
`;

const WelcomeMessage = styled.h1`
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
    margin-bottom: 0.8rem;

    span {
        color: var(--color-primary);
    }

    [data-theme="dark"] & {
        color: #f3f4f6;
        span {
            color: #34d399;
        }
    }
`;

const DateText = styled.p`
    font-size: 1.6rem;
    color: var(--color-grey-600);
    font-weight: 500;
    letter-spacing: 0.5px;

    [data-theme="dark"] & {
        color: #9ca3af;
    }
`;

const StatisticsBox = styled.div`
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    .box {
        flex: 1 1 220px;
        background: #fff;
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        display: flex;
        align-items: center;
        gap: 1rem;

        .icon {
            font-size: 2.2rem;
            color: var(--color-primary);
        }

        .number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--color-grey-900);
        }

        .name {
            font-size: 1.4rem;
            color: var(--color-grey-600);
        }

        [data-theme="dark"] & {
            background-color: #1f2937;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);

            .icon {
                color: #34d399;
            }

            .number {
                color: #f3f4f6;
            }

            .name {
                color: #9ca3af;
            }
        }
    }
`;

const ChartsSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    .chart-card {
        background: var(--color-grey-0);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-sm);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;

        h3 {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            color: var(--color-grey-900);
            font-size: 1.8rem;
            margin-bottom: 1.5rem;

            svg {
                color: var(--color-primary);
                font-size: 2rem;
            }
        }

        .chart-wrapper {
            width: 100%;
            height: 280px;
        }

        [data-theme="dark"] & {
            background-color: #1f2937;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);

            h3 {
                color: #f3f4f6;
                svg {
                    color: #34d399;
                }
            }
        }
    }

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

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
        <DashboardContainer>
            <MessageBox>
                <WelcomeMessage>
                    Welcome back,{" "}
                    <span>
                        {user?.data?.user?.profile?.first_name ||
                            user?.user?.name}{" "}
                        {user?.data?.user?.profile?.last_name}
                    </span>{" "}
                    👋
                </WelcomeMessage>
                <DateText>Today is {formattedDate}</DateText>
            </MessageBox>

            <StatisticsBox>
                <div className="box favorites">
                    <GrFavorite className="icon" />
                    <div>
                        <p className="number">
                            {dashboardData?.total_favorite_jobs || 0}
                        </p>
                        <p className="name">Favorite Jobs</p>
                    </div>
                </div>

                <div className="box applied">
                    <HiOutlineBookmark className="icon" />
                    <div>
                        <p className="number">
                            {dashboardData?.total_applied_jobs || 0}
                        </p>
                        <p className="name">Jobs Applied</p>
                    </div>
                </div>

                <div className="box total">
                    <HiOutlineClipboardList className="icon" />
                    <div>
                        <p className="number">{total_jobs}</p>
                        <p className="name">Total Jobs Available</p>
                    </div>
                </div>

                <div className="box all">
                    <HiOutlineBriefcase className="icon" />
                    <div>
                        <p className="number">{allJobs}</p>
                        <p className="name">All Listed Jobs</p>
                    </div>
                </div>
            </StatisticsBox>

            <ChartsSection>
                <div className="chart-card">
                    <h3>
                        <MdQueryStats /> Applications per Day
                    </h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={applicationsPerDay}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        color: "#111827",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#087f5b"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>
                        <FaChartBar /> Applications per Month
                    </h3>
                    <div className="chart-wrapper">
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
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        color: "#111827",
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#087f5b"
                                    radius={[6, 6, 0, 0]}
                                    barSize={35}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </ChartsSection>
        </DashboardContainer>
    );
}
