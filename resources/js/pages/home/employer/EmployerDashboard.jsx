import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../../hook/AuthContext";
import JobApplicantsChart from "../../../ui/BarChart";
import JobModal from "../../../ui/JobModal";
import ApplicationStatus from "../../../ui/PieChart";
import "./EmployerDashboard.css";
function EmployerDashboard() {
    const [openModal, setOpenModal] = useState(false);
    const { user } = useAuth();
    // console.log("User Data : ", user);
    // console.log(user.user.company?.company_name);

    // 🔹 Socket state
    const [socket, setSocket] = useState(null);

    // 🔹 اتصال به سوکت بعد از دریافت user.token
    useEffect(() => {
        if (!user?.token) return;

        const newSocket = io("http://localhost:5000", {
            auth: { token: user.token },
        });

        // 🔹 دریافت پیام تست از سرور
        newSocket.on("testResponse", (msg) => {
            console.log("📩 Server says:", msg);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?.token]);

    // 🔹 ایونت کلیک باتن تست
    const handleTest = () => {
        if (!socket) return;
        socket.emit("testButtonClicked", "Test button clicked"); // 🔹 ارسال پیام به سرور
    };

    return (
        <div className="employer-section">
            <div className="employer-container">
                {/* 🔹 Post Job Button */}
                <div className="dashboard-actions">
                    <button
                        className="post-job-btn"
                        style={{ marginRight: "1.8rem" }}
                        onClick={handleTest}
                    >
                        Test
                    </button>
                    <button
                        className="post-job-btn"
                        onClick={() => setOpenModal(true)} // ✅ open modal
                    >
                        + Post a New Job
                    </button>
                </div>

                {/* ✅ JobModal */}
                <JobModal open={openModal} onOpenChange={setOpenModal} />

                {/* Stats cards */}
                <div className="static-boxes">
                    <div className="static-box">
                        <p className="box-number">90</p>
                        <p className="box-name">New Applications</p>
                    </div>
                    <div className="static-box">
                        <p className="box-number">56</p>
                        <p className="box-name">Hired Candidates</p>
                    </div>
                    <div className="static-box">
                        <p className="box-number">67</p>
                        <p className="box-name">Unread Messages</p>
                    </div>
                    <div className="static-box">
                        <p className="box-number">12</p>
                        <p className="box-name">Open Positions</p>
                    </div>
                </div>

                {/* Main content */}
                <div className="content-box">
                    {/* Left: Recent applications */}
                    <div className="left-box">
                        <h2 className="section-title">Recent Applications</h2>
                        <div className="recent-box">
                            <div className="recent-left">
                                <h3>Mohammad Sorath</h3>
                                <p>Product Designer</p>
                            </div>
                            <div className="recent-right">
                                <p>4 hours ago</p>
                            </div>
                        </div>
                        <div className="recent-box">
                            <div className="recent-left">
                                <h3>Ali Ahmad</h3>
                                <p>Frontend Developer</p>
                            </div>
                            <div className="recent-right">
                                <p>7 hours ago</p>
                            </div>
                        </div>
                        <div className="recent-box">
                            <div className="recent-left">
                                <h3>Sara Khan</h3>
                                <p>UX Researcher</p>
                            </div>
                            <div className="recent-right">
                                <p>1 day ago</p>
                            </div>
                        </div>
                        <div className="recent-box">
                            <div className="recent-left">
                                <h3>Ali</h3>
                                <p>Mobile Developer</p>
                            </div>
                            <div className="recent-right">
                                <p>33 day ago</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Charts/overview */}
                    <div className="right-box">
                        <div className="top-box">
                            <h3>Candidate Overview</h3>
                            <div className="chart-placeholder">
                                <JobApplicantsChart />
                            </div>
                        </div>
                        <div className="bottom-box">
                            <h3>Applications by Status</h3>
                            <div className="chart-placeholder">
                                <ApplicationStatus />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployerDashboard;
