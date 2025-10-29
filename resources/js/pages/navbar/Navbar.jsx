import * as RadixDialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoIosMoon, IoMdNotifications } from "react-icons/io";
import { TfiClose, TfiMenu } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import DefaultCompany from "../../../../public/images/company-default-images2.png";
import { useAuth } from "../../hook/AuthContext";
import { getUserById } from "../../services/apiUsers";
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
    height: 30rem;
    max-width: 90vw;
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
    transition: all 0.2s ease;

    border: none;
    outline: none;
    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:hover {
        /* background: var(--color-grey-300); */
    }
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
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
`;

const SiteNameContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
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
const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: none;
    margin-right: 1.8rem;
    /* outline: none;
    &:focus {
        outline: none;
        box-shadow: 0 0 0 7px rgba(8, 127, 91, 0.4);
        transform: scale(1.05);
    } */

    @media (max-width: 59em) {
        display: block;
        z-index: 2000;
    }
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
function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen((prev) => !prev);
    const closeNav = () => setIsNavOpen(false);

    const BASE_URL = "http://127.0.0.1:8000/";
    const { user } = useAuth();
    // console.log(user?.role);
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // console.log("All the notifications: ", notifications);
    useEffect(() => {
        if (!user?.token) return;
        4;

        const newSocket = io("http://localhost:5000", {
            auth: { token: user.token },
            reconnection: true,
        });

        newSocket.on("connect", () => {
            console.log("✅ Connected to socket server with ID:", newSocket.id);
        });

        newSocket.on("connect_error", (err) => {
            console.error("❌ Socket connection error:", err.message);
        });

        newSocket.on("disconnect", () => {
            console.log("🔴 Disconnected from socket server");
        });

        newSocket.on("newJobPosted", (data) => {
            console.log("🟡 New job data received from server:", data);
            setNotifications((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    employerName: data.employerName,
                    companyName: data.companyName,
                    companyImage: data.companyLogo,
                    jobTitle: data.jobTitle,
                    jobDescription: data.description,
                    jobID: data.jobId,
                    time: new Date(),
                },
            ]);
        });

        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [user?.token]);

    // ===== Fetch full user info =====
    const { data: fullUser } = useQuery(
        ["user", user?.id],
        () => getUserById(user.id),
        { enabled: !!user?.id, refetchOnWindowFocus: true, staleTime: 0 }
    );

    const markAsRead = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };
    const isEmployerDashboard = location.pathname.includes("employerApp");

    // console.log("nototication data :");

    return (
        // <div className="navbar-container">
        //     {/* Left links */}
        //     <div className="left">
        //         {isEmployerDashboard && (
        //             <SiteNameContainer>
        //                 <StyledLogoSite
        //                     src="/remotic-logo3.png"
        //                     alt="Remotic Logo"
        //                 />
        //                 <StyledNameSite>Remotic</StyledNameSite>
        //             </SiteNameContainer>
        //         )}
        //         <Link to="/employerApp"></Link>
        //     </div>

        //     {/* Center search */}
        //     <div className="center">
        //         <input
        //             className="headerInput"
        //             type="search"
        //             placeholder="Search jobs, applicants..."
        //         />
        //     </div>

        //     {/* Right icons */}
        //     <div className="right">
        //         <div className="icons" style={{ position: "relative" }}>
        //             <RadixDialog.Root>
        //                 <RadixDialog.Trigger asChild>
        //                     <NotificationWrapper>
        //                         <IoMdNotifications className="Icon" />
        //                         {notifications.length > 0 && (
        //                             <Badge>{notifications.length}</Badge>
        //                         )}
        //                     </NotificationWrapper>
        //                 </RadixDialog.Trigger>
        //                 <RadixDialog.Portal>
        //                     <Overlay />
        //                     <Content>
        //                         <CloseButton>&times;</CloseButton>
        //                         <h4 style={{ textAlign: "center" }}>
        //                             Jobs recently posted!
        //                         </h4>
        //                         {notifications.length === 0 ? (
        //                             <p>No new notifications</p>
        //                         ) : (
        //                             notifications.map((n) => (
        //                                 <NotificationItem
        //                                     className="NotificationItem"
        //                                     key={n.id}
        //                                 >
        //                                     <img
        //                                         src={
        //                                             n?.companyImage ||
        //                                             DefaultCompany
        //                                         }
        //                                         alt="Company Logo"
        //                                     />

        //                                     <div className="NotificationContent">
        //                                         <p className="notification-time">
        //                                             {formatDistanceToNow(
        //                                                 n.time
        //                                             )}{" "}
        //                                             ago
        //                                         </p>

        //                                         <p className="company-name">
        //                                             {n.companyName}
        //                                         </p>
        //                                         <p className="title-of-job">
        //                                             {n.jobTitle}
        //                                         </p>
        //                                         <p className="job-description">
        //                                             {n.jobDescription}
        //                                         </p>
        //                                         <div
        //                                             style={{
        //                                                 marginTop: "0.5rem",
        //                                                 display: "flex",
        //                                                 alignItems: "center",
        //                                                 gap: "0.4rem",
        //                                                 fontSize: "0.9rem",
        //                                                 color: "var(--color-grey-500)",
        //                                                 fontStyle: "italic",
        //                                             }}
        //                                         >
        //                                             <span>Posted by</span>
        //                                             <span
        //                                                 style={{
        //                                                     fontWeight: "600",
        //                                                     color: "var(--color-grey-700)",
        //                                                     fontStyle: "normal",
        //                                                 }}
        //                                             >
        //                                                 {n.employerName}
        //                                             </span>
        //                                         </div>
        //                                     </div>

        //                                     <div className="NotificationActions">
        //                                         <div className="dots-menu-wrapper">
        //                                             <button className="dots-btn">
        //                                                 <HiOutlineDotsHorizontal />
        //                                             </button>
        //                                             <div className="context-menu">
        //                                                 <Link
        //                                                     to={`/app/allJobs/jobDetails/${n.jobID}`}
        //                                                     onClick={() =>
        //                                                         markAsRead(n.id)
        //                                                     }
        //                                                 >
        //                                                     <button>
        //                                                         <IoMdEye
        //                                                             style={{
        //                                                                 display:
        //                                                                     "flex",
        //                                                                 alignItems:
        //                                                                     "center",
        //                                                             }}
        //                                                         />{" "}
        //                                                         <span className="view">
        //                                                             View Job
        //                                                         </span>
        //                                                     </button>
        //                                                 </Link>
        //                                                 <button
        //                                                     onClick={() =>
        //                                                         markAsRead(n.id)
        //                                                     }
        //                                                 >
        //                                                     <RiDeleteBin6Line />{" "}
        //                                                     <span className="done">
        //                                                         Done
        //                                                     </span>
        //                                                 </button>
        //                                             </div>
        //                                         </div>
        //                                     </div>
        //                                 </NotificationItem>
        //                             ))
        //                         )}
        //                     </Content>
        //                 </RadixDialog.Portal>
        //             </RadixDialog.Root>

        //             <IoIosMoon className="Icon" />
        //         </div>

        //         <ProfileDialog>
        //             <div className="avatar-wrapper">
        //                 {user?.role === "employer" ? (
        //                     <img
        //                         src={
        //                             user?.data?.user?.company?.logo
        //                                 ? `http://127.0.0.1:8000/storage/${user.data.user.company.logo}`
        //                                 : "images/company-default-images2.png"
        //                         }
        //                         alt="Profile"
        //                         className="avatar-img"
        //                     />
        //                 ) : (
        //                     <img
        //                         src={
        //                             user?.data?.user?.profile?.profile_image
        //                                 ? `${BASE_URL}${user.data.user.profile.profile_image}`
        //                                 : "/profile/default.jpg"
        //                         }
        //                         alt="Profile"
        //                         className="avatar-img"
        //                     />
        //                 )}
        //                 <FaCaretDown className="avatar-caret" />
        //                 <IconButton>
        //                     <CloseIcon /> <MenuIcon />
        //                 </IconButton>
        //             </div>
        //         </ProfileDialog>
        //     </div>
        // </div>
        <div className={`navbar-container ${isNavOpen ? "open" : ""}`}>
            {/* Left */}
            <div className="left">
                {isEmployerDashboard && (
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
            <div className="center">
                <input
                    className="headerInput"
                    type="search"
                    placeholder="Search jobs, applicants..."
                />
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
                        {/* ... Radix Content ... */}
                    </RadixDialog.Root>

                    <IoIosMoon className="Icon" />
                </div>

                {/* Profile */}
                <ProfileDialog>
                    <div className="avatar-wrapper">
                        {user?.role === "employer" ? (
                            <img
                                src={
                                    user?.data?.user?.company?.logo
                                        ? `http://127.0.0.1:8000/storage/${user.data.user.company.logo}`
                                        : DefaultCompany
                                }
                                alt="Profile"
                                className="avatar-img"
                            />
                        ) : (
                            <img
                                src={
                                    user?.data?.user?.profile?.profile_image
                                        ? `${BASE_URL}${user.data.user.profile.profile_image}`
                                        : "/profile/default.jpg"
                                }
                                alt="Profile"
                                className="avatar-img"
                            />
                        )}
                        <FaCaretDown className="avatar-caret" />
                    </div>
                </ProfileDialog>

                {/* Mobile Menu Button */}
                <button className="menu-btn" onClick={toggleNav}>
                    {isNavOpen ? <TfiClose /> : <TfiMenu />}
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
