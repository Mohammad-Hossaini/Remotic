import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMiniHeart } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Loader from "../../../components/loader/Loader";
import { useAuth } from "../../../hook/AuthContext";
import { getJobs } from "../../../services/apiAllJobs";
import {
    addFavoriteJob,
    getMyFavorites,
    removeFavoriteJob,
} from "../../../services/apiFavorites";
import Button from "../../../ui/Button";
import DialogDemo from "../../../ui/DialogDemo";
import Footer from "../../Footer";
import Header from "../../Header";
import JobsHeader from "../../JobsHeader";
import SearchBar from "../../SearchBar";

/* ==============================
   Styled Components
============================== */
const AllJobsWrapper = styled.div`
    min-height: 100vh;

    /* 🌙 Dark Mode */
    [data-theme="dark"] & {
        background-color: var(--color-grey-30);
    }
`;

const JobsContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem;
`;

const JobStatus = styled.span`
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: var(--radius-md);
    color: #fff;
    text-transform: uppercase;
    background-color: ${(props) =>
        props.status === "open"
            ? "var(--color-success)"
            : props.status === "closed"
            ? "var(--color-error)"
            : props.status === "draft"
            ? "var(--color-warning)"
            : "var(--color-grey-500)"};
`;

const JobText = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

    [data-theme="dark"] & {
        color: var(--color-grey-100);
    }
`;

const JobPosition = styled.p`
    font-size: var(--font-base);
    font-weight: 500;
    color: var(--color-grey-700);

    [data-theme="dark"] & {
        color: var(--color-grey-300);
    }
`;

const JobInfo = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.8rem;
    font-size: var(--font-sm);
    color: var(--color-grey-500);

    [data-theme="dark"] & {
        color: var(--color-grey-400);
    }
`;

const CompanyName = styled.span`
    font-weight: 700;
    color: var(--color-grey-900);

    [data-theme="dark"] & {
        color: var(--color-grey-300);
    }
`;

const Location = styled.span`
    font-weight: 600;
    color: var(--color-grey-700);

    [data-theme="dark"] & {
        color: var(--color-grey-300);
    }
`;

const Salary = styled.span`
    font-weight: 600;
    color: var(--color-success);

    [data-theme="dark"] & {
        color: var(--color-success);
    }
`;

const PostedAt = styled.span`
    font-size: var(--font-xs);
    color: var(--color-grey-400);

    [data-theme="dark"] & {
        color: var(--color-grey-500);
    }
`;

/* ---------------- Modal Styling ---------------- */
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: var(--radius-lg);
    max-width: 500px;
    width: 90%;
    max-height: 500px;
    text-align: center;
    position: relative;

    [data-theme="dark"] & {
        background-color: var(--color-grey-800);
        color: var(--color-grey-100);
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: var(--color-grey-600);
    cursor: pointer;

    [data-theme="dark"] & {
        color: var(--color-grey-200);
    }
`;

const ModalTitle = styled.h2`
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1rem;
`;

const JobImg = styled.img`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 3px solid var(--color-primary);
    background: #fff;
    transition: transform 0.4s ease, box-shadow 0.3s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);

    [data-theme="dark"] & {
        background: var(--color-grey-900);
    }

    @media (max-width: 768px) {
        width: 60px;
        height: 60px;
    }

    @media (max-width: 480px) {
        width: 55px;
        height: 55px;
    }
`;

const ModalDescription = styled.p`
    font-size: 1.4rem;
    color: var(--color-grey-700);
    margin-bottom: 2rem;

    [data-theme="dark"] & {
        color: var(--color-grey-200);
    }
`;

const ModalButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const WideButton = styled(Button)`
    width: 100%;
    font-size: 1.2rem;
    padding: 0.9rem 1.2rem;
    border-radius: var(--radius-md);
    transition: all 0.3s ease;

    [data-theme="dark"] & {
        background-color: #374151;
        color: #d1d5db;
        border: 1px solid #4b5563;

        &:hover {
            background-color: #4b5563;
            color: #fff;
            border-color: #4b5563;
        }
    }
`;

/* ---------------- Job Card Styling ---------------- */
const JobTitle = styled.h3`
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
    margin-bottom: 0.4rem;
    margin-top: 0.6rem;
    transition: color 0.3s ease;

    [data-theme="dark"] & {
        color: var(--color-grey-400);
    }

    @media (max-width: 768px) {
        font-size: 1.25rem;
    }

    @media (max-width: 480px) {
        font-size: 1.1rem;
    }
`;

