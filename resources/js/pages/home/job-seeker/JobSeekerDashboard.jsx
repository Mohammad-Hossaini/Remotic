import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { FaChartBar, FaClipboardList } from "react-icons/fa";
import { HiPaperAirplane } from "react-icons/hi";
import { HiDocumentCheck } from "react-icons/hi2";
import { MdOutlineArrowOutward, MdOutlineFavorite } from "react-icons/md";
import { useAuth } from "../../../hook/AuthContext";
import { getJobs } from "../../../services/apiAllJobs";
import { getDashboardStats } from "../../../services/apiDashboard";

// Chart.js full imports
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    DoughnutController,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    defaults,
} from "chart.js";

import RecommendedJobsCard from "../../recommend/RecommendedJobsCard";
import "./JobSeekerDashboard.css";

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    DoughnutController,
    Title,
    Tooltip,
    Legend
);

// Global Chart.js defaults
defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = false;
defaults.plugins.title.color = "black";
defaults.font.size = 10;

// JSON Data برای چارت خطی
const interviewData = [
    { label: "Jan", applications_sent: 120, rejected: 30 },
    { label: "Feb", applications_sent: 95, rejected: 25 },
    { label: "Mar", applications_sent: 150, rejected: 40 },
    { label: "Apr", applications_sent: 130, rejected: 35 },
    { label: "May", applications_sent: 160, rejected: 45 },
    { label: "Jun", applications_sent: 140, rejected: 30 },
    { label: "Jul", applications_sent: 125, rejected: 20 },
    { label: "Aug", applications_sent: 135, rejected: 25 },
    { label: "Sep", applications_sent: 110, rejected: 15 },
    { label: "Oct", applications_sent: 145, rejected: 40 },
    { label: "Nov", applications_sent: 100, rejected: 20 },
    { label: "Dec", applications_sent: 155, rejected: 35 },
];

// Data برای چارت دونات (ماهانه)
const monthlyData = [
    { label: "Accepted", value: 850 },
    { label: "Rejected", value: 420 },
    { label: "Pending", value: 210 },
];

const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

