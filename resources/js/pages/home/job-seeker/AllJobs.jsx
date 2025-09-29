import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiMiniHeart } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../../../hook/AuthContext";
import { getJobs } from "../../../services/apiAllJobs";
import {
    deleteSavedJob,
    getSavedJobsByUser,
    putSavedJobs,
} from "../../../services/apiGetSavedJobs";
import Button from "../../../ui/Button";
import Footer from "../../Footer";
import JobsHeader from "../../JobsHeader";

// ================= Styled Components =================
const AllJobsWrapper = styled.div`
    background-color: #f8f9fa;
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
    gap: 1.6rem;
    padding-top: 1rem;
`;

const JobsCard = styled.div`
    min-width: 450px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    background: var(--color-grey-0);
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

const HoverOverlay = styled.div`
    position: absolute;
    bottom: 0; 
    left: 0;
    width: 100%;
    height: 50%; 
    display: flex;
    flex-direction: row;
    align-items: center; 
    justify-content: center;
    gap: 0.5rem;
    padding: var(--space-16);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(25px);
    border-top: 1px solid var(--color-grey-200);
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

    &:active {
        transform: translateY(0);
        box-shadow: var(--shadow-sm);
    }
`;

const JobTop = styled.div`
    display: flex;
    align-items: center;
    gap: 1.6rem;
`;

const JobImg = styled.img`
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: var(--radius-md);
    flex-shrink: 0;
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

const StyledLinkButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.2rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
`;

const HeartIcon = styled(HiMiniHeart)`
    cursor: pointer;
    font-size: 2rem;
    color: ${(props) => (props.active ? "#2b8a3e" : "var(--color-grey-400)")};
    position: absolute;
    top: 1rem;
    right: 1rem;

    &:hover {
        color: #2b8a3e;
    }
`;

// ================= Modal =================
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
    width: 90rem;
    max-height: 500px;
    height: 25rem;
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
    transition: color 0.2s ease;

    &:hover {
        color: var(--color-grey-900);
    }
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
    align-items: stretch;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const WideButton = styled(Button)`
    width: 100%;
    font-size: 1%.5;
    padding: 0.9rem 1.2rem;
`;

// ================= Main Component =================
export default function AllJobs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [modalData, setModalData] = useState(null);

    const queryClient = useQueryClient();
    const { user } = useAuth();
    const location = useLocation();

    const isHomePage = location.pathname === "/";

    const {
        data: jobs,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
    });
    console.log("All jobs from API:", jobs);

    useEffect(() => {
        if (!user?.id) return;
        getSavedJobsByUser(user.id)
            .then((saved) => setSavedJobIds(saved.map((s) => s.jobId)))
            .catch(console.error);
    }, [user]);

    const saveJobMutation = useMutation({
        mutationFn: putSavedJobs,
        onSuccess: (_, variables) => {
            setSavedJobIds((prev) => [...prev, variables.id]);
            toast.success("Job saved successfully!");
            queryClient.invalidateQueries(["savedJobs", user?.id]);
        },
        onError: (err) => toast.error(err.message),
    });

    const deleteJobMutation = useMutation({
        mutationFn: deleteSavedJob,
        onSuccess: (_, savedJobId) => {
            setSavedJobIds((prev) => prev.filter((id) => id !== savedJobId));
            toast.success("Job removed from saved!");
            queryClient.invalidateQueries(["savedJobs", user?.id]);
        },
        onError: (err) => toast.error(err.message),
    });

    const toggleFavorite = (job) => {
        if (!user?.id) {
            setModalData({
                type: "save",
                title: "Save this job with an account",
                description:
                    "Save this job and other opportunities with a free account.",
            });
            return;
        }
        if (!savedJobIds.includes(job.id))
            saveJobMutation.mutate({ ...job, userId: user?.id });
        else
            getSavedJobsByUser(user.id).then((saved) => {
                const savedEntry = saved.find((s) => s.jobId === job.id);
                if (savedEntry) deleteJobMutation.mutate(savedEntry.id);
            });
    };

    const handleApplyNow = (job) => {
        if (!user?.id) {
            setModalData({
                type: "apply",
                title: "Apply to this job with an account",
                description:
                    "Build your profile, apply to this job, and track your application status with a free account.",
            });
            return;
        }
    };

    if (isLoading) return <p>Loading jobs...</p>;
    if (error) return <p>Failed to load jobs 😢</p>;

    const filteredJobs = jobs
        ?.filter((job) =>
            searchTerm === ""
                ? true
                : job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  job.company?.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
        )
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );

    return (
        <AllJobsWrapper>
            <JobsHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
            />

            <JobsContainer>
                <JobList>
                    {filteredJobs.map((job) => (
                        <JobsCard key={job.id}>
                            <JobTop>
                                <JobImg
                                    src={
                                        job.company?.logo ||
                                        "/company-images/image(6).jfif"
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
                                            {job.job_type || "Unknown Company"}
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

                            <HeartIcon
                                active={savedJobIds.includes(job.id)}
                                onClick={() => toggleFavorite(job)}
                            />

                       
                            <HoverOverlay className="hover-overlay">
                                <Link
                                    to={`jobDetails/${job.id}`}
                                    style={{ width: "100%" }}
                                >
                                    <FancyButton variation="secondary">
                                        Learn More
                                    </FancyButton>
                                </Link>
                                <FancyButton
                                    variation="primary"
                                    onClick={() => handleApplyNow(job)}
                                >
                                    Apply Now
                                </FancyButton>
                            </HoverOverlay>
                        </JobsCard>
                    ))}
                </JobList>
            </JobsContainer>

            {isHomePage && <Footer />}
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
                        {/* <ModalButtons>
                            {!user?.id ? (
                                <>
                                    <Link to="/login">
                                        <Button
                                            variation="secondary"
                                            size="medium"
                                        >
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link to="/createAccount">
                                        <Button
                                            variation="primary"
                                            size="medium"
                                        >
                                            Sign up
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Button onClick={() => setModalData(null)}>
                                    Close
                                </Button>
                            )}
                        </ModalButtons> */}
                        <ModalButtons>
                            {!user?.id ? (
                                <>
                                    <Link to="/login">
                                        <WideButton
                                            variation="secondary"
                                            size="medium"
                                        >
                                            Log in
                                        </WideButton>
                                    </Link>
                                    <Link to="/createAccount">
                                        <WideButton
                                            variation="primary"
                                            size="medium"
                                        >
                                            Sign up
                                        </WideButton>
                                    </Link>
                                </>
                            ) : (
                                <WideButton onClick={() => setModalData(null)}>
                                    Close
                                </WideButton>
                            )}
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AllJobsWrapper>
    );
}
