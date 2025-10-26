import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getJobs } from "../../../services/apiAllJobs";
import "./SugesstedJobs.css";

function SugesstedJobs() {
    const {
        data: jobs,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["jobs"],
        queryFn: getJobs,
    });

    if (isLoading) return <p>Loading suggested jobs...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        <div className="sugessted-jobs">
            <div className="sugess-header">
                <h2>Suggested Jobs</h2>
                <p>Based on your profile and activity</p>
            </div>

            <div className="sugessted-job-cards">
                {jobs?.map((job) => (
                    <div key={job.id} className="sugessted-card">
                        <div className="sugessted-left">
                            <div className="left-image">
                                <img
                                    src={
                                        job.company?.logo
                                            ? `http://127.0.0.1:8000/storage/${job.company.logo}`
                                            : "/popular-logos/logo(4).png"
                                    }
                                    alt={job.companyName}
                                    className="company-image"
                                />
                            </div>
                            <div className="left-desc">
                                <h3 className="job-title">{job.title}</h3>
                                <p className="company">{job.companyName}</p>
                                <p className="location">{job.location}</p>
                            </div>
                        </div>

                        <div className="sugessted-right">
                            <p className="posted">{job.type}</p>
                            <Link
                                to={`/app/allJobs/jobDetails/${job.id}`}
                                className="learn-more-btn"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SugesstedJobs;