export default function JobSeekerDashboard() {
    const { user } = useAuth();

    // console.log("Users skills :", userSkills);
    console.log("Information about user:", user);
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
    const rawUserSkills = user?.data?.user?.profile?.skills ?? []; // ممکن است آرایه یا رشته باشد

    // normalize کردن اسکیل‌های کاربر -> همیشه آرایه از رشته‌ها
    const userSkills = Array.isArray(rawUserSkills)
        ? rawUserSkills.map((s) => String(s).trim().toLowerCase())
        : typeof rawUserSkills === "string"
        ? rawUserSkills.split(",").map((s) => s.trim().toLowerCase())
        : [];

    // اطمینان از اینکه all_jobs همیشه آرایه است (اگر هنوز لود نشده باشد -> [])
    const jobsArray = Array.isArray(all_jobs)
        ? all_jobs
        : all_jobs
        ? Object.values(all_jobs)
        : [];

    // فیلتر ایمن
    const recommendedJobs = jobsArray.filter((job) => {
        if (!job || !job.requirements) return false;

        const jobSkills = String(job.requirements)
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean); // حذف رشته‌های خالی

        // اگر کاربر اصلاً اسکیلی ندارد، می‌خواهیم چه کنیم؟ اینجا با false برمی‌گردیم.
        if (!userSkills.length) return false;

        // حداقل یک مهارت مشترک باشد
        return userSkills.some((skill) => jobSkills.includes(skill));
    });

    // برای دیباگ (اختیاری)
    console.log("all_jobs raw:", all_jobs);
    console.log("normalized userSkills:", userSkills);
    console.log("recommendedJobs:", recommendedJobs);

    // ======= در JSX برای رندر کردن =======
    // دقت کن از arrow implicit return یا return صریح استفاده کنی.
    // (قبلاً داخل map از {} استفاده کرده بودی ولی چیزی return نمی‌شد)
    {
        recommendedJobs.map((job) => (
            <RecommendedJobsCard job={job} key={job.id} />
        ));
    }

    console.log("All the recommended  jobs", all_jobs);

    const allJobs = all_jobs ? all_jobs.length : 0;

    const total_jobs =
        (dashboardData?.total_favorite_jobs || 0) +
        (dashboardData?.total_applied_jobs || 0);

    // 🌙 React state to track dark mode
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.getAttribute("data-theme") === "dark"
    );

    // Detect theme changes dynamically
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "data-theme"
                ) {
                    const newTheme =
                        document.documentElement.getAttribute("data-theme") ===
                        "dark";
                    setIsDarkMode(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);

    // Line Chart options
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: { size: 12 },
                    color: isDarkMode ? "#f3f4f6" : "#111827",
                },
            },
            tooltip: {
                titleColor: isDarkMode ? "#f3f4f6" : "#111827",
                bodyColor: isDarkMode ? "#f3f4f6" : "#111827",
                backgroundColor: isDarkMode ? "#1f2937" : "#fff",
            },
        },
        scales: {
            x: {
                ticks: {
                    font: { size: 10 },
                    color: isDarkMode ? "#f3f4f6" : "#111827",
                },
                grid: {
                    color: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                },
            },
            y: {
                ticks: {
                    font: { size: 10 },
                    color: isDarkMode ? "#f3f4f6" : "#111827",
                },
                grid: {
                    color: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                },
            },
        },
    };

    // Doughnut Chart options
    const doughnutOptions = {
        cutout: "70%",
        plugins: {
            legend: {
                labels: {
                    font: { size: 12 },
                    color: isDarkMode ? "#f3f4f6" : "#111827",
                },
            },
            tooltip: {
                titleColor: isDarkMode ? "#f3f4f6" : "#111827",
                bodyColor: isDarkMode ? "#f3f4f6" : "#111827",
                backgroundColor: isDarkMode ? "#1f2937" : "#fff",
            },
        },
    };

    // Doughnut background colors
    const doughnutColors = isDarkMode
        ? ["#22c55e", "#facc15", "#f87171"]
        : ["#34d399", "rgba(250, 192, 19, 0.8)", "rgba(253, 135, 135, 0.8)"];

    return (
        <div className="jobdash-container">
            {/* Welcome Box */}
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

            {/* Stats Boxes */}
            <div className="jobdash-stats-box">
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

                <div className="jobdash-stat-box totalJobs">
                    <div className="jobdash-icon-wrap">
                        <FaClipboardList className="jobdash-icon" />
                    </div>
                    <div>
                        <p className="jobdash-number">0{total_jobs}</p>
                        <p className="jobdash-name">Total Jobs Available</p>
                    </div>
                </div>

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

            {/* Charts Section */}
            <div className="jobdash-charts-section">
                {/* Line Chart */}
                <div className="jobdash-chart-card">
                    <h6>
                        <MdOutlineArrowOutward className="arrow" />
                        <span>Applications per Day</span>
                    </h6>
                    <div
                        className="jobdash-chart-wrapper"
                        style={{ height: "450px" }}
                    >
                        <Line
                            data={{
                                labels: interviewData.map((d) => d.label),
                                datasets: [
                                    {
                                        label: "Applications Sent",
                                        data: interviewData.map(
                                            (d) => d.applications_sent
                                        ),
                                        borderColor: "#064FF0",
                                        backgroundColor: "#064FF0",
                                        tension: 0.3,
                                        pointBackgroundColor: isDarkMode
                                            ? "#3b82f6"
                                            : "#064FF0",
                                    },
                                    {
                                        label: "Rejected",
                                        data: interviewData.map(
                                            (d) => d.rejected
                                        ),
                                        borderColor: "#FF3030",
                                        backgroundColor: "#FF3030",
                                        tension: 0.3,
                                        pointBackgroundColor: isDarkMode
                                            ? "#f87171"
                                            : "#FF3030",
                                    },
                                ],
                            }}
                            options={lineOptions}
                        />
                    </div>
                </div>

                {/* Doughnut Chart */}
                <div className="jobdash-chart-card">
                    <h6>
                        <FaChartBar className="arrow" />
                        <span>Total applications per month</span>
                    </h6>
                    <div
                        className="jobdash-chart-wrapper"
                        style={{ height: "450px" }}
                    >
                        <Doughnut
                            data={{
                                labels: monthlyData.map((item) => item.label),
                                datasets: [
                                    {
                                        label: "Count",
                                        data: monthlyData.map((i) => i.value),
                                        backgroundColor: doughnutColors,
                                        borderColor: isDarkMode
                                            ? "#1f2937"
                                            : "#fff",
                                        borderWidth: 2,
                                    },
                                ],
                            }}
                            options={doughnutOptions}
                        />
                    </div>
                </div>
            </div>
            {/* Recommened cards */}
            <div className="rec-container">
                <p className="rec-title">Recommended jobs</p>
                <div className="rec-cards">
                    {recommendedJobs.map((job) => (
                        <RecommendedJobsCard job={job} key={job.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}
