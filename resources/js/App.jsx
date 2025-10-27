import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

import { AuthProvider, useAuth } from "./hook/AuthContext";
import GlobalStyles from "./styles/GlobalStyles";

import PageNotFound from "./components/PageNotFound";
import Settings from "./components/Settings";
import EmployerPrivateRoute from "./features/authintication/EmployerPrivateRoute";
import JobseekerPrivateRoute from "./features/authintication/JobseekerPrivateRoute";

// ✅ Pages
import Application from "./pages/application/Application";
import BackGroundInfo from "./pages/background information/BackGroundInfo";
// import CreateAccountPage from "./pages/CreateAccountPage";
import Home from "./pages/home/Home";
import Welcome from "./pages/home/welcomPage/Welcome";
import LoginPage from "./pages/LoginPage";
import Messages from "./pages/messages/Messages";
import RegisterEmployer from "./pages/RegisterEmployer";
import RegisterJobSeeker from "./pages/RegisterJobSeeker";
import SearchBar from "./pages/SearchBar";
import SignUpPage from "./pages/SignUpPage";

// ✅ Job Seeker Pages
import AllJobs from "./pages/home/job-seeker/AllJobs";
import AppliedJobs from "./pages/home/job-seeker/AppliedJobs";
import JobDetails from "./pages/home/job-seeker/JobDetails";
import JobSeekerDashboard from "./pages/home/job-seeker/JobSeekerDashboard";
import SavedJobs from "./pages/home/job-seeker/SavedJobs";
import SugesstedJobs from "./pages/home/job-seeker/SugesstedJobs";

// ✅ Employer Pages
import EmployerDashboard from "./pages/home/employer/EmployerDashboard";
import PostedJobs from "./pages/home/employer/PostedJobs";
import PostedNewJobs from "./pages/home/employer/PostedNewJobs";

// ✅ Layouts
import AppLayout from "./ui/AppLayout";
import EmployerAppLayout from "./ui/EmployerAppLayout";

// =======================================================
// ✅ React Query Client
// =======================================================
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            cacheTime: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
        },
    },
});

// =======================================================
// ✅ Socket.IO Token-Based Connection Handler
// =======================================================
function SocketHandler() {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user?.token) {
            socket?.disconnect();
            setSocket(null);
            return;
        }

        const newSocket = io("http://localhost:5000", {
            auth: { token: user.token },
            transports: ["websocket"], // ✅ more stable
        });

        newSocket.on("connect", () =>
            console.log("✅ Socket connected:", newSocket.id)
        );

        // newSocket.on("welcome", (msg) => console.log("🟢 Server says:", msg));

        // newSocket.on("disconnect", () => console.log("⚠️ Socket disconnected"));

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?.token]);

    return null;
}

// =======================================================
// ✅ Main App Component
// =======================================================
export default function App() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <GlobalStyles />
                    <SocketHandler />

                    <Routes>
                        {/* ---------------- PUBLIC ROUTES ---------------- */}
                        <Route path="/" element={<AllJobs />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/searchBar" element={<SearchBar />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/sign-up" element={<SignUpPage />} />
                        <Route
                            path="/register-job-seeker"
                            element={<RegisterJobSeeker />}
                        />
                        <Route
                            path="/register-employer"
                            element={<RegisterEmployer />}
                        />
                        <Route
                            path="/jobDetails/:id"
                            element={<JobDetails />}
                        />
                        <Route path="/settings" element={<Settings />} />

                        {/* ---------------- JOB SEEKER ROUTES ---------------- */}
                        <Route
                            path="/app/*"
                            element={
                                <JobseekerPrivateRoute role="jobseeker">
                                    <AppLayout />
                                </JobseekerPrivateRoute>
                            }
                        >
                            <Route index element={<JobSeekerDashboard />} />
                            <Route
                                path="jobSeekerDashboard"
                                element={<JobSeekerDashboard />}
                            />
                            <Route path="allJobs" element={<AllJobs />} />
                            <Route
                                path="allJobs/jobDetails/:id"
                                element={<JobDetails />}
                            />
                            <Route
                                path="appliedJobs"
                                element={<AppliedJobs />}
                            />
                            <Route path="savedJobs" element={<SavedJobs />} />
                            <Route
                                path="sugessteddJobs"
                                element={<SugesstedJobs />}
                            />
                            <Route
                                path="profile"
                                element={<BackGroundInfo />}
                            />
                            <Route path="messages" element={<Messages />} />
                            <Route
                                path="application"
                                element={<Application />}
                            />
                        </Route>

                        {/* ---------------- EMPLOYER ROUTES ---------------- */}
                        <Route
                            path="/employerApp/*"
                            element={
                                <EmployerPrivateRoute>
                                    <EmployerAppLayout />
                                </EmployerPrivateRoute>
                            }
                        >
                            <Route index element={<EmployerDashboard />} />
                            <Route
                                path="employerDashboard"
                                element={<EmployerDashboard />}
                            />
                            <Route path="allJobs" element={<AllJobs />} />
                            <Route
                                path="allJobs/jobDetails/:id"
                                element={<JobDetails />}
                            />
                            <Route path="messages" element={<Messages />} />
                            <Route
                                path="application"
                                element={<Application />}
                            />
                            <Route path="postedJobs" element={<PostedJobs />} />
                            <Route
                                path="postedNewJobs"
                                element={<PostedNewJobs />}
                            />
                            <Route
                                path="profile"
                                element={<BackGroundInfo />}
                            />
                        </Route>

                        {/* ---------------- 404 PAGE ---------------- */}
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>

                    {/* ✅ Toaster Notifications */}
                    <Toaster
                        position="top-right"
                        gutter={12}
                        containerStyle={{ margin: "8px" }}
                        toastOptions={{
                            success: { duration: 3000 },
                            error: { duration: 5000 },
                            style: {
                                fontSize: "16px",
                                maxWidth: "500px",
                                padding: "16px 24px",
                                backgroundColor: "var(--color-grey-0)",
                                color: "var(--color-grey-700)",
                            },
                        }}
                    />
                </BrowserRouter>

                {/* ✅ React Query DevTools */}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AuthProvider>
    );
}