const JobDescription = styled.p`
    margin-top: 0.8rem;
    font-size: 0.95rem;
    color: var(--color-grey-600);
    line-height: 1.5;

    [data-theme="dark"] & {
        color: var(--color-grey-400);
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    @media (max-width: 480px) {
        font-size: 0.85rem;
    }
`;
const JobsCard = styled.div`
    width: 105%;
    max-width: 400px;
    min-height: 270px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(145deg, #ffffff, #f3f4f6);
    padding: 2rem;
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-grey-200);
    position: relative;
    overflow: hidden;
    transition: all 0.35s ease;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.06);

    [data-theme="dark"] & {
        background: var(--color-grey-0); /* 🌙 dark mode default bg */
        border: 1px solid var(--color-grey-700);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    &:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        background: linear-gradient(145deg, #f8fafc, #ffffff);

        ${JobImg} {
            transform: scale(1.08) rotate(-2deg);
        }

        ${JobTitle} {
            color: var(--color-primary);
        }

        .hover-overlay {
            opacity: 1;
            pointer-events: auto;
        }

        [data-theme="dark"] & {
            background: var(--color-grey-0); /* 🌙 dark mode hover bg */
        }
    }

    @media (max-width: 1200px) and (min-width: 769px) {
        max-width: 550px;
        padding: 1.6rem;
    }

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 1.2rem;
    }

    @media (max-width: 480px) {
        padding: 1rem;
        border-radius: var(--radius-lg);
    }
`;

const JobList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 3.8rem;
    padding-top: 2rem;
`;

const HoverOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 45%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: var(--space-16);
    opacity: 0;
    transition: opacity 0.3s ease;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(25px);
    border-top: 1px solid var(--color-grey-200);

    [data-theme="dark"] & {
        background: rgba(0, 0, 0, 0.5);
        border-top: 1px solid var(--color-grey-700);
    }

    /* 📱 Mobile Fix */
    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: auto;
        padding: 0.8rem 1rem;
        position: static;
        opacity: 1;
        background: none;
        backdrop-filter: none;
        border-top: none;
        gap: 0.8rem;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 0.6rem;
        padding: 0.6rem 0;
    }
`;

const FancyButton = styled(Button)`
    min-width: 140px;
    font-size: var(--font-sm);
    font-weight: 600;
    border-radius: var(--radius-sm);
    padding: var(--space-12) var(--space-20);
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease, box-shadow 0.2s ease,
        background-color 0.3s ease, color 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    /* 🌙 Dark mode hover fix */
    [data-theme="dark"] & {
        background-color: var(--color-grey-300);
        color: var(--color-grey-0);
        border: 1px solid var(--color-primary);

        &:hover {
            background-color: var(--color-primary);
            color: #fff;
            border-color: var(--color-primary);
        }
    }

    /* 📱 Mobile button alignment */
    @media (max-width: 768px) {
        flex: 1;
        width: auto;
        font-size: 0.95rem;
        padding: 0.7rem 1rem;
    }

    @media (max-width: 480px) {
        width: 100%;
        font-size: 0.9rem;
    }
`;

const HeartIcon = styled(HiMiniHeart)`
    cursor: pointer;
    font-size: 2rem;
    color: ${(props) => (props.active ? "red" : "gray")};
    position: absolute;
    top: 1rem;
    right: 1rem;
    transition: color 0.3s ease;
`;

