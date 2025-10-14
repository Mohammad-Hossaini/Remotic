import * as RadixDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { CiWarning } from "react-icons/ci";
import styled from "styled-components";
import { applyForJob } from "../services/application";
import Spinner from "./Spinner";

// ===== Styled Components =====
const DialogOverlay = styled(RadixDialog.Overlay)`
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    inset: 0;
`;

const DialogContent = styled(RadixDialog.Content)`
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 600px;
    height: auto;
    max-height: 90vh;
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
        font-size: 1.8rem;
        font-weight: 600;
    }
`;

const IconButton = styled.button`
    all: unset;
    position: absolute;
    top: 1rem;
    right: 1rem;
    border-radius: 50%;
    height: 25px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const Body = styled.div`
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    label {
        font-weight: 600;
        font-size: 1.4rem;
    }

    textarea,
    input {
        padding: 0.8rem;
        border-radius: 0.5rem;
        border: 1px solid #ced4da;
        font-size: 1.4rem;
        width: 100%;
    }

    textarea {
        min-height: 6rem;
        resize: vertical;
    }
`;

const Footer = styled.div`
    flex-shrink: 0;
    padding: 1.5rem 2rem;
    border-top: 1px solid #ced4da;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
        padding: 0.8rem 1.5rem;
        font-size: 1.4rem;
        border-radius: var(--radius-lg);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        min-width: 100px;
        font-weight: 600;
    }

    .cancel {
        background-color: var(--color-grey-200, #e5e7eb);
        color: var(--color-grey-700, #374151);

        &:hover {
            background-color: var(--color-grey-300, #d1d5db);
        }
    }

    .apply {
        background-color: var(--color-primary, #16a34a);
        color: #fff;

        &:hover {
            background-color: var(--color-primary-dark, #15803d);
        }

        &:disabled {
            opacity: 0.65;
            cursor: not-allowed;
        }
    }
`;

const StyledWarning = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.4rem;
    color: #b91c1c;
`;

const FileName = styled.span`
    font-size: 1.3rem;
    color: #555;
`;

// ===== Main Component =====
export default function JobApplyDialog({ open, onOpenChange, jobId }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const [fileName, setFileName] = useState("");

    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("cover_letter", values.cover_letter);
            if (values.resume_path[0])
                formData.append("resume_path", values.resume_path[0]);

            const response = await applyForJob(jobId, formData);
            toast.success(
                response.message || "Application submitted successfully!"
            );
            onOpenChange(false);
            reset();
            setFileName("");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to apply");
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
                <RadixDialog.Portal>
                    <DialogOverlay />
                    <DialogContent>
                        <Header>
                            <h2>Apply for Job</h2>
                            <RadixDialog.Close asChild>
                                <IconButton aria-label="Close">
                                    <Cross2Icon
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                        }}
                                    />
                                </IconButton>
                            </RadixDialog.Close>
                        </Header>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: "1 1 auto",
                                minHeight: 0,
                            }}
                        >
                            <Body>
                                <label htmlFor="cover_letter">
                                    Cover Letter
                                </label>
                                <textarea
                                    id="cover_letter"
                                    placeholder="Write a short cover letter..."
                                    {...register("cover_letter")}
                                />

                                <label htmlFor="resume_path">
                                    Upload Resume (PDF/DOC)
                                </label>
                                <input
                                    id="resume_path"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    {...register("resume_path", {
                                        required: "Please upload your resume",
                                        onChange: (e) =>
                                            setFileName(
                                                e.target.files[0]?.name || ""
                                            ),
                                    })}
                                />
                                {fileName && <FileName>📄 {fileName}</FileName>}
                                {errors.resume_path && (
                                    <StyledWarning>
                                        <CiWarning />
                                        {errors.resume_path.message}
                                    </StyledWarning>
                                )}
                            </Body>

                            <Footer>
                                <button
                                    type="button"
                                    className="cancel"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="apply"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <Spinner size="18px" color="#fff" />
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </Footer>
                        </form>
                    </DialogContent>
                </RadixDialog.Portal>
            </RadixDialog.Root>
        </>
    );
}
