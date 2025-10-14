import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineTrash, HiOutlineUser } from "react-icons/hi";
import {
    deleteAppliedJob,
    getAppliedJobsByUser,
} from "../../../services/application";
import "./AppliedJobs.css";

export default function AppliedJobs() {
    const queryClient = useQueryClient();
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;
    const { data: companies = [], isLoading: loadingCompanies } = useQuery({
        queryKey: ["companies"],
        queryFn: async () => {
            const res = await fetch("http://127.0.0.1:8000/api/companies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        staleTime: 5 * 60 * 1000,
    });

    const companyMap = {};
    companies.forEach((c) => {
        companyMap[c.id] = c;
    });

    const {
        data: appliedJobs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["appliedJobs"],
        queryFn: () => getAppliedJobsByUser(),
        staleTime: 0,
    });

    const { mutate: removeJob } = useMutation(deleteAppliedJob, {
        onSuccess: () => {
            queryClient.invalidateQueries(["appliedJobs"]);
            toast.success("Job deleted successfully!");
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to delete application.");
        },
    });

    if (isLoading || loadingCompanies)
        return <p className="loading">Loading applied jobs...</p>;
    if (isError) return <p className="error">Failed to fetch applied jobs.</p>;

    return (
        <div className="appliedJobContainer">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="favHeader">
                <h2>Applied Jobs</h2>
            </div>

            {appliedJobs.length === 0 ? (
                <p className="no-jobs">No applications yet.</p>
            ) : (
                appliedJobs.map((app) => {
                    const company = companyMap[app.job.company_id];
                    return (
                        <div key={app.id} className="appliedJobsCard">
                            <div className="left">
                                <div className="job-img">
                                    <img
                                        src={
                                            company?.logo ||
                                            "/company-images/image(6).jfif"
                                        }
                                        alt={company?.name || "Company Logo"}
                                    />
                                </div>
                                <div className="job-desc">
                                    <h3 className="job-title">
                                        {app.job.title || "Unknown Job"}
                                    </h3>
                                    <p className="job-company">
                                        {company?.name || "Unknown Company"}
                                    </p>
                                    <p className="job-meta">
                                        {app.form?.countryCode}{" "}
                                        {app.form?.mobile}
                                    </p>
                                    <p className="job-status">
                                        Status: {app.status} <br />
                                        Applied at:{" "}
                                        {new Date(
                                            app.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="right">
                                <HiOutlineUser className="userIcon" />
                                <HiOutlineTrash
                                    className="deleteIcon"
                                    onClick={() => removeJob(app.id)}
                                />
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
