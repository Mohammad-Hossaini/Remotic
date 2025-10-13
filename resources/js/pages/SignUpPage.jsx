import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
    const [selectedRole, setSelectedRole] = useState("");
    const [agree, setAgree] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedRole) {
            toast.error("Please select your role first!");
            return;
        }

        // if (!agree) {
        //     toast.error("Please agree to the terms.");
        //     return;
        // }

        if (selectedRole === "job_seeker") {
            navigate("/register-job-seeker");
        } else if (selectedRole === "employer") {
            navigate("/register-employer");
        }
    };

    return (
        <div className="sign-up">
            <div className="sign-up-container">
                <h2 className="sign-up-title">Sign up to Remote Work Hub</h2>
                <p className="sign-up-desc">
                    Join over <strong>100,000</strong> satisfied job seekers and
                    companies already on Remote Work Hub.
                </p>

                <form onSubmit={handleSubmit} className="role-selection">
                    {/* Job Seeker */}
                    <label
                        className={`role-card ${
                            selectedRole === "job_seeker" ? "active" : ""
                        }`}
                        onClick={() => setSelectedRole("job_seeker")}
                    >
                        <div className="content">
                            <div className="job-seeker-profiles">
                                <img
                                    src="/profile/profile-1.jpg"
                                    alt=""
                                    className="profile-img small"
                                />
                                <img
                                    src="/profile/profile-2.jpg"
                                    alt=""
                                    className="profile-img medium"
                                />
                                <img
                                    src="/profile/profile-3.jpg"
                                    alt=""
                                    className="profile-img small"
                                />
                            </div>
                            <div className="descriptions">
                                <h3>I am looking for a remote job</h3>
                                <p>Find your next remote opportunity</p>
                            </div>
                        </div>
                    </label>

                    {/* Employer */}
                    <label
                        className={`role-card ${
                            selectedRole === "employer" ? "active" : ""
                        }`}
                        onClick={() => setSelectedRole("employer")}
                    >
                        <div className="content">
                            <div className="job-seeker-profiles">
                                <img
                                    src="/company-images/image(1).jfif"
                                    alt=""
                                    className="profile-img small"
                                />
                                <img
                                    src="/company-images/image(6).jfif"
                                    alt=""
                                    className="profile-img medium"
                                />
                                <img
                                    src="/company-images/image(3).jfif"
                                    alt=""
                                    className="profile-img small"
                                />
                            </div>
                            <div className="descriptions">
                                <h3>I am hiring remote workers</h3>
                                <p>Hire top remote talent globally</p>
                            </div>
                        </div>
                    </label>

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        <label htmlFor="terms">
                            I agree to the <a href="#">Terms & Conditions</a>
                        </label>
                    </div>

                    <button type="submit" className="cont-button">
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
