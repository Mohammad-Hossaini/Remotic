// LoginPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { CiWarning } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { loginUser } from "../features/authintication/apiLogin";
import { useAuth } from "../hook/AuthContext";
import Spinner from "../ui/Spinner";
import Footer from "./Footer";
import JobsHeader from "./JobsHeader";

/* Page Wrapper */
const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-grey-30);
    padding-bottom: 4rem;
`;

/* Card */
const Card = styled.div`
    background-color: var(--color-grey-0);
    padding: 4rem 3rem;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    width: 40rem;
    max-width: 95%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 10rem; /* space from top */
    margin-bottom: 5rem; /* space from footer */
`;

/* Title */
const Title = styled.h2`
    font-size: 2.4rem;
    color: var(--color-grey-900);
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    text-align: center;
`;

/* Input Group */
const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1.5rem;
    position: relative;
`;

/* Label */
const Label = styled.label`
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--color-grey-900);
`;

/* Input */
const Input = styled.input`
    padding: 1rem 1.4rem;
    font-size: 1.1rem;
    border: 1px solid
        ${(props) =>
            props.error ? "var(--color-error)" : "var(--color-grey-300)"};
    border-radius: var(--radius-sm);
    outline: none;
    width: 100%;

    &:focus {
        border-color: var(--color-primary);
    }
`;

/* Eye Icon */
const EyeIcon = styled.div`
    position: absolute;
    right: 1rem;
    top: 3rem;
    cursor: pointer;
    color: var(--color-grey-500);
    font-size: 1.4rem;
`;

/* Warning */
const Warning = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1rem;
    color: var(--color-error);
`;

const Button = styled.button`
    margin-top: 1rem;
    padding: 1rem 1.8rem;
    width: 10rem;
    border-radius: var(--radius-xxl);
    background-color: var(--color-primary);
    color: #fff;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s ease;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: var(--color-primary-dark);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

/* Account Link */
const CreateAccount = styled.p`
    margin-top: 1rem;
    font-size: 1rem;
    color: var(--color-grey-700);
    text-align: center;

    a {
        color: var(--color-primary);
        font-weight: 600;
        margin-left: 0.5rem;
        cursor: pointer;
        transition: 0.2s ease;

        &:hover {
            color: var(--color-primary-dark);
            text-decoration: underline;
        }
    }
`;

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const user = await loginUser(data);
            if (!user || !user.token) {
                toast.error("Invalid credentials!");
                setLoading(false);
                return;
            }
            login(user);
            toast.success("Login successful!");
            if (user.role === "employer") navigate("/employerApp");
            else navigate("/app");
        } catch (err) {
            toast.error("Login failed: " + (err.message || "Server error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <JobsHeader />
            <PageWrapper>
                <Card>
                    <Title>Login to Remote Work Hub</Title>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                })}
                                error={errors.email}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <Warning>
                                    <CiWarning /> {errors.email.message}
                                </Warning>
                            )}
                        </InputGroup>

                        <InputGroup>
                            <Label>Password</Label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                error={errors.password}
                                placeholder="Enter your password"
                            />
                            <EyeIcon
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <AiFillEyeInvisible />
                                ) : (
                                    <AiFillEye />
                                )}
                            </EyeIcon>
                            {errors.password && (
                                <Warning>
                                    <CiWarning /> {errors.password.message}
                                </Warning>
                            )}
                        </InputGroup>

                        <Button type="submit" disabled={loading}>
                            {/* {loading ? "Logging in..." : "Login"} */}
                            {loading ? (
                                <Spinner size="18px" color="#fff" />
                            ) : (
                                "Login"
                            )}
                        </Button>

                        <CreateAccount>
                            Don’t have an account?
                            <a onClick={() => navigate("/sign-up")}>
                                Create Account
                            </a>
                        </CreateAccount>
                    </form>
                </Card>
                <Footer />
                <ToastContainer position="top-right" autoClose={2000} />
            </PageWrapper>
        </>
    );
}
