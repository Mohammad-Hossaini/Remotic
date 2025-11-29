import { useNavigate } from "react-router-dom";
import "./RecommendedJobsCard.css";

function RecommendedJobsCard({ job }) {
    const navigate = useNavigate();

    const handleViewApply = () => {
        navigate(`/jobDetails/${job.id}`);
    };

    return (
        <div className="card">
            <div className="image-wrapper">
                <img
                    className="comp-image"
                    src={
                        job.company?.logo
                            ? `http://127.0.0.1:8000/storage/${job.company.logo}`
                            : "/images/company-default-images2.png"
                    }
                    alt={job.company?.name || "Company Logo"}
                />
            </div>

            <p className="title-job">{job.title}</p>

            <div className="details">
                <p className="font-size">{job.job_type}</p>
                <p className="font-size">{job.status}</p>

                <p className="font-size">
                    <span className="salaryColor-number">{job.salary_min}</span>
                    <span className="salaryColor-dollar">$</span>
                    {" - "}
                    <span className="salaryColor-number">{job.salary_max}</span>
                    <span className="salaryColor-dollar">$</span>
                </p>
            </div>

            {/* لینک یا دکمه برای رفتن به جزییات جاب */}
            <div className="view-button" onClick={handleViewApply}>
                View & Apply
            </div>
        </div>
    );
}

export default RecommendedJobsCard;
