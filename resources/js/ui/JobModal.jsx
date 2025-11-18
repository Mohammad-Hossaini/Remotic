import * as RadixDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CiWarning } from "react-icons/ci";
import styled from "styled-components";
import { useAuth } from "../hook/AuthContext";
import { createJob, updateJob } from "../services/apiAllJobs";
import { sendNotification } from "../services/apiNotifications";
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
    height: 90vh;
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
    border: none;
    outline: none;
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

    input,
    select,
    textarea {
        padding: 0.8rem;
        border-radius: 0.5rem;
        border: 1px solid #ced4da;
        font-size: 1.4rem;
        width: 100%;
        background-color: #fff;
        color: #111827;
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
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        font-weight: 600;
        min-width: 100px;
    }

    .cancel {
        background-color: #e5e7eb;
        color: #374151;
    }

    .save {
        background-color: #10b981;
        color: #fff;
    }
`;

const StyledWarning = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.4rem;
    color: #b91c1c;
`;

// ===== Component =====
export default function JobModal({ open, onOpenChange, job }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const isEditMode = Boolean(job);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            title: job?.title || "",
            description: job?.description || "",
            requirements: job?.requirements || "",
            salary_min: job?.salary_min || "",
            salary_max: job?.salary_max || "",
            job_type: job?.job_type || "",
            location: job?.location || "",
            status: job?.status || "draft",
            deadline: job?.deadline || "",
        },
    });

    const salaryMinValue = watch("salary_min");

    // ===== Job Mutation =====
    const jobMutation = useMutation({
        mutationFn: async (data) =>
            isEditMode ? updateJob(job.id, data) : createJob(data),
        onSuccess: async (response) => {
            const createdJob = response.job || response;
            queryClient.invalidateQueries(["jobs"]);
            queryClient.invalidateQueries(["postedJobs"]);
            toast.success(
                isEditMode
                    ? "Job updated successfully!"
                    : "Job created successfully!"
            );

            // 🔔 ارسال اعلان فقط در حالت ایجاد شغل جدید
            if (!isEditMode) {
                await sendNotification({
                    user_id: user?.data?.user?.id,
                    title: "New Job Posted",
                    message: `A new job "${
                        createdJob.title
                    }" has been posted by ${
                        user?.data?.user?.company?.name || "your company"
                    }.`,
                });
                toast.success("Notification sent successfully!");
            }

            reset();
            onOpenChange(false);
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.message || "Failed to save job!");
        },
    });

    const onSubmit = (data) => {
        jobMutation.mutate({
            company_id: user?.data?.user?.company?.id,
            ...data,
            salary_min: parseInt(data.salary_min),
            salary_max: parseInt(data.salary_max),
        });
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
            <RadixDialog.Portal>
                <DialogOverlay />
                <DialogContent>
                    <Header>
                        <h2>{isEditMode ? "Edit Job" : "Add New Job"}</h2>
                        <RadixDialog.Close asChild>
                            <IconButton aria-label="Close">
                                <Cross2Icon
                                    style={{ width: "32px", height: "32px" }}
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
                            <label>Title</label>
                            <input
                                {...register("title", {
                                    required: "Title is required",
                                })}
                            />
                            {errors.title && (
                                <StyledWarning>
                                    <CiWarning /> {errors.title.message}
                                </StyledWarning>
                            )}

                            <label>Description</label>
                            <textarea
                                {...register("description", {
                                    required: "Description is required",
                                })}
                            />
                            {errors.description && (
                                <StyledWarning>
                                    <CiWarning /> {errors.description.message}
                                </StyledWarning>
                            )}

                            <label>Requirements</label>
                            <textarea
                                {...register("requirements", {
                                    required: "Requirements is required",
                                })}
                            />
                            {errors.requirements && (
                                <StyledWarning>
                                    <CiWarning /> {errors.requirements.message}
                                </StyledWarning>
                            )}

                            <label>Salary Min</label>
                            <input
                                type="number"
                                {...register("salary_min", {
                                    required: "Salary min required",
                                    min: {
                                        value: 101,
                                        message:
                                            "Salary min must be greater than 100",
                                    },
                                })}
                            />
                            {errors.salary_min && (
                                <StyledWarning>
                                    <CiWarning /> {errors.salary_min.message}
                                </StyledWarning>
                            )}

                            <label>Salary Max</label>
                            <input
                                type="number"
                                {...register("salary_max", {
                                    required: "Salary max required",
                                    validate: (value) =>
                                        parseInt(value) >
                                            parseInt(salaryMinValue) ||
                                        "Salary max must be greater than min salary",
                                })}
                            />
                            {errors.salary_max && (
                                <StyledWarning>
                                    <CiWarning /> {errors.salary_max.message}
                                </StyledWarning>
                            )}

                            <label>Job Type</label>
                            <select
                                {...register("job_type", {
                                    required: "Job type is required",
                                })}
                            >
                                <option value="">-- Select Type --</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="remote">Remote</option>
                            </select>
                            {errors.job_type && (
                                <StyledWarning>
                                    <CiWarning /> {errors.job_type.message}
                                </StyledWarning>
                            )}

                            <label>Location</label>
                            <input
                                {...register("location", {
                                    required: "Location is required",
                                })}
                            />
                            {errors.location && (
                                <StyledWarning>
                                    <CiWarning /> {errors.location.message}
                                </StyledWarning>
                            )}

                            <label>Status</label>
                            <select
                                {...register("status", {
                                    required: "Please select status",
                                })}
                            >
                                <option value="">-- Select Status --</option>
                                <option value="draft">Draft</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                            {errors.status && (
                                <StyledWarning>
                                    <CiWarning /> {errors.status.message}
                                </StyledWarning>
                            )}

                            <label>Deadline</label>
                            <input
                                type="date"
                                min={today}
                                {...register("deadline", {
                                    required: "Select a deadline",
                                    validate: (value) =>
                                        new Date(value) > new Date() ||
                                        "Deadline must be a future date",
                                })}
                            />
                            {errors.deadline && (
                                <StyledWarning>
                                    <CiWarning /> {errors.deadline.message}
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
                                className="save"
                                disabled={jobMutation.isLoading}
                            >
                                {jobMutation.isLoading ? (
                                    <Spinner size="18px" color="#fff" />
                                ) : isEditMode ? (
                                    "Save Changes"
                                ) : (
                                    "Save Job"
                                )}
                            </button>
                        </Footer>
                    </form>
                </DialogContent>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
