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
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const Content = styled(RadixDialog.Content)`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70rem;
    max-width: 95%;
    height: 33rem;
    max-height: 90%;
    background: var(--color-grey-900);
    color: var(--color-grey-0);
    padding: 2rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    overflow-y: auto;

    @media screen and (max-width: 1200px) {
        width: 60rem;
        padding: 1.8rem;
    }
    @media screen and (max-width: 944px) {
        width: 50rem;
        height: auto;
        padding: 1.5rem;
    }
    @media screen and (max-width: 704px) {
        width: 90%;
        padding: 1.2rem;
    }
    @media screen and (max-width: 544px) {
        width: 95%;
        padding: 1rem;
    }
`;

const Header = styled.div`
    position: relative;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-grey-700);
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 544px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        padding-bottom: 0.6rem;
    }
`;

const StyledH2 = styled.h2`
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 1.2;
    color: var(--color-grey-0);

    @media screen and (max-width: 944px) {
        font-size: 1.4rem;
    }
    @media screen and (max-width: 544px) {
        font-size: 1.2rem;
    }
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

    &:hover {
        color: var(--color-primary-light);
    }

    @media screen and (max-width: 944px) {
        font-size: 2rem;
    }
    @media screen and (max-width: 544px) {
        font-size: 1.8rem;
    }
`;

const ImagePreview = styled.img`
    width: 100%;
    height: 22rem;
    object-fit: cover;
    border: 1px solid var(--color-grey-700);
    border-radius: var(--radius-sm);

    @media screen and (max-width: 944px) {
        height: 18rem;
    }
    @media screen and (max-width: 704px) {
        height: 15rem;
    }
    @media screen and (max-width: 544px) {
        height: 12rem;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;

    @media screen and (max-width: 544px) {
        /* flex-direction: column; */
        gap: 0.6rem;
        margin-top: 0.8rem;
    }
`;

const ChooseButton = styled.button`
    display: flex;
    font-size: 2.4rem;
    align-items: center;
    gap: 0.3rem;
    color: #fff;
    background: var(--color-primary-light);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-xxl);
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &:hover {
        background: var(--color-primary);
    }

    @media screen and (max-width: 944px) {
        font-size: 2rem;
    }
    @media screen and (max-width: 544px) {
        font-size: 1.8rem;
        padding: 0.4rem 0.8rem;
    }
`;

const DeleteButton = styled(ChooseButton)`
    background: transparent;
    border: 1px solid var(--color-grey-700);
    color: var(--color-red-500);

    &:hover {
        background: var(--color-red-600);
        color: var(--color-error);
    }
`;

// ===== Component =====
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
            setPreviewImage("/background_images/linkedin-bg2.jpg");
        }
    }, [user]);

    const handleChooseClick = () => fileInputRef.current.click();

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
                    headers: { Authorization: `Bearer ${user.token}` },
                    body: formData,
                }
            );

            if (!res.ok) throw new Error("Failed to upload background image");
            const updatedProfile = await res.json();

            const updatedUser = {
                ...user,
                data: {
                    ...user.data,
                    user: { ...user.data.user, profile: updatedProfile },
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
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );

            if (!res.ok && res.status !== 404)
                throw new Error("Failed to delete background image");

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

            setUser(updatedUser);
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
                            <MdEdit /> Choose
                        </ChooseButton>
                        <DeleteButton onClick={handleDelete}>
                            <RiDeleteBin6Line /> Delete
                        </DeleteButton>
                    </ButtonContainer>
                </Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
