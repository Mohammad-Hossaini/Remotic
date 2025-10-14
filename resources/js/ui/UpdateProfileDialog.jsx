import * as RadixDialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import styled from "styled-components";
import { useAuth } from "../hook/AuthContext";
import Spinner from "./Spinner";

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
    transform: translate(-50%, -50%);
    width: 60rem;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const Header = styled.div`
    position: relative;
    padding: 2rem;
    border-bottom: 1px solid #ced4da;
    flex-shrink: 0;

    h2 {
        font-size: 2rem;
        font-weight: 600;
    }
`;

const CloseIcon = styled(RxCross1)`
    position: absolute;
    top: 2rem;
    right: 2rem;
    font-size: 2rem;
    cursor: pointer;
`;

const Body = styled.div`
    /* flex: 1; */
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    label {
        font-weight: 600;
        font-size: 1.4rem;
    }

    input {
        padding: 0.8rem;
        border-radius: 0.5rem;
        border: 1px solid #ced4da;
        font-size: 1.4rem;
        width: 100%;
    }
    textarea {
        border-radius: 0.5rem;
        border: 1px solid #ced4da;
        padding: 0.8rem;
        width: 100%;
        min-height: 10rem;
        resize: vertical;
    }
`;

const Footer = styled.div`
    flex-shrink: 0;
    padding: 1.5rem 2rem;
    border-top: 1px solid #ced4da;
    display: flex;
    justify-content: space-between;

    button {
        padding: 0.8rem 1.5rem;
        font-size: 1.4rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
    }

    .cancel {
        background-color: #f1f3f5;
        color: #495057;
    }

    .save {
        background-color: #087f5b;
        color: #fff;

        &:hover {
            background-color: #066f4b;
        }
    }
`;

// ===== Component =====
export default function UpdateProfileDialog({ trigger, onUpdate }) {
    const { user, setUser } = useAuth();
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            firstName: user?.data?.user?.profile?.first_name || "",
            lastName: user?.data?.user?.profile?.last_name || "",
            education: user?.data?.user?.profile?.education || "",
            email: user?.data?.user?.email || "",
            mobile: user?.data?.user?.profile?.phone || "",
            description: user?.data?.user?.profile?.description || "",
            skills: user?.data?.user?.profile?.skills || "",
        },
    });

    useEffect(() => {
        reset({
            firstName: user?.data?.user?.profile?.first_name || "",
            lastName: user?.data?.user?.profile?.last_name || "",
            education: user?.data?.user?.profile?.education || "",
            email: user?.data?.user?.email || "",
            mobile: user?.data?.user?.profile?.phone || "",
            description: user?.data?.user?.profile?.description || "",
            skills: user?.data?.user?.profile?.skills || "",
        });
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("first_name", data.firstName);
            formData.append("last_name", data.lastName);
            formData.append("education", data.education);
            formData.append("email", data.email);
            formData.append("phone", data.mobile);
            formData.append("description", data.description);
            formData.append("skills", data.skills);

            const res = await fetch(
                `http://127.0.0.1:8000/api/profiles/${user?.data?.user?.profile?.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        Accept: "application/json",
                    },
                    body: formData,
                }
            );

            const updated = await res.json();

            if (setUser) {
                setUser((prev) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        user: { ...prev.data.user, profile: updated },
                    },
                }));
            }

            if (onUpdate) onUpdate(updated);
            setOpen(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile.");
        }
    };

    return (
        <RadixDialog.Root open={open} onOpenChange={setOpen}>
            <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
            <RadixDialog.Portal>
                <DialogOverlay />
                <DialogContent>
                    <Header>
                        <h2>Basic Info</h2>
                        <RadixDialog.Close asChild>
                            <CloseIcon />
                        </RadixDialog.Close>
                    </Header>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            // flex: 1,
                            flex: "1 1 auto",
                            minHeight: 0,
                        }}
                    >
                        <Body>
                            <label>First Name</label>
                            <input {...register("firstName")} />
                            <label>Last Name</label>
                            <input {...register("lastName")} />
                            {/* <label>Education</label>
                            <input {...register("education")} /> */}
                            <label>Email</label>
                            <input {...register("email")} />
                            <label>Mobile</label>
                            <input {...register("mobile")} />
                            <label>Description</label>
                            <textarea {...register("description")} />
                            <label>Resume</label>
                            <input
                                type="file"
                                {...register("resume")}
                                accept=".pdf,.doc,.docx"
                            />
                        </Body>

                        <Footer>
                            <button
                                type="button"
                                className="cancel"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save"
                                disabled={isSubmitting}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    minWidth: "80px", 
                                }}
                            >
                                {isSubmitting ? (
                                    <Spinner size="18px" color="#fff" />
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </Footer>
                    </form>
                </DialogContent>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
