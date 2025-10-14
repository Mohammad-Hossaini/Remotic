import * as RadixDialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoIosMoon, IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ProfileDialog from "../../ui/ProfileDialog";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hook/AuthContext";
import { getUserById } from "../../services/apiUsers";
import "./Navbar.css";

// Styled components
const Overlay = styled(RadixDialog.Overlay)`
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    inset: 0;
`;
const Content = styled(RadixDialog.Content)`
    position: fixed;
    top: 60px;
    right: 20px;
    width: 20rem;
    max-width: 90vw;
    background: var(--color-grey-0);
    border-radius: var(--radius-md);
    padding: 1rem;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 1000;
`;
const NotificationItem = styled.div`
    padding: 0.4rem 0.3rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-grey-300);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
    color: var(--color-grey-200);
    &:hover {
        background-color: var(--color-grey-200);
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
    transition: transform 0.2s ease;
    &.animate {
        transform: scale(1.2);
    }
`;

function Navbar() {
    const BASE_URL = "http://127.0.0.1:8000/";
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New applicant applied for Frontend Developer" },
        { id: 2, text: "Your job posting has been approved" },
    ]);

    const { user } = useAuth();

    const { data: fullUser } = useQuery(
        ["user", user?.id],
        () => getUserById(user.id),
        {
            enabled: !!user?.id,
            refetchOnWindowFocus: true,
            staleTime: 0,
        }
    );

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
                                {notifications.length > 0 && (
                                    <Badge>{notifications.length}</Badge>
                                )}
                            </NotificationWrapper>
                        </RadixDialog.Trigger>
                        <RadixDialog.Portal>
                            <Overlay />
                            <Content>
                                <h4>Notifications</h4>
                                {notifications.length === 0 ? (
                                    <p>No new notifications</p>
                                ) : (
                                    notifications.map((n) => (
                                        <NotificationItem key={n.id}>
                                            {n.text}
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
