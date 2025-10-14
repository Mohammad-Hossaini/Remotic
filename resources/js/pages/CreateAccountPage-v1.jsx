import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TiWarningOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hook/AuthContext";
import { createNewUser } from "../services/apiUsers";
import Spinner from "../ui/Spinner";
import Footer from "./Footer";
import JobsHeader from "./JobsHeader";

/* Page Wrapper */
const PageWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 5rem 2rem 5rem;
    background-color: var(--color-grey-30);
    min-height: 100vh;
`;

/* Card */
const Card = styled.div`
    background-color: var(--color-grey-0);
    padding: 3.5rem 3rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    width: 60rem;
    max-width: 95%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

/* Title */
const Title = styled.h2`
    font-size: 2.4rem;
    font-weight: 700;
    text-align: center;
    color: var(--color-grey-900);
`;

/* Form Grid */
const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
`;

/* Input Group */
const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;

/* Label */
const Label = styled.label`
    font-weight: 600;
    font-size: 1.2rem;
    color: var(--color-grey-900);
`;

/* Input */
const Input = styled.input`
    padding: 1rem 1.4rem;
    font-size: 1.1rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-sm);
    outline: none;
    &:focus {
        border-color: var(--color-primary);
    }
`;

/* TextArea */
const TextArea = styled.textarea`
    padding: 1rem 1.4rem;
    font-size: 1.1rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-sm);
    outline: none;
    resize: vertical;
    &:focus {
        border-color: var(--color-primary);
    }
`;

/* Select */
const Select = styled.select`
    padding: 1rem 1.4rem;
    font-size: 1.1rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-sm);
    outline: none;
    background-color: #fff;
    &:focus {
        border-color: var(--color-primary);
    }
`;

/* Buttons Container */
const StyledButtons = styled.div`
    display: flex;
    column-gap: 1.5rem;
    margin-top: 2rem;
    justify-content: space-between;
