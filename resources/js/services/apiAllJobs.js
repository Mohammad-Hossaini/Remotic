const BASE_URL = "http://127.0.0.1:8000/api";
// export async function getJobs() {
//     const res = await fetch(`${BASE_URL}/jobs`, {
//         method: "GET",
//         headers: {
//             Accept: "application/json",
//         },
//     });

//     const data = await res.json();
//     if (!res.ok) {
//         // console.log("Server Error:", data);
//         throw new Error(data.message || "Failed to fetch jobs");
//     }
//     return data;
// }
export async function getJobs() {
    const res = await fetch(`${BASE_URL}/jobsforall`, {
        // <-- updated route
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
    }

    return data;
}

// Get A user specific job
export async function userPostedJobs() {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    if (!token) throw new Error("User not authenticated. Please log in first");

    const res = await fetch(`${BASE_URL}/employer/jobs`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    // Check if response is OK before parsing
    if (!res.ok) {
        const errorText = await res.text(); // in case backend returns HTML
        console.error("Server Error: ", errorText);
        throw new Error(`Failed to get jobs! Status: ${res.status}`);
    }

    const data = await res.json();
    // console.log("Fetched jobs data:", data);
    return data;
}

/**
 * Create a new job
 * @param {Object} newJob - The job object containing:
 *   title, description, salary_min, salary_max, job_type, location, status
 */

export async function createJob(newJob) {
    try {
        const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
        const token = storedUser?.token;

        if (!token) throw new Error("No token found. Please login again.");

        const res = await fetch(`${BASE_URL}/jobs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`, // 👈 حالا درست
            },
            body: JSON.stringify(newJob),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Server error:", data);
            throw new Error(data.message || "Failed to create new job");
        }

        return data;
    } catch (error) {
        console.error("Error creating job:", error);
        throw error;
    }
}

// Update a job (Employer only)
export async function updateJob(jobId, jobData) {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    if (!token) throw new Error("User not authenticated. Please log in first");
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
    });

    const data = await res.json();
    if (!res.ok) {
        console.log("Server Error:", data);
        throw new Error(data.message || "Failed to update job");
    }
    return data;
}

// Delete a job (Employer only)
export async function deleteJob(jobId) {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    if (!token) throw new Error("User not authenticated. Please log in first");

    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({})); // Handle empty response

    if (!res.ok) {
        console.error("Server Error:", data);
        throw new Error(
            data.message || `Failed to delete job (status: ${res.status})`
        );
    }

    return true;
}
