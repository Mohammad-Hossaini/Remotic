import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { Navigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import { useAuth } from "../../../hook/AuthContext";
import DialogDemo from "../../../ui/DialogDemo";
import "./JobDetails.css";

function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const [openApply, setOpenApply] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/jobs/${id}/unautenticated`
                );
                if (!response.ok) throw new Error("Failed to fetch job");

                const data = await response.json();
                setJob(data);
            } catch (err) {
                console.error(err);
                setError("Error fetching job");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const jobUrl = `${window.location.origin}/jobDetails/${id}`;

    const copyJobUrl = () => {
        navigator.clipboard.writeText(jobUrl);
        toast.success("Job URL copied successfully!");
    };

    if (loading)
        return (
            <div className="loading">
                <div style={{ height: "70vh" }}>
                    <Loader center />
                </div>
            </div>
        );

    if (error) return <p>{error}</p>;

    return (
        <div className="jobDetails">
            {/* ===== Header Section ===== */}
            <div className="jobDetailsHeader">
                <div className="jobDetailsHeaderLeft">
                    <h1 className="headerTitle">
                        {job?.title} <span className="atText">at</span>{" "}
                        {job?.company.name}
                    </h1>
                    <p className="headerDesc">{job?.company.description}</p>
                </div>
            </div>

            {/* ===== Main Content ===== */}
            <div className="jobContent">
                {/* === Left Side === */}
                <div className="left-container-side">
                    <div className="aboutJob">
                        <h2 className="aboutJob-title">About this job</h2>

                        <div className="aboutJobContent">
                            <div className="jobImage">
                                <img
                                    src={
                                        job.company?.logo
                                            ? `http://127.0.0.1:8000/storage/${job.company.logo}`
                                            : "/popular-logos/logo(4).png"
                                    }
                                    alt={job.company?.name || "Company Logo"}
                                    className="jobImg"
                                />
                            </div>

                            <div className="jobInfo">
                                <p className="job-title">
                                    {job?.title}{" "}
                                    <span className="job-type">
                                        ({job?.job_type})
                                    </span>
                                </p>

                                <h4 className="job-location">
                                    {job?.location}
                                </h4>

                                <strong className="salary">
                                    ${job?.salary_min} - ${job?.salary_max}
                                </strong>
                            </div>
                        </div>

                        <p className="desc-of-job">{job?.description}</p>
                    </div>

                    <div className="skills">
                        <h2 className="required-skills">Required Skills</h2>

                        <div className="buttons">
                            {job?.requirements ? (
                                job.requirements
                                    .split(",")
                                    .map((skill, index) => (
                                        <button
                                            key={index}
                                            className="skillBtn"
                                        >
                                            {skill.trim()}
                                        </button>
                                    ))
                            ) : (
                                <p>No skills listed</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* === Right Side === */}
                <div className="right-container-side">
                    <div className="sharedButton">
                        {/* ===== Apply Button (Activated) ===== */}
                        <button
                            className="sharedBtn applyBtn"
                            onClick={() => {
                                if (!user) {
                                    toast.error("Please log in to apply");
                                    Navigate("/login");
                                } else {
                                    setOpenApply(true);
                                }
                            }}
                        >
                            <TiDocumentText />
                            Apply For this job
                        </button>

                        {/* WhatsApp */}
                        <button
                            className="sharedBtn"
                            onClick={() =>
                                window.open(
                                    `https://wa.me/?text=Check%20out%20this%20job:%20${encodeURIComponent(
                                        jobUrl
                                    )}`,
                                    "_blank"
                                )
                            }
                        >
                            <img
                                src="/popular-logos/whatsApp.jfif"
                                alt="WhatsApp"
                                className="btnLogo"
                            />
                            Share on WhatsApp
                        </button>

                        {/* Facebook */}
                        <button
                            className="sharedBtn"
                            onClick={() =>
                                window.open(
                                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                        jobUrl
                                    )}`,
                                    "_blank"
                                )
                            }
                        >
                            <img
                                src="/popular-logos/facebook.jfif"
                                alt="Facebook"
                                className="btnLogo"
                            />
                            Share on Facebook
                        </button>

                        {/* LinkedIn */}
                        <button
                            className="sharedBtn"
                            onClick={() =>
                                window.open(
                                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                        jobUrl
                                    )}`,
                                    "_blank"
                                )
                            }
                        >
                            <img
                                src="/popular-logos/linkedin.png"
                                alt="LinkedIn"
                                className="btnLogo"
                            />
                            Share on LinkedIn
                        </button>

                        {/* Twitter */}
                        <button
                            className="sharedBtn"
                            onClick={() =>
                                window.open(
                                    `https://twitter.com/intent/tweet?text=Check%20out%20this%20job!%20${encodeURIComponent(
                                        jobUrl
                                    )}`,
                                    "_blank"
                                )
                            }
                        >
                            <img
                                src="/popular-logos/x.png"
                                alt="Twitter"
                                className="btnLogo"
                            />
                            Share on Twitter
                        </button>
                    </div>

                    {/* Copy Link */}
                    <div className="others">
                        <input
                            type="text"
                            className="jobUrlInput"
                            value={jobUrl}
                            readOnly
                        />
                        <button className="copyBtn" onClick={copyJobUrl}>
                            <MdContentCopy className="copyIcon" />
                        </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="job-bottom-right">
                        <p className="job-title">{job?.title}</p>
                        <span className="job-type">({job?.job_type})</span>
                    </div>
                </div>
            </div>

            {/* ===== Apply Job Modal ===== */}
            {openApply && (
                <DialogDemo
                    jobId={id}
                    open={openApply}
                    onOpenChange={setOpenApply}
                />
            )}
        </div>
    );
}

export default JobDetails;
