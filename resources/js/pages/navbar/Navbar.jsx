import * as RadixDialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { HiOutlineMoon } from "react-icons/hi2";
import { IoIosSunny, IoMdNotificationsOutline } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { TfiClose, TfiMenu } from "react-icons/tfi";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DefaultCompany from "../../../../public/images/company-default-images2.png";
import { useAuth } from "../../hook/AuthContext";
import { useTheme } from "../../hook/hemeContext";
import { getJobs } from "../../services/apiAllJobs";

import {
    deleteNotification,
    getNotifications,
    markNotificationAsRead,
} from "../../services/apiNotifications";
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
    width: 380px;
    max-width: 90vw;
    height: 400px;
    overflow-y: auto;
    background: var(--color-grey-0);
    border-radius: var(--radius-lg);
    padding: 1rem 0;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    gap: 0;
    z-index: 1000;
`;

const CloseButton = styled(RadixDialog.Close)`
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    cursor: pointer;
    border: none;
    &:focus {
        outline: none;
    }
`;

function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const queryClient = useQueryClient();

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const { data: jobs = [] } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
    });

    const { data: notificationsData = [], isLoading: isLoadingNotifications } =
        useQuery({
            queryKey: ["notifications"],
            queryFn: getNotifications,
            refetchInterval: 5000,
        });
    console.log("Notification data :", notificationsData);
    const markReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => queryClient.invalidateQueries(["notifications"]),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => queryClient.invalidateQueries(["notifications"]),
    });

    const toggleNav = () => setIsNavOpen((prev) => !prev);

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

    // تابع اصلاح پیام نوتیفیکیشن و کوتاه کردن آن
    function formatNotificationMessage(message, maxLength = 50) {
        if (!message) return "";
        return message.length <= maxLength
            ? message
            : message.slice(0, maxLength) + "...";
    }

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
                            <div className="JobItem" key={job.id}>
                                <strong className="job-title">
                                    {job.title}
                                </strong>
                                <p className="job-description">
                                    {formatNotificationMessage(
                                        job.description || "",
                                        50
                                    )}
                                </p>
                                <small className="job-location">
                                    {job.location}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="right">
                <div className="icons">
                    {/* Notification */}
                    <RadixDialog.Root>
                        <RadixDialog.Trigger asChild>
                            <div className="notification-wrapper">
                                <IoMdNotificationsOutline className="Icon" />
                                {!isLoadingNotifications &&
                                    notificationsData.length > 0 && (
                                        <span className="badge">
                                            {
                                                notificationsData.filter(
                                                    (n) => !n.is_read
                                                ).length
                                            }
                                        </span>
                                    )}
                            </div>
                        </RadixDialog.Trigger>
                        <RadixDialog.Portal>
                            <Overlay />
                            <Content className="radix-content">
                                <CloseButton>
                                    <IoCloseOutline />
                                </CloseButton>
                                <h4>Notifications</h4>
                                <div>
                                    {isLoadingNotifications && (
                                        <p>Loading...</p>
                                    )}
                                    {!isLoadingNotifications &&
                                        notificationsData.length === 1 && (
                                            <p style={{ textAlign: "center" }}>
                                                No notifications
                                            </p>
                                        )}
                                    {notificationsData.map((n) => (
                                        <div
                                            className={`NotificationItem ${
                                                !n.is_read ? "unread" : ""
                                            }`}
                                            key={n.id}
                                        >
                                            <div className="NotificationContent">
                                                <strong className="company-name">
                                                    {n.title}
                                                </strong>
                                                <p className="job-description">
                                                    {formatNotificationMessage(
                                                        n.message,
                                                        50
                                                    )}
                                                </p>
                                                <small className="notification-time">
                                                    {new Date(
                                                        n.created_at
                                                    ).toLocaleString()}
                                                </small>
                                            </div>
                                            <div className="NotificationActions">
                                                <div className="dots-menu-wrapper">
                                                    <button className="dots-btn">
                                                        ⋮
                                                    </button>
                                                    <div className="context-menu">
                                                        {!n.is_read && (
                                                            <button
                                                                onClick={() =>
                                                                    markReadMutation.mutate(
                                                                        n.id
                                                                    )
                                                                }
                                                            >
                                                                Done
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                deleteMutation.mutate(
                                                                    n.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Content>
                        </RadixDialog.Portal>
                    </RadixDialog.Root>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="theme-btn">
                        {theme === "light" ? (
                            <HiOutlineMoon className="Icon" />
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
