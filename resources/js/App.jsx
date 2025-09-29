import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import PageNotFound from "./components/PageNotFound";
import Settings from "./components/Settings";
import EmployerPrivateRoute from "./features/authintication/EmployerPrivateRoute";
import JobseekerPrivateRoute from "./features/authintication/JobseekerPrivateRoute";

import Application from "./pages/application/Application";
import Applicant from "./pages/home/employer/Applicant";
import EmployerDashboard from "./pages/home/employer/EmployerDashboard";
import PostedJobs from "./pages/home/employer/PostedJobs";
import PostedNewJobs from "./pages/home/employer/PostedNewJobs";
import AllJobs from "./pages/home/job-seeker/AllJobs";
import AppliedJobs from "./pages/home/job-seeker/AppliedJobs";
import JobDetails from "./pages/home/job-seeker/JobDetails";
import JobSeekerDashboard from "./pages/home/job-seeker/JobSeekerDashboard";
import SavedJobs from "./pages/home/job-seeker/SavedJobs";
import SugesstedJobs from "./pages/home/job-seeker/SugesstedJobs";
import Welcome from "./pages/home/welcomPage/Welcome";
import Messages from "./pages/messages/Messages";

import { AuthProvider } from "./hook/AuthContext";
import BackGroundInfo from "./pages/background information/BackGroundInfo";
import CreateAccountPage from "./pages/CreateAccountPage";
import Home from "./pages/home/Home";
import LoginPage from "./pages/LoginPage";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import EmployerAppLayout from "./ui/EmployerAppLayout";
import SearchBar from "./pages/SearchBar";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            cacheTime: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
        },
    },
});

export default function App() {
    return (
        <AuthProvider>
            {" "}
            {/* ✅ AuthProvider wraps everything */}
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <GlobalStyles />

                    <Routes>
                        {/* Public pages */}
                        <Route path="/" element={<AllJobs />} />
                        <Route
                            path="/jobDetails/:id"
                            element={<JobDetails />}
                        />
                        <Route path="/home" element={<Home />} />
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/searchBar" element={<SearchBar />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/createAccount"
                            element={<CreateAccountPage />}
                        />
                        <Route
                            path="/login/createAccount"
                            element={<CreateAccountPage />}
                        />

                        {/* Job Seeker Routes */}
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

                        {/* Employer Routes */}
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
                            <Route path="applicant" element={<Applicant />} />
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

                        {/* 404 fallback */}
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>

                {/* Notifications */}
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

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AuthProvider>
    );
}
