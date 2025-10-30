import { FiEdit } from "react-icons/fi";
import { MdOutlineCameraAlt } from "react-icons/md";
import { useAuth } from "../../hook/AuthContext";
import EditImagesDialog from "../../ui/EditImagesDialog";
import UpdateImagesDialog from "../../ui/UpdateImagesDialog";
import UpdateProfileDialog from "../../ui/UpdateProfileDialog";
import "./BackGroundInfo.css";

function BackGroundInfo() {
    const { user } = useAuth();
    if (!user || !user.data?.user) return <p>No user found</p>;

    const fullUser = user.data.user;
    const profile = fullUser.profile || {};
    const skills = profile.skills
        ? profile.skills.split(",").map((s) => s.trim())
        : [];
    const BASE_URL = "http://127.0.0.1:8000/";

    return (
        <div className="profile-container">
            {/* HEADER */}
            <div className="profile-header">
                <img
                    src={
                        profile.background_image
                            ? `${BASE_URL}${profile.background_image}`
                            : "/background_images/linkedin-bg2.jpg"
                    }
                    alt="Background"
                    className="bg-image"
                />

                <EditImagesDialog
                    trigger={
                        <button className="edit-btn edit-bg-bottom">
                            <MdOutlineCameraAlt />
                        </button>
                    }
                />

                <img
                    src={
                        profile.profile_image
                            ? `${BASE_URL}${profile.profile_image}`
                            : "/profile/default.jpg"
                    }
                    alt="Profile"
                    className="profile-photo"
                />

                <UpdateImagesDialog
                    trigger={
                        <button className="edit-btn edit-profile">
                            <MdOutlineCameraAlt />
                        </button>
                    }
                />

                <UpdateProfileDialog
                    trigger={
                        <button className="edit-btn edit-info">
                            <FiEdit />
                        </button>
                    }
                />
            </div>

            {/* MAIN INFO */}
            <div className="profile-box">
                <div className="profile-left">
                    <div className="user-details">
                        <h2 className="user-name">
                            {profile.first_name || ""} {profile.last_name || ""}
                        </h2>
                        <p className="user-description">
                            {profile.description || "No Description Found!"}
                        </p>

                        <div className="user-tags">
                            {skills.map((skill, index) => (
                                <span key={index} className="tag">
                                    #{skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profile-right">
                    <h3>Additional Info</h3>
                    <p>
                        <strong>Email:</strong> {fullUser.email || "N/A"} <br />
                        <strong>Phone:</strong> {profile.phone || "N/A"} <br />
                        <strong>Role:</strong> {fullUser.role || "N/A"} <br />
                        <strong>Education:</strong> {profile.education || "N/A"}{" "}
                        <br />
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BackGroundInfo;
