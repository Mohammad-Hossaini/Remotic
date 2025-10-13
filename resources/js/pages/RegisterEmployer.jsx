import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TiWarningOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createNewUser } from "../services/apiUsers";
import Spinner from "../ui/Spinner";
import Footer from "./Footer";
import JobsHeader from "./JobsHeader";

/* --- استایل‌های پایه (مثل فورم کارمند) --- */
const PageWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 5rem 2rem 5rem;
    background-color: var(--color-grey-30);
    min-height: 100vh;
`;

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

const Title = styled.h2`
    font-size: 2.4rem;
    font-weight: 700;
    text-align: center;
    color: var(--color-grey-900);
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;

const Label = styled.label`
    font-weight: 600;
    font-size: 1.2rem;
    color: var(--color-grey-900);
`;

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

const StyledButtons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
`;

const RegisterButton = styled.button`
    background-color: var(--color-primary);
    color: #fff;
    padding: 1rem 2rem;
    border-radius: var(--radius-xxl);
    font-weight: 500;
    font-size: 1.1rem;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: var(--color-primary-dark);
    }
`;

const CancelButton = styled.button`
    background-color: var(--color-grey-200);
    color: var(--color-grey-700);
    padding: 1rem 2rem;
    border-radius: var(--radius-xxl);
    font-weight: 500;
    font-size: 1.1rem;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: var(--color-grey-300);
    }
`;

const ErrorMessage = styled.span`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-error);
    font-size: 1rem;
`;

export default function RegisterEmployer() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const password = watch("password");

    const { mutate, isLoading } = useMutation(createNewUser, {
        onSuccess: () => {
            toast.success("Employer account created successfully!");
            queryClient.invalidateQueries(["users"]);
            navigate("/login");
        },
        onError: (err) => toast.error(err.message),
    });

    const onSubmit = (data) => {
        mutate({ ...data, role: "employer" });
    };

    return (
        <>
            <JobsHeader />
            <PageWrapper>
                <Card>
                    <Title>Create Account — Employer</Title>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGrid>
                            <InputGroup>
                                <Label>Full Name</Label>
                                <Input
                                    {...register("fullName", {
                                        required: "Required",
                                    })}
                                />
                                {errors.fullName && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.fullName.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <Label>Company Name</Label>
                                <Input
                                    {...register("companyName", {
                                        required: "Required",
                                    })}
                                />
                                {errors.companyName && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.companyName.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <Label>Company Website</Label>
                                <Input
                                    type="url"
                                    placeholder="https://example.com"
                                    {...register("website")}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    {...register("email", {
                                        required: "Required",
                                    })}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    {...register("password", {
                                        required: "Required",
                                    })}
                                />
                            </InputGroup>

                            {/* <InputGroup>
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: "Required",
                                        validate: (v) =>
                                            v === password ||
                                            "Passwords do not match",
                                    })}
                                />
                            </InputGroup> */}
                            <InputGroup>
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required:
                                            "Password and Confirm passsword must match",
                                    })}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Phone</Label>
                                <Input
                                    type="tel"
                                    {...register("phone", {
                                        required: "Required",
                                    })}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Company Size</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 50"
                                    {...register("companySize", {
                                        required: "Required",
                                    })}
                                />
                            </InputGroup>

                            <InputGroup style={{ gridColumn: "1 / span 2" }}>
                                <Label>Company Description</Label>
                                <TextArea
                                    rows="3"
                                    {...register("description")}
                                    placeholder="Describe your company, mission, and what you do..."
                                />
                            </InputGroup>
                        </FormGrid>

                        <StyledButtons>
                            <CancelButton type="reset">Cancel</CancelButton>
                            <RegisterButton type="submit">
                                {isLoading ? (
                                    <Spinner size="18px" color="#fff" />
                                ) : (
                                    "Sign Up"
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
