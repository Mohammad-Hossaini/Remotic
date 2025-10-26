import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMiniHeart } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
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
import SearchBar from "../../SearchBar";

// ================= Styled Components =================
const AllJobsWrapper = styled.div`
    min-height: 100vh;
`;

const JobsContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
`;

const JobList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2.5rem;
    padding-top: 1rem;
`;


const JobsCard = styled.div`
    min-width: 320px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    background: var(--color-grey-30);
    padding: 1.6rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-grey-300);
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);

        .hover-overlay {
            opacity: 1;
            pointer-events: auto;
        }
    }
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
    letter-spacing: 0.5px;
    background-color: ${(props) =>
        props.status === "open"
            ? "var(--color-success)"
            : props.status === "closed"
            ? "var(--color-error)"
            : props.status === "draft"
            ? "var(--color-warning)"
            : "var(--color-grey-500)"};
`;

const HoverOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: var(--space-16);
    opacity: 0;
    transition: opacity 0.3s ease;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(25px);
    border-top: 1px solid var(--color-grey-200);
    pointer-events: all;
`;

const FancyButton = styled(Button)`
    min-width: 140px;
    font-size: var(--font-sm);
    font-weight: 600;
    border-radius: var(--radius-sm);
    padding: var(--space-12) var(--space-20);
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
`;

const JobTop = styled.div`
    display: flex;
    align-items: center;
    gap: 1.6rem;
`;

const JobImg = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border-radius: 50%;
    flex-shrink: 0;
    /* background-color: red; */
    border: 2.4px solid var(--color-grey-300);
`;

const JobText = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const JobTitle = styled.h3`
    font-size: var(--font-lg);
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: 0.4rem;
    margin-top: 1rem;
`;

const JobPosition = styled.p`
    font-size: var(--font-base);
    font-weight: 500;
    color: var(--color-grey-700);
`;

const JobInfo = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.8rem;
    font-size: var(--font-sm);
    color: var(--color-grey-500);
`;

const CompanyName = styled.span`
    font-weight: 700;
    color: var(--color-grey-900);
`;

const Location = styled.span`
    font-weight: 600;
    color: var(--color-grey-700);
`;

const Salary = styled.span`
    font-weight: 600;
    color: var(--color-success);
`;

const PostedAt = styled.span`
    font-size: var(--font-xs);
    color: var(--color-grey-400);
`;

const JobDescription = styled.p`
    margin-top: 0.8rem;
    font-size: var(--font-base);
    color: var(--color-grey-600);
    line-height: 1.4;
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
`;

const ModalTitle = styled.h2`
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
    font-size: 1.4rem;
    color: var(--color-grey-700);
    margin-bottom: 2rem;
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
`;

// ================= Main Component =================
export default function AllJobs() {
    const [currentJob, setCurrentJob] = useState(null);
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);

    const { user } = useAuth();
    const location = useLocation();
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

    // Update filtered jobs when jobs or filters change
    useEffect(() => {
        if (!jobs) return;
        const result = jobs.filter((job) => {
            const matchesType = job.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesLocation = job.location
                .toLowerCase()
                .includes(locationFilter.toLowerCase());
            return matchesType && matchesLocation;
        });
        setFilteredJobs(result);
    }, [jobs, searchTerm, locationFilter]);

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

        try {
            const isFavorite = savedJobIds.includes(job.id);
            if (isFavorite) {
                await removeFavoriteJob(job.id, user.token);
                toast.error("Removed from favorites 💔");
                setSavedJobIds((prev) => prev.filter((id) => id !== job.id));
            } else {
                await addFavoriteJob(job.id, user.token);
                toast.success("Added to favorites ❤️");
                setSavedJobIds((prev) => [...prev, job.id]);
            }
            const updatedFavorites = await getMyFavorites(user.token);
            setSavedJobIds(updatedFavorites.map((f) => f.job.id));
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to update favorite");
        }
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

    // console.log(filteredJobs);

    return (
        <AllJobsWrapper>
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
                    // 🌀 Loading spinner or skeleton only for job area
                    <div style={{ textAlign: "center", padding: "3rem 0" }}>
                        <div className="spinner" />
                        <p>Loading jobs...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <JobList>
                        {filteredJobs.map((job) => (
                            <JobsCard key={job.id}>
                                <JobStatus status={job.status}>
                                    {job.status}
                                </JobStatus>
                                <JobTop>
                                    <JobImg
                                        src={
                                            job.company?.logo
                                                ? `http://127.0.0.1:8000/storage/${job.company.logo}`
                                                : "/popular-logos/logo(4).png"
                                        }
                                        alt={
                                            job.company?.name || "Company Logo"
                                        }
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
                                </JobTop>

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
                            <Link to="/createAccount">
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
