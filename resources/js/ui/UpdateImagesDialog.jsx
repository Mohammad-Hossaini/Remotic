import * as RadixDialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import styled from "styled-components";
import { useAuth } from "../hook/AuthContext";

// ===== Styled Components =====
const DialogOverlay = styled(RadixDialog.Overlay)`
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    inset: 0;
`;

const DialogContent = styled(RadixDialog.Content)`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60rem);
    width: 80rem;
    max-width: 95%;
    height: 50rem;
    max-height: 90%;
    background-color: var(--color-grey-900);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 2rem;
    overflow-y: auto;

    @media screen and (max-width: 1200px) {
        width: 70rem;
        height: 45rem;
        padding: 1.8rem;
    }

    @media screen and (max-width: 944px) {
        width: 60rem;
        /* height: auto; */
        padding: 1.5rem;
    }

    @media screen and (max-width: 704px) {
        width: 90%;
        padding: 1.2rem;
    }

    @media screen and (max-width: 544px) {
        width: 95%;
        padding: 1rem;
        height: 30rem;
    }
`;

const Title = styled.h2`
    position: absolute;
    top: 2rem;
    left: 3rem;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-grey-0);

    @media screen and (max-width: 944px) {
        font-size: 1.8rem;
        top: 1.5rem;
        left: 2rem;
    }

    @media screen and (max-width: 544px) {
        font-size: 1.6rem;
        top: 1rem;
        left: 1rem;
    }
`;

const CloseIcon = styled(RxCross1)`
    position: absolute;
    top: 2rem;
    right: 2rem;
    font-size: 2rem;
    color: var(--color-grey-0);
    cursor: pointer;

    @media screen and (max-width: 944px) {
        font-size: 1.8rem;
        top: 1.5rem;
        right: 1.5rem;
    }

    @media screen and (max-width: 544px) {
        font-size: 1.6rem;
        top: 1rem;
        right: 1rem;
    }
`;

const PhotoWrapper = styled.div`
    position: relative;
`;

const ProfileImage = styled.img`
    width: 25rem;
    height: 25rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-grey-200);

    @media screen and (max-width: 1200px) {
        width: 22rem;
        height: 22rem;
    }

    @media screen and (max-width: 944px) {
        width: 18rem;
        height: 18rem;
    }

    @media screen and (max-width: 704px) {
        width: 18rem;
        height: 18rem;
    }

    @media screen and (max-width: 544px) {
        width: 14rem;
        height: 14rem;
    }
`;

const BottomActions = styled.div`
    position: absolute;
    bottom: 2rem;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 4rem;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        width: 100%;
        height: 1px;
        background-color: var(--color-grey-0);
    }

    @media screen and (max-width: 944px) {
        gap: 3rem;
        bottom: 1.5rem;
    }

    @media screen and (max-width: 544px) {
        /* flex-direction: column; */
        gap: 1rem;
        bottom: 1rem;
    }
`;

const ActionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.2rem 2.4rem;
    color: var(--color-grey-0);
    cursor: pointer;

    svg {
        font-size: 2.5rem;

        @media screen and (max-width: 944px) {
            font-size: 2.2rem;
        }

        @media screen and (max-width: 544px) {
            font-size: 2rem;
        }
    }

    span {
        margin-top: 0.4rem;
        font-size: 1.4rem;
        font-weight: 500;

        @media screen and (max-width: 944px) {
            font-size: 1.2rem;
        }

        @media screen and (max-width: 544px) {
            font-size: 1rem;
        }
    }
`;

// ===== Component =====
export default function UpdateImagesDialog({ trigger, onPhotoUpdate }) {
    const { user, setUser } = useAuth();
    const [previewImage, setPreviewImage] = useState("/profile/default.jpg");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user?.data?.user?.profile?.profile_image) {
            setPreviewImage(
                `http://127.0.0.1:8000/${user.data.user.profile.profile_image}`
            );
        } else {
            setPreviewImage("/profile/default.jpg");
        }
    }, [user]);

    const handleEditPhoto = () => fileInputRef.current.click();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profile_image", file);

        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/profiles/${user.data.user.profile.id}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${user.token}` },
                    body: formData,
                }
            );

            if (!res.ok) throw new Error("Failed to upload profile image");
            const updatedProfile = await res.json();

            const updatedUser = {
                ...user,
                data: {
                    ...user.data,
                    user: {
                        ...user.data.user,
                        profile: updatedProfile,
                    },
                },
            };
            setUser(updatedUser);
            sessionStorage.setItem("authUser", JSON.stringify(updatedUser));

            const reader = new FileReader();
            reader.onload = (event) => setPreviewImage(event.target.result);
            reader.readAsDataURL(file);

            if (onPhotoUpdate) onPhotoUpdate(updatedProfile.profile_image);
            toast.success("Profile image updated!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile image.");
        }
    };

    const handleDelete = async () => {
        try {
            const profileId = user?.data?.user?.profile?.id;
            if (!profileId) throw new Error("Profile ID not found");

            const res = await fetch(
                `http://127.0.0.1:8000/api/profiles/${profileId}/profile-image`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );

            if (!res.ok && res.status !== 404)
                throw new Error("Failed to delete profile image");

            const updatedUser = {
                ...user,
                data: {
                    ...user.data,
                    user: {
                        ...user.data.user,
                        profile: {
                            ...user.data.user.profile,
                            profile_image: null,
                        },
                    },
                },
            };
            setUser(updatedUser);
            sessionStorage.setItem("authUser", JSON.stringify(updatedUser));
            setPreviewImage("/profile/default.jpg");

            if (onPhotoUpdate) onPhotoUpdate(null);
            toast.success("Profile photo deleted!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete profile image.");
        }
    };

    return (
        <RadixDialog.Root>
            <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
            <RadixDialog.Portal>
                <DialogOverlay />
                <DialogContent>
                    <Title>Profile Photo</Title>
                    <RadixDialog.Close asChild>
                        <CloseIcon />
                    </RadixDialog.Close>

                    <PhotoWrapper>
                        <ProfileImage src={previewImage} alt="Profile" />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </PhotoWrapper>

                    <BottomActions>
                        <ActionWrapper onClick={handleEditPhoto}>
                            <MdEdit />
                            <span>Edit</span>
                        </ActionWrapper>

                        <ActionWrapper onClick={handleDelete}>
                            <RiDeleteBin6Line />
                            <span>Delete</span>
                        </ActionWrapper>
                    </BottomActions>
                </DialogContent>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
