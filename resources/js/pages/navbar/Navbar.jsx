import * as RadixDialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoIosMoon, IoIosSunny, IoMdNotifications } from "react-icons/io";
import { TfiClose, TfiMenu } from "react-icons/tfi";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DefaultCompany from "../../../../public/images/company-default-images2.png";
import { useAuth } from "../../hook/AuthContext";
import { useTheme } from "../../hook/hemeContext"; // ✅ Import
import { getJobs } from "../../services/apiAllJobs";
import ProfileDialog from "../../ui/ProfileDialog";
import "./Navbar.css";

const Overlay = styled(RadixDialog.Overlay)`
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    inset: 0;
`;

const Content = styled(RadixDialog.Content)`
    position: fixed;
    top: 60px;
    right: 20px;
    width: 72rem;
    max-width: 90vw;
    height: 30rem;
    overflow-y: auto;
    background: var(--color-grey-0);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 1000;
`;

const CloseButton = styled(RadixDialog.Close)`
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    cursor: pointer;
    border: none;
`;

function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme(); // ✅ Access theme + toggle

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const toggleNav = () => setIsNavOpen((prev) => !prev);
    const closeNav = () => setIsNavOpen(false);

    const { data: jobs = [] } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
    });

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredJobs([]);
            setShowDropdown(false);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        const result = jobs.filter((job) => {
            const titleMatch = job.title?.toLowerCase().includes(lowerQuery);
            const companyMatch = job.company?.name
                ?.toLowerCase()
                .includes(lowerQuery);
            const locationMatch = job.location
                ?.toLowerCase()
                .includes(lowerQuery);
            return titleMatch || companyMatch || locationMatch;
        });

        setFilteredJobs(result.slice(0, 5));
        setShowDropdown(true);
    }, [searchQuery, jobs]);

    return (
        <div className={`navbar-container ${isNavOpen ? "open" : ""}`}>
            {/* Left */}
            <div className="left">
                {location.pathname.includes("employerApp") && (
                    <div className="site-name">
                        <img
                            src="/remotic-logo3.png"
                            alt="Remotic Logo"
                            height={25}
                        />
                        <p className="websiteName">Remotic</p>
                    </div>
                )}
            </div>

            {/* Center Search */}
            <div className="center" style={{ position: "relative" }}>
                <input
                    className="headerInput"
                    type="search"
                    placeholder="Search jobs, companies, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />

                {showDropdown && filteredJobs.length > 0 && (
                    <div className="search-dropdown">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="dropdown-item"
                                onClick={() =>
                                    navigate(`/jobDetails/${job.id}`)
                                }
                            >
                                {job.title} - {job.company?.name} (
                                {job.location})
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="right">
                <div className="icons">
                    <RadixDialog.Root>
                        <RadixDialog.Trigger asChild>
                            <div className="notification-wrapper">
                                <IoMdNotifications className="Icon" />
                                {notifications.length > 0 && (
                                    <span className="badge">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                        </RadixDialog.Trigger>
                        <RadixDialog.Portal>
                            <Overlay />
                            <Content>
                                <CloseButton>&times;</CloseButton>
                                <h4 style={{ textAlign: "center" }}>
                                    Jobs recently posted!
                                </h4>
                            </Content>
                        </RadixDialog.Portal>
                    </RadixDialog.Root>
                    {/* 🌙 / ☀️ Theme Toggle */}
                    <button onClick={toggleTheme} className="theme-btn">
                        {theme === "light" ? (
                            <IoIosMoon className="Icon" />
                        ) : (
                            <IoIosSunny className="Icon" />
                        )}
                    </button>
                </div>

                {/* Profile */}
                <ProfileDialog>
                    <div className="avatar-wrapper">
                        <img
                            src={
                                user?.role === "employer"
                                    ? user?.data?.user?.company?.logo
                                        ? `http://127.0.0.1:8000/storage/${user.data.user.company.logo}`
                                        : DefaultCompany
                                    : user?.data?.user?.profile?.profile_image
                                    ? `http://127.0.0.1:8000/${user.data.user.profile.profile_image}`
                                    : "/profile/default.jpg"
                            }
                            alt="Profile"
                            className="avatar-img"
                        />
                        <FaCaretDown className="avatar-caret" />
                    </div>
                </ProfileDialog>

                {/* Mobile Menu */}
                <button className="menu-btn" onClick={toggleNav}>
                    {isNavOpen ? <TfiClose /> : <TfiMenu />}
                </button>
            </div>
        </div>
    );
}

export default Navbar;
