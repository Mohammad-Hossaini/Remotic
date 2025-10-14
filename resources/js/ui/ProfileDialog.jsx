import * as RadixDialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { MdOutlineLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hook/AuthContext";
import { getUserById } from "../services/apiUsers";
import UpdateProfileDialog from "./UpdateProfileDialog";

import { logoutUser } from "../features/authintication/apiLogin";

const DialogOverlay = styled(RadixDialog.Overlay)`
    background: transparent;
    position: fixed;
    inset: 0;
`;

const DialogContent = styled(RadixDialog.Content)`
    position: absolute;
    top: 60px;
    right: 2.5rem;
    width: 26rem;
    max-width: 95vw;
    border: 1px solid var(--color-grey-200);
    background-color: var(--color-grey-0);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: var(--space-24);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-16);
    z-index: 1000;
`;

const ProfileImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-bottom: var(--space-12);
    border-bottom: 1px solid var(--color-grey-200);
`;

const ProfileImage = styled.img`
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    border: 2px solid var(--color-grey-300);
    object-fit: cover;
`;

const Description = styled.p`
    text-align: center;
    font-size: var(--font-sm);
    color: var(--color-grey-700);
    margin-top: var(--space-12);
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: var(--space-8);
    margin-top: var(--space-12);
    width: 100%;
`;

const BaseButton = styled(Link)`
    flex: 1;
    text-align: center;
    padding: 0.6rem 0;
    border-radius: var(--radius-xxl);
    font-size: var(--font-sm);
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PrimaryButton = styled(BaseButton)`
    background-color: var(--color-primary);
    color: #fff;
    &:hover {
        background-color: var(--color-primary-dark);
    }
`;

const OutlineButton = styled(BaseButton)`
    border: 1px solid var(--color-primary);
    background-color: transparent;
    color: var(--color-primary);
    &:hover {
        background-color: var(--color-primary-light);
        color: #fff;
    }
`;

const LogoutButton = styled.button`
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.6rem 0;
    border-radius: var(--radius-xxl);
    font-size: var(--font-sm);
    font-weight: 500;
    border: 1px solid var(--color-error);
    background-color: transparent;
    color: var(--color-error);
    margin-top: var(--space-12);
    transition: all 0.2s ease;
    &:hover {
        background-color: var(--color-error);
        color: #fff;
    }
`;

export default function ProfileDialog({ children }) {
    const BASE_URL = "http://127.0.0.1:8000/";
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const { data: fullUser, refetch } = useQuery(
        ["user", user?.id],
        () => getUserById(user.id),
        {
            enabled: !!user?.id,
            refetchOnWindowFocus: true,
            staleTime: 0,
        }
    );

    const role = fullUser?.role || "jobseeker";
    const basePath = role === "employer" ? "/employerApp" : "/app";
    const profilePath = `${basePath}/profile`;

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (token) {
                await logoutUser(token);
            }
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("authUser");
            if (setUser) setUser(null);

            toast.success("Logged out successfully!");
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.message || "Logout failed. Please try again.");
        }
    };

    const handleUserUpdate = (updatedUser) => {
        if (setUser) {
            setUser(updatedUser);
            localStorage.setItem("authUser", JSON.stringify(updatedUser));
            toast.success("Profile updated successfully!");
            refetch();
        } else {
            console.warn("setUser is not defined!");
        }
    };

    return (
        <RadixDialog.Root>
            <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>
            <RadixDialog.Portal>
                <DialogOverlay />
                <DialogContent>
                    <ProfileImageWrapper>
                        <ProfileImage
                            src={
                                user?.data?.user?.profile?.profile_image
                                    ? `${BASE_URL}${user.data.user.profile.profile_image}`
                                    : "/profile/default.jpg"
                            }
                            alt="Profile"
                        />
                    </ProfileImageWrapper>

                    <Description>
                        {user?.data?.user?.profile?.description ||
                            "No description available."}
                    </Description>

                    {user?.role === "job_seeker" && (
                        <ButtonContainer>
                            <PrimaryButton to={profilePath}>
                                View Profile
                            </PrimaryButton>

                            <UpdateProfileDialog
                                trigger={
                                    <OutlineButton asChild>
                                        Settings
                                    </OutlineButton>
                                }
                                user={fullUser || {}}
                                onUpdate={handleUserUpdate}
                            />
                        </ButtonContainer>
                    )}

                    <LogoutButton onClick={handleLogout}>
                        <MdOutlineLogout />
                        Logout
                    </LogoutButton>
                </DialogContent>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