/* ==============================
   Main Component
============================== */
export default function AllJobs() {
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [educationFilter, setEducationFilter] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    const [salaryFilter, setSalaryFilter] = useState("");
    const [sortOption, setSortOption] = useState("date");
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isHomePage = location.pathname === "/";
    const {
        data: jobs = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
    });

    // Filter + Sort
    useEffect(() => {
        if (!jobs) return;
        let result = jobs.filter((job) => {
            return (
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                job.location
                    .toLowerCase()
                    .includes(locationFilter.toLowerCase()) &&
                (statusFilter ? job.status === statusFilter : true) &&
                (typeFilter ? job.job_type === typeFilter : true) &&
                (educationFilter ? job.education === educationFilter : true) &&
                (companyFilter ? job.company?.name === companyFilter : true) &&
                (salaryFilter ? job.salary_type === salaryFilter : true)
            );
        });

        if (sortOption === "date")
            result.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        else if (sortOption === "az")
            result.sort((a, b) => a.title.localeCompare(b.title));
        else if (sortOption === "location")
            result.sort((a, b) => a.location.localeCompare(b.location));
        else if (sortOption === "type")
            result.sort((a, b) => a.job_type.localeCompare(b.job_type));

        setFilteredJobs(result);
    }, [
        jobs,
        searchTerm,
        locationFilter,
        statusFilter,
        typeFilter,
        educationFilter,
        companyFilter,
        salaryFilter,
        sortOption,
    ]);

    // Load Favorites
    useEffect(() => {
        if (!user?.token) return;
        getMyFavorites(user.token)
            .then((favorites) => setSavedJobIds(favorites.map((f) => f.job.id)))
            .catch(console.error);
    }, [user, queryClient]);
    const toggleFavorite = async (job) => {
        if (!user?.token) {
            setModalData({
                type: "save",
                title: "Save this job with an account",
                description:
                    "Save this job and other opportunities with a free account.",
            });
            return;
        }

        const isFavorite = savedJobIds.includes(job.id);
        setSavedJobIds((prev) =>
            isFavorite ? prev.filter((id) => id !== job.id) : [...prev, job.id]
        );

        await toast.promise(
            isFavorite
                ? removeFavoriteJob(job.id, user.token)
                : addFavoriteJob(job.id, user.token),
            {
                loading: isFavorite ? "Removing..." : "Adding...",
                success: isFavorite
                    ? "Removed from favorites 💔"
                    : "Added to favorites ❤️",
                error: "Failed to update favorite",
            }
        );
    };

    const handleApplyNow = (job) => {
        if (!user?.id) {
            setModalData({
                type: "apply",
                title: "Apply to this job with an account",
                description:
                    "Build your profile, apply to this job, and track your application status with a free account.",
            });
        } else {
            setApplyModalOpen(true);
            setCurrentJob(job);
        }
    };

    if (error)
        return (
            <p style={{ textAlign: "center", padding: "2rem" }}>
                Failed to load jobs 😢
            </p>
        );

    return (
        <AllJobsWrapper>
            <JobsHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                educationFilter={educationFilter}
                setEducationFilter={setEducationFilter}
                companyFilter={companyFilter}
                setCompanyFilter={setCompanyFilter}
                salaryFilter={salaryFilter}
                setSalaryFilter={setSalaryFilter}
                sortOption={sortOption}
                setSortOption={setSortOption}
            />

            <Header />

            {isHomePage && (
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    locationFilter={locationFilter}
                    setLocationFilter={setLocationFilter}
                />
            )}

            <JobsContainer>
                {isLoading ? (
                    <div style={{ textAlign: "center", padding: "3rem 0" }}>
                        <div className="spinner" />
                        <div style={{ height: "70vh" }}>
                            <Loader center />
                        </div>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <JobList>
                        {filteredJobs.map((job) => (
                            <JobsCard key={job.id}>
                                <JobStatus status={job.status}>
                                    {job.status}
                                </JobStatus>
                                <JobImg
                                    src={
                                        job.company?.logo
                                            ? `http://127.0.0.1:8000/storage/${job.company.logo}`
                                            : "/images/company-default-images2.png"
                                    }
                                    alt={job.company?.name || "Company Logo"}
                                />
                                <JobText>
                                    <JobTitle>{job.title}</JobTitle>
                                    <JobPosition>
                                        {job.company?.name}
                                    </JobPosition>
                                    <JobInfo>
                                        <CompanyName>
                                            {job.job_type}
                                        </CompanyName>
                                        <Location>{job.location}</Location>
                                        <Salary>
                                            ${job.salary_min} - $
                                            {job.salary_max}
                                        </Salary>
                                        <PostedAt>
                                            {new Date(
                                                job.created_at
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </PostedAt>
                                    </JobInfo>
                                    <JobDescription>
                                        {job.description.length > 80
                                            ? job.description.slice(0, 80) +
                                              "..."
                                            : job.description}
                                    </JobDescription>
                                </JobText>

                                {(!user?.role ||
                                    user?.role === "job_seeker") && (
                                    <HeartIcon
                                        active={savedJobIds.includes(job.id)}
                                        onClick={() => toggleFavorite(job)}
                                    />
                                )}

                                <HoverOverlay className="hover-overlay">
                                    <Link
                                        to={`jobDetails/${job.id}`}
                                        style={{
                                            flex:
                                                !user?.role ||
                                                user?.role === "job_seeker"
                                                    ? "1"
                                                    : "unset",
                                        }}
                                    >
                                        <FancyButton
                                            variation={
                                                !user?.role ||
                                                user?.role === "job_seeker"
                                                    ? "secondary"
                                                    : "primary"
                                            }
                                            style={{
                                                width:
                                                    !user?.role ||
                                                    user?.role === "job_seeker"
                                                        ? "100%"
                                                        : "140px",
                                            }}
                                        >
                                            Learn More
                                        </FancyButton>
                                    </Link>

                                    {(user?.role === "job_seeker" ||
                                        !user?.role) && (
                                        <FancyButton
                                            variation="primary"
                                            onClick={() => handleApplyNow(job)}
                                        >
                                            Apply Now
                                        </FancyButton>
                                    )}
                                </HoverOverlay>
                            </JobsCard>
                        ))}
                    </JobList>
                ) : (
                    <p style={{ textAlign: "center", padding: "3rem 0" }}>
                        No jobs found 😔
                    </p>
                )}
            </JobsContainer>

            {modalData && (
                <ModalOverlay>
                    <ModalContent>
                        <CloseButton onClick={() => setModalData(null)}>
                            <RxCross2 />
                        </CloseButton>
                        <ModalTitle>{modalData.title}</ModalTitle>
                        <ModalDescription>
                            {modalData.description}
                        </ModalDescription>
                        <ModalButtons>
                            <Link to="/login">
                                <WideButton variation="secondary">
                                    Log in
                                </WideButton>
                            </Link>
                            <Link to="/sign-up">
                                <WideButton variation="primary">
                                    Sign up
                                </WideButton>
                            </Link>
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}

            {applyModalOpen && currentJob && (
                <DialogDemo
                    open={applyModalOpen}
                    onOpenChange={setApplyModalOpen}
                    jobId={currentJob.id}
                />
            )}

            {isHomePage && <Footer />}
        </AllJobsWrapper>
    );
}
