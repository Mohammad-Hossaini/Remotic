// import { useQuery } from "@tanstack/react-query";
// import { SlCalender } from "react-icons/sl";
// import { Link } from "react-router-dom";
// import { getJobs } from "../../../services/apiAllJobs";
// import "./SugesstedJobs.css";

// function SugesstedJobs() {
//     const {
//         data: jobs,
//         isLoading,
//         isError,
//         error,
//     } = useQuery({
//         queryKey: ["jobs"],
//         queryFn: getJobs,
//     });

//     if (isLoading) return <p className="loading">Loading suggested jobs...</p>;
//     if (isError) return <p className="error">Error: {error.message}</p>;

//     return (
//         <div className="sugessted-jobs">
//             <div className="sugess-header">
//                 <h2>Suggested Jobs</h2>
//                 <p>Based on your profile and recent activity</p>
//             </div>

//             <div className="sugessted-job-cards">
//                 {jobs?.slice(0, 6).map((job) => (
//                     <div key={job.id} className="sugessted-card">
//                         {/* Left */}
//                         <div className="sugessted-left">
//                             <div className="left-image">
//                                 <img
//                                     src={
//                                         job.company?.logo
//                                             ? `http://127.0.0.1:8000/storage/${job.company.logo}`
//                                             : "/popular-logos/logo(4).png"
//                                     }
//                                     alt={job.company?.name || "Company Logo"}
//                                     className="company-image"
//                                 />
//                             </div>

//                             <div className="left-desc">
//                                 <h3 className="job-title">{job.title}</h3>
//                                 <p className="company">
//                                     {job.company?.name || "Unknown Company"}
//                                 </p>
//                                 <p className="location">
//                                     <i className="fa-solid fa-location-dot"></i>{" "}
//                                     {job.location}
//                                 </p>
//                                 <p className="salary">
//                                     💰{" "}
//                                     {job.salary_min && job.salary_max
//                                         ? `$${job.salary_min} - $${job.salary_max}`
//                                         : "Salary not specified"}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Right */}
//                         <div className="sugessted-right">
//                             <p className="type">
//                                 <span>
//                                     {job.job_type?.toUpperCase() || "N/A"}
//                                 </span>
//                             </p>
//                             <p className="posted">
//                                 <SlCalender /> Posted{" "}
//                                 {job.created_at
//                                     ? job.created_at.split("T")[0]
//                                     : ""}
//                             </p>
//                             <p className="deadline">
//                                 ⏰ Deadline: {job.deadline}
//                             </p>
//                             <Link
//                                 to={`/app/allJobs/jobDetails/${job.id}`}
//                                 className="learn-more-btn"
//                             >
//                                 View Details
//                             </Link>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default SugesstedJobs;

import { useQuery } from "@tanstack/react-query";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
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

    if (isLoading)
        return (
            <div style={{ height: "70vh" }}>
                <Loader center />
            </div>
        );
    if (isError) return <p className="error">Error: {error.message}</p>;

    return (
        <div className="sugessted-jobs">
            <div className="sugess-header">
                <h2>Suggested Jobs</h2>
                <p>Based on your profile and recent activity</p>
            </div>

            <div className="sugessted-job-cards">
                {jobs?.slice(0, 6).map((job) => (
                    <div key={job.id} className="sugessted-card">
                        {/* Left */}
                        <div className="sugessted-left">
                            <div className="left-image">
                                <img
                                    src={
                                        job.company?.logo
                                            ? `http://127.0.0.1:8000/storage/${job.company.logo}`
                                            : "/popular-logos/logo(4).png"
                                    }
                                    alt={job.company?.name || "Company Logo"}
                                    className="company-image"
                                />
                            </div>

                            <div className="left-desc">
                                <h3 className="job-title">{job.title}</h3>
                                <p className="company">
                                    {job.company?.name || "Unknown Company"}
                                </p>
                                <p className="location">
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    {job.location}
                                </p>
                                <p className="salary">
                                    💰{" "}
                                    {job.salary_min && job.salary_max
                                        ? `$${job.salary_min} - $${job.salary_max}`
                                        : "Salary not specified"}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="sugessted-right">
                            <p className="type">
                                <span>
                                    {job.job_type?.toUpperCase() || "N/A"}
                                </span>
                            </p>
                            <p className="posted">
                                <SlCalender /> Posted{" "}
                                {job.created_at
                                    ? job.created_at.split("T")[0]
                                    : ""}
                            </p>
                            <p className="deadline">
                                ⏰ Deadline: {job.deadline}
                            </p>
                            <Link
                                to={`/app/allJobs/jobDetails/${job.id}`}
                                className="learn-more-btn"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SugesstedJobs;
