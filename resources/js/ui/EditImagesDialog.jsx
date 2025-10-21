import * as RadixDialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import styled from "styled-components";
import { useAuth } from "../hook/AuthContext";
// ===== Styled Components =====
const Overlay = styled(RadixDialog.Overlay)`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
`;

const Content = styled(RadixDialog.Content)`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70rem;
    height: 33rem;
    background: var(--color-grey-900);
    padding: 2rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
`;

const TitleLine = styled.div`
    border-bottom: 1px solid var(--color-grey-200);
    margin-bottom: 1rem;
`;

const ImagePreview = styled.img`
    width: 100%;
    height: 22rem;
    object-fit: cover;
    border: 1px solid var(--color-grey-200);
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const ChooseButton = styled.button`
    display: flex;
    font-size: 2.4rem;
    align-items: center;
    gap: 0.3rem;
    color: #fff;
    padding: 0rem 1rem;
    border-radius: var(--radius-xxl);
    cursor: pointer;
    border: var(--color-grey-0);
    transition: 0.2s ease;
`;
const Header = styled.div`
    position: relative;
    padding: 0 0 2rem 0;
    margin: -2rem -2rem 1rem -2rem;
    border-bottom: 1px solid var(--color-grey-0);
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

// Title
const StyledH2 = styled.h2`
    color: var(--color-grey-0);
    font-size: 1.6rem;
    line-height: 1.02;
    font-weight: 400;
    padding-top: 1rem;
    padding-left: 2rem;
`;

const CloseButton = styled(RadixDialog.Close)`
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: var(--color-grey-0);
    cursor: pointer;
    font-size: 2.4rem;
`;

const DeleteButton = styled.button`
    color: #fff;
    font-size: 2.4rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-xxl);
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    transition: 0.2s ease;
`;

export default function EditImagesDialog({ trigger, onBgUpdate }) {
    const { user, setUser } = useAuth();
    const [previewImage, setPreviewImage] = useState(
        "/background_images/default-bg.jpg"
    );
    const fileInputRef = useRef(null);

    if (!user) return null;

    useEffect(() => {
        if (user.data.user.profile.background_image) {
            setPreviewImage(
                `http://127.0.0.1:8000/${user.data.user.profile.background_image}`
            );
        } else {
            setPreviewImage("/background_images/default-bg.jpg");
        }
    }, [user]);

    const handleChooseClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("background_image", file);

        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/profiles/${user.data.user.profile.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: formData,
                }
            );

            if (!res.ok) throw new Error("Failed to upload background image");
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

            setPreviewImage(URL.createObjectURL(file));

            if (onBgUpdate) onBgUpdate(updatedProfile.background_image);

            toast.success("Background image updated!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update background image.");
        }
    };
    const handleDelete = async () => {
        try {
            const profileId = user?.data?.user?.profile?.id;
            if (!profileId) throw new Error("Profile ID not found");
            const res = await fetch(
                `http://127.0.0.1:8000/api/profiles/${profileId}/background-image`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            if (!res.ok && res.status !== 404)
                throw new Error("Failed to delete background image");

            setUser((prevUser) => ({
                ...prevUser,
                data: {
                    ...prevUser.data,
                    user: {
                        ...prevUser.data.user,
                        profile: {
                            ...prevUser.data.user.profile,
                            background_image: null,
                        },
                    },
                },
            }));

            const updatedUser = {
                ...user,
                data: {
                    ...user.data,
                    user: {
                        ...user.data.user,
                        profile: {
                            ...user.data.user.profile,
                            background_image: null,
                        },
                    },
                },
            };
            sessionStorage.setItem("authUser", JSON.stringify(updatedUser));

            setPreviewImage("/background_images/default-bg.jpg");
            if (onBgUpdate) onBgUpdate("/background_images/default-bg.jpg");

            toast.success("Background image reset to default!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to reset background image.");
        }
    };

    return (
        <RadixDialog.Root>
            <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
            <RadixDialog.Portal>
                <Overlay />
                <Content>
                    <Header>
                        <StyledH2>Edit Your Background Image</StyledH2>
                        <CloseButton asChild>
                            <IoMdClose />
                        </CloseButton>
                    </Header>

                    <ImagePreview src={previewImage} alt="Background Preview" />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    <ButtonContainer>
                        <ChooseButton onClick={handleChooseClick}>
                            <MdEdit />
                        </ChooseButton>
                        <DeleteButton onClick={handleDelete}>
                            <RiDeleteBin6Line />
                        </DeleteButton>
                    </ButtonContainer>
                </Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
