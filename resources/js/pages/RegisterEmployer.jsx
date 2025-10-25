import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TiWarningOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createNewUser } from "../services/apiUsers";
import Spinner from "../ui/Spinner";
import Footer from "./Footer";
import Header from "./Header";

const RegisterWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-48) var(--space-16);
    background-color: var(--color-grey-30);
    min-height: 100vh;
`;

const RegisterCard = styled.div`
    background: var(--color-grey-0);
    border-radius: var(--radius-xl);
    padding: var(--space-40);
    width: 100%;
    max-width: 60rem;
    box-shadow: var(--shadow-sm);
`;

const Title = styled.h2`
    text-align: center;
    font-size: var(--font-xl);
    color: var(--color-grey-900);
    margin-bottom: var(--space-12);
`;

const SubText = styled.p`
    text-align: center;
    color: var(--color-grey-600);
    margin-bottom: var(--space-32);
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
    margin-bottom: var(--space-24);

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

const Label = styled.label`
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--color-grey-900);
`;

const Input = styled.input`
    padding: 1rem 1.4rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
    outline: none;
    &:focus {
        border-color: var(--color-primary);
    }
`;

const TextArea = styled.textarea`
    padding: 1rem 1.4rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
    resize: vertical;
    outline: none;
    &:focus {
        border-color: var(--color-primary);
    }
`;

const ErrorMessage = styled.span`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-error);
    font-size: var(--font-xs);
`;

const Button = styled.button`
    width: 100%;
    background-color: var(--color-primary);
    color: #fff;
    border: none;
    padding: var(--space-12);
    border-radius: var(--radius-lg);
    font-weight: 600;
    font-size: var(--font-base);
    transition: 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: var(--color-primary-dark);
    }
`;

export default function RegisterEmployer() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { mutate, isLoading } = useMutation(createNewUser, {
        onSuccess: () => {
            toast.success("Employer account created successfully!");
            queryClient.invalidateQueries(["users"]);
            navigate("/login");
        },
        onError: (err) => toast.error(err.message),
    });

    const onSubmit = (data) => mutate({ ...data, role: "employer" });

    return (
        <>
            <Header />
            <RegisterWrapper>
                <RegisterCard>
                    <Title>Create your Employer Account</Title>
                    <SubText>
                        Join thousands of companies posting jobs and finding
                        talent.
                    </SubText>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGrid>
                            <InputGroup>
                                <Label>Full Name</Label>
                                <Input
                                    {...register("fullName", {
                                        required: "Full name is required",
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
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                />
                                {errors.email && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.email.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                />
                                {errors.password && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.password.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required:
                                            "Confirm password is required",
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <ErrorMessage>
                                        <TiWarningOutline />{" "}
                                        {errors.confirmPassword.message}
                                    </ErrorMessage>
                                )}
                            </InputGroup>

                            <InputGroup>
                                <Label>Company Name</Label>
                                <Input
                                    {...register("companyName", {
                                        required: "Company name is required",
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
                                <Input type="url" {...register("website")} />
                            </InputGroup>

                            <InputGroup>
                                <Label>Industry</Label>
                                <Input {...register("industry")} />
                            </InputGroup>

                            <InputGroup>
                                <Label>Company Logo</Label>
                                <Input type="file" {...register("logo")} />
                            </InputGroup>

                            <InputGroup style={{ gridColumn: "1 / -1" }}>
                                <Label>Company Description</Label>
                                <TextArea
                                    rows="3"
                                    {...register("description")}
                                    placeholder="Describe your company..."
                                />
                            </InputGroup>
                        </FormGrid>

                        <Button type="submit">
                            {isLoading ? (
                                <Spinner size="18px" color="#fff" />
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                </RegisterCard>
            </RegisterWrapper>
            <Footer />
        </>
    );
}