`;

/* Register Button */
const RegisterButton = styled.button`
    background-color: var(--color-primary);
    color: #fff;
    padding: 1rem 2rem;
    border-radius: var(--radius-xxl);
    font-weight: 500;
    font-size: 1.1rem;
    cursor: pointer;
    border: none;
    transition: 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 120px;
    &:hover {
        background-color: var(--color-primary-dark);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

/* Cancel Button */
const CancelButton = styled.button`
    background-color: var(--color-grey-200);
    color: var(--color-grey-700);
    padding: 1rem 2rem;
    border-radius: var(--radius-xxl);
    font-weight: 500;
    font-size: 1.1rem;
    cursor: pointer;
    border: none;
    transition: 0.2s ease;
    &:hover {
        background-color: var(--color-grey-300);
    }
`;

/* Error Message */
const ErrorMessage = styled.span`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-error);
    font-size: 1rem;
    margin-top: 0.3rem;
`;

export default function CreateAccountPage() {
    const [role, setRole] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        reset,
        register,
        watch,
        formState: { errors },
    } = useForm();
    const password = watch("password");

    const { mutate, isLoading } = useMutation(createNewUser, {
        onSuccess: (data) => {
            toast.success("Created account successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });

            // ذخیره در AuthContext
            login({
                token: data.token,
                user: data.user,
                role: data.user.role,
            });
            navigate("/login");

            // if (data.user.role === "employer") {
            //     navigate("/employerApp/employerDashboard");
            // } else if (data.user.role === "job_seeker") {
            //     navigate("/app/jobSeekerDashboard");
            // } else {
            //     navigate("/");
            // }

            reset();
        },
        onError: (err) => toast.error(err.message),
    });

    const onSubmit = (formData) => {
        if (!role) {
            toast.error("Please select a role before continuing");
            return;
        }

        const payload = {
            ...formData,
            role,
        };

        mutate(payload);
    };

    return (
        <>
            <JobsHeader />
            <PageWrapper>
                <Card>
                    <Title>Create an Account</Title>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGrid>
                            {/* First Name */}
                            <InputGroup>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your first name"
                                    {...register("firstName", {
                                        required: "This field is required",
                                    })}
                                />
                                {errors.firstName && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.firstName.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            {/* Last Name */}
                            <InputGroup>
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password", {
                                        required: "This field is required",
                                    })}
                                />
                                {errors.password && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.password.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            {/* Confirm Password */}
                            <InputGroup>
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword", {
                                        required: "This field is required",
                                        validate: (value) =>
                                            value === password ||
                                            "Password do not match",
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.confirmPassword.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>
                            {/* Email */}
                            <InputGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register("email", {
                                        required: "This field is required",
                                    })}
                                />
                                {errors.email && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.email.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            {/* Role */}
                            <InputGroup>
                                <Label>Role / User Type</Label>
                                <Select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="">Select Role</option>
                                    <option value="job_seeker">
                                        Job Seeker
                                    </option>
                                    <option value="employer">Employer</option>
                                </Select>
                            </InputGroup>
                        </FormGrid>
                        {/* Extra fields for jobseeker */}
                        {role === "job_seeker" && (
                            <FormGrid>
                                {/* First Name */}
                                <InputGroup>
                                    <Label>First Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your first name"
                                        {...register("firstName", {
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.firstName && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.firstName.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>
                                {/* Last Name */}
                                <InputGroup>
                                    <Label>Last Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your last name"
                                        {...register("lastName", {
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.lastName && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.lastName.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>
                                <InputGroup>
                                    <Label>Phone Number</Label>
                                    <Input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        {...register("phone", {
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.phone && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.phone.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>
                                <InputGroup>
                                    <Label>Description</Label>
                                    <TextArea
                                        placeholder="Describe yourself"
                                        {...register("description")}
                                    />
                                </InputGroup>

                                <InputGroup>
                                    <Label>Resume</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        {...register("resume", {
                                            required: "Resume is required", // ✅ اعتبارسنجی
                                        })}
                                    />
                                    {errors.resume && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.resume.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>

                                <InputGroup>
                                    <Label>Skills</Label>
                                    <Input
                                        type="text"
                                        placeholder="JavaScript, React"
                                        {...register("skills", {
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.skills && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.skills.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>

                                <InputGroup>
                                    <Label>Experience (Optional)</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter experience"
                                        {...register("experience")}
                                    />
                                </InputGroup>
                            </FormGrid>
                        )}

                        {/* Extra fields for employer */}
                        {role === "employer" && (
                            <FormGrid>
                                {/* Company Name */}
                                <InputGroup>
                                    <Label>Company Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter company name"
                                        {...register("companyName", {
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.companyName && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.companyName.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>

                                {/* Industry */}
                                <InputGroup>
                                    <Label>Industry</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter industry"
                                        {...register("industry", {
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.industry && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.industry.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>

                                {/* Location */}
                                <InputGroup>
                                    <Label>Location</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter company location"
                                        {...register("location", {
                                            required: "This field is required",
                                        })}
                                    />
                                    {errors.location && (
                                        <ErrorMessage>
                                            <TiWarningOutline />{" "}
                                            {errors.location.message}
                                        </ErrorMessage>
                                    )}
                                </InputGroup>

                                {/* Description */}
                                <InputGroup>
                                    <Label>Description</Label>
                                    <TextArea
                                        placeholder="Write company description"
                                        {...register("description")}
                                    />
                                </InputGroup>

                                {/* Website */}
                                <InputGroup>
                                    <Label>Website (Optional)</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter website"
                                        {...register("website")}
                                    />
                                </InputGroup>
                            </FormGrid>
                        )}

                        <StyledButtons>
                            <CancelButton type="reset">Cancel</CancelButton>
                            <RegisterButton type="submit">
                                {/* SIGN IN */}
                                {isLoading ? (
                                    <Spinner size="18px" color="#fff" />
                                ) : (
                                    "SIGN IN"
                                )}
                            </RegisterButton>
                        </StyledButtons>
                    </form>
                </Card>
            </PageWrapper>
            <Footer />
        </>
    );
}
