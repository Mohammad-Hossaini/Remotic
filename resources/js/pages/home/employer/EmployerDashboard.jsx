import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import { useAuth } from "../../../hook/AuthContext";
import { getEmployerDashboardStats } from "../../../services/apiDashboard";
import JobApplicantsChart from "../../../ui/BarChart";
import JobModal from "../../../ui/JobModal";

const Container = styled.div`
    max-width: 120rem;
    margin: 0 auto;
    padding: 2rem;
    height: 20rem;
`;

const DashboardActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
`;

const PostJobButton = styled.button`
    background-color: #114a38;
    color: white;
    font-size: 1.6rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        background-color: #087f5b;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
    background: #ffffff;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const BoxNumber = styled.p`
    font-size: 2.8rem;
    font-weight: 700;
    color: #114a38;
    margin-bottom: 0.5rem;
`;

const BoxName = styled.p`
    font-size: 1.4rem;
    font-weight: 500;
    color: #666;
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1.2fr;
    gap: 2rem;
`;

const LeftBox = styled.div`
    background: #fff;
    border-radius: 1rem;
    padding: 2rem;
    height: 50rem;
    overflow: auto;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const RightBox = styled.div`
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 2rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #114a38;
`;

const RecentBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 1rem 0;
`;

const ChartBox = styled.div`
    background: #fff;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;
const StyledDescription = styled.p`
    width: 8rem;
    font-size: 1.2rem;
`;

function EmployerDashboard() {
    const [openModal, setOpenModal] = useState(false);
    const { user } = useAuth();
    const token = user?.token;

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user?.token) return;
        const newSocket = io("http://localhost:5000", {
            auth: { token: user.token },
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [user?.token]);

    const { data: dashboard, isLoading } = useQuery({
        queryKey: ["dashboardStats", token],
        queryFn: () => getEmployerDashboardStats(token),
        enabled: !!token,
    });

    // console.log(dashboard);

    const stats = [
        {
            number: dashboard?.total_applications_received ?? 0,
            name: "New Applications",
        },
        {
            number: dashboard?.charts?.hired_candidates ?? 0,
            name: "Hired Candidates",
        },
        {
            number: dashboard?.charts?.unread_messages ?? 0,
            name: "Unread Messages",
        },
        { number: dashboard?.total_jobs_posted ?? 0, name: "Open Positions" },
    ];

    const recentJobs = dashboard?.recent_jobs?.length
        ? dashboard.recent_jobs
        : [
              {
                  id: 0,
                  title: "No Jobs Yet",
                  description: "You haven't posted any jobs.",
                  deadline: "—",
              },
          ];

    return (
        <Container>
            <DashboardActions>
                <PostJobButton onClick={() => setOpenModal(true)}>
                    + Post a New Job
                </PostJobButton>
            </DashboardActions>

            <JobModal open={openModal} onOpenChange={setOpenModal} />

            <StatsGrid>
                {stats.map((stat, i) => (
                    <StatCard
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <BoxNumber>{stat.number}</BoxNumber>
                        <BoxName>{stat.name}</BoxName>
                    </StatCard>
                ))}
            </StatsGrid>

            <ContentGrid>
                <LeftBox>
                    <SectionTitle>Recent Jobs</SectionTitle>
                    {recentJobs.map((job) => (
                        <RecentBox key={job.id}>
                            <div>
                                <h3>{job.title}</h3>
                                <p>{job.description}</p>
                            </div>
                            <div>
                                <StyledDescription>
                                    {job.deadline ?? "—"}
                                </StyledDescription>
                            </div>
                        </RecentBox>
                    ))}
                </LeftBox>

                <RightBox>
                    <ChartBox>
                        <h3>Candidate Overview</h3>
                        {dashboard?.charts?.applications_per_day?.length ? (
                            <JobApplicantsChart
                                data={dashboard.charts.applications_per_day}
                            />
                        ) : (
                            <p>No data yet</p>
                        )}
                    </ChartBox>

                    {/* <ChartBox>
                        <h3>Applications by Status</h3>
                        {dashboard?.charts?.applications_per_job?.length ? (
                            <ApplicationStatus
                                data={dashboard.charts.applications_per_job}
                            />
                        ) : (
                            <p>No data yet</p>
                        )}
                    </ChartBox> */}
                </RightBox>
            </ContentGrid>
        </Container>
    );
}

export default EmployerDashboard;
