import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Toaster } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { userPostedJobs } from "../../../services/apiAllJobs";
import "./PostedJobs.css";
export default function PostedJobs() {
    const queryClient = useQueryClient();

    // Fetch all jobs posted by current employer
    const {
        data: jobs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["postedJobs"],
        queryFn: userPostedJobs,
    });

    // Loading & Error states
    if (isLoading) return <p className="loading">Loading your jobs...</p>;
    if (isError)
        return <p className="error">Failed to load jobs. Try again.</p>;

    return (
        <div className="postedJobsContainer">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="postedHeader">
                <h2>Posted Jobs</h2>
            </div>

            {jobs.length === 0 ? (
                <p className="no-jobs">You haven’t posted any jobs yet.</p>
            ) : (
                jobs.map((job) => (
                    <div key={job.id} className="postedJobCard">
                        {/* LEFT */}
                        <div className="left">
                            <div className="job-img">
                                <img
                                    src={
                                        job.company?.logo ||
                                        "/company-images/image(6).jfif"
                                    }
                                    alt={job.company?.name || "Company Logo"}
                                />
                            </div>

                            <div className="job-desc">
                                <h3 className="job-title">{job.title}</h3>
                                <p className="job-company">
                                    {job.company?.name || "Unknown Company"}
                                </p>
                                <p className="job-meta">
                                    Type: {job.job_type} | Salary: $
                                    {job.salary_min} - ${job.salary_max}
                                </p>
                                <p className="job-meta">
                                    Location: {job.location}
                                </p>
                                <p className="job-deadline">
                                    Deadline:{" "}
                                    {new Date(
                                        job.deadline
                                    ).toLocaleDateString()}
                                </p>
                                <p className="job-posted">
                                    Posted{" "}
                                    {formatDistanceToNow(
                                        new Date(job.created_at),
                                        { addSuffix: true }
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="right">
                            <button
                                className="iconBtn editBtn"
                                onClick={() => handleEdit(job)}
                                title="Edit Job"
                            >
                                <FiEdit />
                            </button>
                            <button
                                className="iconBtn deleteBtn"
                                onClick={() => handleDelete(job.id)}
                                title="Delete Job"
                            >
                                <RiDeleteBin6Line />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
