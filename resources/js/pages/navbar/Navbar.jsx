import * as RadixDialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoIosMoon, IoMdNotifications } from "react-icons/io";
import { TfiClose, TfiMenu } from "react-icons/tfi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DefaultCompany from "../../../../public/images/company-default-images2.png";
import { useAuth } from "../../hook/AuthContext";
import { getJobs } from "../../services/apiAllJobs";
import ProfileDialog from "../../ui/ProfileDialog";
import "./Navbar.css";

// ===== Styled Components =====
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
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-xl);
    cursor: pointer;
    border: none;
    outline: none;
`;

const NotificationItem = styled.div`
    display: flex;
    height: 10rem;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1rem;
    border-radius: var(--radius-md);
    background-color: var(--color-grey-30);
    border: 1px solid var(--color-grey-200);
    font-size: var(--font-sm);
    color: var(--color-grey-700);
    transition: all 0.3s ease;

    &:hover {
        background-color: var(--color-grey-100);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

const NotificationWrapper = styled.div`
    position: relative;
    cursor: pointer;
    display: inline-block;
`;

const Badge = styled.span`
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 1.8rem;
    height: 1.8rem;
    background-color: var(--color-error);
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    padding: 0 0.4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SiteNameContainer = styled.div`
    display: flex;
    align-items: center;
    column-gap: 1.4rem;
`;

const StyledLogoSite = styled.img`
    height: 25px;
    width: auto;
    object-fit: contain;
`;

const StyledNameSite = styled.p`
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
        sans-serif;
    font-size: 2.8rem;
    font-weight: 600;
    color: #218c6b;
`;

const iconSize = "3.2rem";

const MenuIcon = styled(TfiMenu)`
    font-size: ${iconSize};
    color: #114a38;
    transition: all 0.3s;
    &:hover {
        transform: scale(1.1);
        color: #087f5b;
    }
`;

const CloseIcon = styled(TfiClose)`
    font-size: ${iconSize};
    color: #114a38;
    transition: all 0.3s;
    &:hover {
        transform: rotate(90deg);
        color: #087f5b;
    }
`;

const SearchDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 50%; 
    transform: translateX(-50%); 
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);
    border-radius: 7px;
    width: 600px; 
    max-width: 90vw; 
    max-height: 20rem;
    overflow-y: auto;
    z-index: 999;
    
`;

const DropdownItem = styled.div`
    padding: 0.8rem 1rem;
    cursor: pointer;
    &:hover {
        background-color: var(--color-grey-30);
    }
`;

function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

    // ===== Search Filtering (title, company, location) =====
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

    const handleSearchKey = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            navigate(`/jobs?query=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
        }
    };

    return (
        <div className={`navbar-container ${isNavOpen ? "open" : ""}`}>
            {/* Left */}
            <div className="left">
                {location.pathname.includes("employerApp") && (
                    <SiteNameContainer>
                        <StyledLogoSite
                            src="/remotic-logo3.png"
                            alt="Remotic Logo"
                        />
                        <StyledNameSite>Remotic</StyledNameSite>
                    </SiteNameContainer>
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
                    onKeyDown={handleSearchKey}
                    onFocus={() => searchQuery && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />

                {showDropdown && filteredJobs.length > 0 && (
                    <SearchDropdown>
                        {filteredJobs.map((job) => (
                            <DropdownItem
                                key={job.id}
                                onClick={() =>
                                    navigate(`/jobDetails/${job.id}`)
                                }
                            >
                                {job.title} - {job.company?.name} (
                                {job.location})
                            </DropdownItem>
                        ))}
                    </SearchDropdown>
                )}
            </div>

            {/* Right */}
            <div className="right">
                <div className="icons">
                    {/* Notifications */}
                    <RadixDialog.Root>
                        <RadixDialog.Trigger asChild>
                            <NotificationWrapper>
                                <IoMdNotifications className="Icon" />
                                {notifications.length > 0 && (
                                    <Badge>{notifications.length}</Badge>
                                )}
                            </NotificationWrapper>
                        </RadixDialog.Trigger>
                        <RadixDialog.Portal>
                            <Overlay />
                            <Content>
                                <CloseButton>&times;</CloseButton>
                                <h4 style={{ textAlign: "center" }}>
                                    Jobs recently posted!
                                </h4>
                                {notifications.length === 0 ? (
                                    <p>No new notifications</p>
                                ) : (
                                    notifications.map((n) => (
                                        <NotificationItem key={n.id}>
                                            <img
                                                src={
                                                    n?.companyImage ||
                                                    DefaultCompany
                                                }
                                                alt="Company Logo"
                                            />
                                            <div className="NotificationContent">
                                                <p className="notification-time">
                                                    {formatDistanceToNow(
                                                        n.time
                                                    )}{" "}
                                                    ago
                                                </p>
                                                <p className="company-name">
                                                    {n.companyName}
                                                </p>
                                                <p className="title-of-job">
                                                    {n.jobTitle}
                                                </p>
                                                <p className="job-description">
                                                    {n.jobDescription}
                                                </p>
                                                <div
                                                    style={{
                                                        marginTop: "0.5rem",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.4rem",
                                                        fontSize: "0.9rem",
                                                        color: "var(--color-grey-500)",
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    <span>Posted by</span>
                                                    <span
                                                        style={{
                                                            fontWeight: "600",
                                                            color: "var(--color-grey-700)",
                                                            fontStyle: "normal",
                                                        }}
                                                    >
                                                        {n.employerName}
                                                    </span>
                                                </div>
                                            </div>
                                        </NotificationItem>
                                    ))
                                )}
                            </Content>
                        </RadixDialog.Portal>
                    </RadixDialog.Root>

                    <IoIosMoon className="Icon" />
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
                    {isNavOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div className={`mobile-menu ${isNavOpen ? "show" : ""}`}>
                <Link to="/login" onClick={closeNav}>
                    Log out
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
