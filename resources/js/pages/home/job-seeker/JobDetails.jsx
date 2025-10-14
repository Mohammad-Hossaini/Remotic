import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./JobDetails.css";

function JobDetails() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/jobs/${id}`
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

    const jobUrl = `https://company.com/job/${id}`;

    const copyJobUrl = () => {
        navigator.clipboard.writeText(jobUrl);
        alert("Job URL copied!");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="jobDetails">
            {/* Header Section */}
            <div className="jobDetailsHeader">
                <div className="jobDetailsHeaderLeft">
                    <h1 className="headerTitle">
                        {job?.title} <span className="atText">at</span>{" "}
                        {job?.company.name}
                    </h1>

                    <p className="headerDesc">{job?.company.description}</p>

                    <div className="headerButtons">
                        <button className="btn-secondary">VIEW COMPANY</button>
                    </div>
                </div>
                <div className="jobDetailsHeaderRight"></div>
            </div>

            {/* Content Section */}
            <div className="jobContent">
                {/* About Job */}
                <div className="aboutJob">
                    <h2>About this job</h2>
                    <div className="aboutJobContent">
                        <div className="jobImage">
                            <img
                                src={
                                    job?.companyLogo ||
                                    "/company-images/image(2).jfif"
                                }
                                alt="Company Logo"
                                className="jobImg"
                            />
                        </div>
                        <div className="jobInfo">
                            <p>
                                {job?.company.name}{" "}
                                <span>({job?.job_type})</span>
                            </p>
                            <h4>{job?.location}</h4>
                            <strong>{`${job?.salary_max} - ${job?.salary_min}`}</strong>
                        </div>
                    </div>
                    <p>{job?.description}</p>
                </div>

                {/* Shared Buttons with Company Logos */}
                <div className="sharedButton">
                    <button className="sharedBtn">
                        <img
                            src="/popular-logos/logo(7).jfif"
                            alt="WhatsApp"
                            className="btnLogo"
                        />
                        Share on WhatsApp
                    </button>
                    <button className="sharedBtn">
                        <img
                            src="/popular-logos/logo(3).png"
                            alt="Facebook"
                            className="btnLogo"
                        />
                        Share on Facebook
                    </button>
                    <button className="sharedBtn">
                        <img
                            src="/popular-logos/logo(2).png"
                            alt="LinkedIn"
                            className="btnLogo"
                        />
                        Share on LinkedIn
                    </button>
                    <button className="sharedBtn">
                        <img
                            src="/popular-logos/logo(4).png"
                            alt="Twitter"
                            className="btnLogo"
                        />
                        Share on Twitter
                    </button>
                </div>
                <div className="skills">
                    <h2>Skills</h2>
                    <div className="buttons">
                        {job?.requirements ? (
                            job.requirements.split(",").map((skill, index) => (
                                <button key={index} className="skillBtn">
                                    {skill.trim()}
                                </button>
                            ))
                        ) : (
                            <p>No skills listed</p>
                        )}
                    </div>
                </div>

                {/* Job URL */}
                <div className="others">
                    <input
                        type="text"
                        className="jobUrlInput"
                        value={jobUrl}
                        readOnly
                    />
                    <button className="copyBtn" onClick={copyJobUrl}>
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;
