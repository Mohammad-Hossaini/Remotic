import * as RadixDialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoIosMoon, IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
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

    &:hover {
        background: var(--color-grey-300);
    }
`;

const NotificationItem = styled.div`
    display: flex;
    height: 6rem;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1rem;
    border-radius: var(--radius-md);
    background-color: var(--color-grey-50);
    border: 1px solid var(--color-grey-200);
    font-size: var(--font-sm);
    color: var(--color-grey-700);
    transition: all 0.3s ease;

    &:hover {
        background-color: var(--color-grey-100);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
`;

const MarkReadBtn = styled.button`
    background-color: var(--color-primary);
    color: #fff;
    font-size: var(--font-xs);
    font-weight: 600;
    padding: 0.8rem 0.7rem;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;

    &:hover {
        background-color: var(--color-primary-dark);
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

function Navbar() {
    const BASE_URL = "http://127.0.0.1:8000/";
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // ===== Socket.io connection =====
    useEffect(() => {
        if (!user?.token) return;

        const newSocket = io("http://localhost:5000", {
            auth: { token: user.token },
            reconnection: true,
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected, id:", newSocket.id);
        });

        newSocket.on("newJobPosted", (data) => {
            console.log("📩 Server says:", data);
            setNotifications((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: `${data.companyName} posted "${data.jobTitle}"`,
                    time: new Date(),
                },
            ]);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            console.log("🔌 Socket disconnected");
        };
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

    return (
        <div className="navbar-container">
            {/* Left links */}
            <div className="left">
                <Link to="/employerApp"></Link>
            </div>

            {/* Center search */}
            <div className="center">
                <input
                    className="headerInput"
                    type="search"
                    placeholder="Search jobs, applicants..."
                />
            </div>

            {/* Right icons */}
            <div className="right">
                <div className="icons" style={{ position: "relative" }}>
                    <RadixDialog.Root>
                        <RadixDialog.Trigger asChild>
                            <NotificationWrapper>
                                <IoMdNotifications className="Icon" />
                                {user?.role === "job_seeker" &&
                                    notifications.length > 0 && (
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
                                            <span>{n.text}</span>
                                            <MarkReadBtn
                                                onClick={() => markAsRead(n.id)}
                                            >
                                                Mark as Read
                                            </MarkReadBtn>
                                        </NotificationItem>
                                    ))
                                )}
                            </Content>
                        </RadixDialog.Portal>
                    </RadixDialog.Root>

                    <IoIosMoon className="Icon" />
                </div>

                <ProfileDialog>
                    <div className="avatar-wrapper">
                        <img
                            src={
                                user?.data?.user?.profile?.profile_image
                                    ? `${BASE_URL}${user.data.user.profile.profile_image}`
                                    : "/profile/default.jpg"
                            }
                            alt="Profile"
                            className="avatar-img"
                        />
                        <FaCaretDown className="avatar-caret" />
                    </div>
                </ProfileDialog>
            </div>
        </div>
    );
}

export default Navbar;
