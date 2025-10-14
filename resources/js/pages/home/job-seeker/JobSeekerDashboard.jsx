import {
    HiOutlineBookmark,
    HiOutlineBriefcase,
    HiOutlineClipboardList,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { MdTask, MdUpcoming } from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import styled from "styled-components";
import { useAuth } from "../../../hook/AuthContext";

// ===== Styled Components =====
const DashboardContainer = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    font-family: "Inter", sans-serif;
`;

const MessageBox = styled.div`
    background: linear-gradient(90deg, #e6f2ef, #f3f4f6);
    padding: 2.5rem 3rem;
    border-radius: var(--radius-xl);
    margin-bottom: 2rem;
    box-shadow: var(--shadow-md);
`;

const WelcomeMessage = styled.h1`
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
    margin-bottom: 0.8rem;

    span {
        color: var(--color-primary);
    }
`;

const DateText = styled.p`
    font-size: 1.6rem;
    color: var(--color-grey-600);
    font-weight: 500;
    letter-spacing: 0.5px;
`;

const StatisticsBox = styled.div`
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    .box {
        flex: 1 1 220px;
        background: #fff;
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        display: flex;
        align-items: center;
        gap: 1rem;

        .icon {
            font-size: 2.2rem;
            color: var(--color-primary);
        }

        .number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--color-grey-900);
        }

        .name {
            font-size: 1.4rem;
            color: var(--color-grey-600);
        }
    }
`;

const ActiveBox = styled.div`
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;

    .recentProjects,
    .rightSide {
        flex: 1 1 300px;
        background: #fff;
        padding: 1.8rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);

        h3 {
            font-size: 1.6rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-grey-900);
        }

        ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;

            li {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .status {
                    padding: 0.2rem 0.6rem;
                    border-radius: var(--radius-sm);
                    font-size: 1.2rem;
                    font-weight: 600;

                    &.in-progress {
                        background-color: #fef9c3;
                        color: #b45309;
                    }
                    &.completed {
                        background-color: #dcfce7;
                        color: #15803d;
                    }
                    &.pending {
                        background-color: #fee2e2;
                        color: #b91c1c;
                    }
                }

                .avatar {
                    display: inline-flex;
                    width: 28px;
                    height: 28px;
                    background-color: var(--color-primary);
                    color: #fff;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    font-weight: 700;
                }
            }
        }
    }

    .rightSide {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
`;

// Utility function for ordinal suffix
const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

export default function JobSeekerDashboard() {
    const { user } = useAuth();

    // Dynamic date
    const now = new Date();
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
    const dayNumber = now.getDate();
    const monthName = now.toLocaleDateString("en-US", { month: "long" });
    const year = now.getFullYear();
    const formattedDate = `${dayName}, ${dayNumber}${getOrdinal(
        dayNumber
    )} of ${monthName}, ${year}`;

    return (
        <DashboardContainer>
            {/* Welcome Section */}
            <MessageBox>
                <WelcomeMessage>
                    Welcome back,{" "}
                    <span>
                        {user?.data?.user?.profile?.first_name ||
                            user?.user?.name}{" "}
                        {user?.data?.user?.profile?.last_name}
                    </span>{" "}
                    👋
                </WelcomeMessage>
                <DateText>Today is {formattedDate}</DateText>
            </MessageBox>

            {/* Statistics Section */}
            <StatisticsBox>
                <div className="box projects">
                    <HiOutlineBriefcase className="icon" />
                    <div>
                        <p className="number">18</p>
                        <p className="name">Projects</p>
                    </div>
                </div>
                <div className="box jobSaved">
                    <HiOutlineBookmark className="icon" />
                    <div>
                        <p className="number">40</p>
                        <p className="name">Job Saved</p>
                    </div>
                </div>
                <div className="box totalJobs">
                    <HiOutlineClipboardList className="icon" />
                    <div>
                        <p className="number">39</p>
                        <p className="name">Total Jobs</p>
                    </div>
                </div>
                <div className="box recent">
                    <HiOutlineUserGroup className="icon" />
                    <div>
                        <p className="number">56</p>
                        <p className="name">Recent Tasks</p>
                    </div>
                </div>
            </StatisticsBox>

            {/* Active Section */}
            <ActiveBox>
                {/* Recent Projects */}
                <div className="recentProjects">
                    <h3>
                        <MdTask /> Recent Projects
                    </h3>
                    <ul>
                        <li>
                            <p>Job Board Redesign</p>
                            <span className="status in-progress">
                                In Progress
                            </span>
                        </li>
                        <li>
                            <p>Freelance Portal</p>
                            <span className="status completed">Completed</span>
                        </li>
                        <li>
                            <p>Company Careers Page</p>
                            <span className="status pending">Pending</span>
                        </li>
                    </ul>
                </div>

                {/* Right Side */}
                <div className="rightSide">
                    <div className="upcomingProjects">
                        <h3>
                            <MdUpcoming /> Upcoming Projects
                        </h3>
                        <ul>
                            <li>
                                <strong>UI Update</strong> – Aug 1
                            </li>
                            <li>
                                <strong>Dashboard Revamp</strong> – Aug 7
                            </li>
                            <li>
                                <strong>Mobile App Launch</strong> – Aug 15
                            </li>
                        </ul>
                    </div>

                    <div className="teamActivity">
                        <h3>
                            <PiUsersThreeFill /> Team Activity
                        </h3>
                        <ul>
                            <li>
                                <span className="avatar">M</span> You applied
                                for “Frontend Engineer”
                            </li>
                            <li>
                                <span className="avatar">S</span> Sara saved a
                                new job
                            </li>
                            <li>
                                <span className="avatar">A</span> Ahmad
                                completed project “Redesign”
                            </li>
                        </ul>
                    </div>
                </div>
            </ActiveBox>
        </DashboardContainer>
    );
}
