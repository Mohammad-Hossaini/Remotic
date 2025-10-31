import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { FaRegHeart } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { useAuth } from "../../../hook/AuthContext";

import Loader from "../../../components/loader/Loader";
import {
    getMyFavorites,
    removeFavoriteJob,
} from "../../../services/apiFavorites";
import "./SavedJobs.css";

function SavedJobs() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const token = user?.token;

    const { data: companies = [], isLoading: loadingCompanies } = useQuery({
        queryKey: ["companies"],
        queryFn: async () => {
            const res = await fetch("http://127.0.0.1:8000/api/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });

    const companyMap = {};
    companies.forEach((c) => {
        companyMap[c.id] = c;
    });

    const {
        data: savedJobs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["myFavorites", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            return await getMyFavorites(token);
        },
        enabled: !!user?.id,
        staleTime: 0,
    });

    const { mutate: removeJob } = useMutation({
        mutationFn: (jobId) => removeFavoriteJob(jobId, token),
        onSuccess: (jobId) => {
            queryClient.setQueryData(["myFavorites", user?.id], (old = []) =>
                old.filter((fav) => fav.job.id !== jobId)
            );
            toast.success("Job removed from favorites!");
        },
        onError: (err) => toast.error(err.message || "Failed to remove job"),
    });

    if (isLoading || loadingCompanies)
        return (
            <div style={{ height: "70vh" }}>
                <Loader center />
            </div>
        );
    if (isError) return <p className="error">Failed to fetch saved jobs.</p>;

    return (
        <div className="savedJobContainer">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="favHeader">
                <h2>Saved Jobs</h2>
            </div>

            {savedJobs.length === 0 ? (
                <p className="no-jobs">No saved jobs yet.</p>
            ) : (
                savedJobs.map((fav) => {
                    const job = fav.job;
                    const company = companyMap[job.company_id];

                    return (
                        <div key={fav.id} className="savedJobsCard">
                            <div className="left">
                                <div className="job-img">
                                    <img
                                        src={
                                            company?.logo
                                                ? `http://127.0.0.1:8000/storage/${company.logo}`
                                                : "/company-images/default.png"
                                        }
                                        alt={company?.name || "Company Logo"}
                                    />
                                </div>

                                <div className="job-desc">
                                    <h3 className="job-title">{job.title}</h3>
                                    <p className="job-company">
                                        {company?.name ||
                                            job.company?.name ||
                                            "Unknown Company"}
                                    </p>
                                    <p className="job-meta">
                                        <IoLocationSharp /> {job.location} •{" "}
                                        {job.job_type} • Deadline:{" "}
                                        {job.deadline
                                            ? new Date(
                                                  job.deadline
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="right">
                                <FaRegHeart
                                    className="unfaveIcon"
                                    onClick={() => removeJob(job.id)}
                                />
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default SavedJobs;
