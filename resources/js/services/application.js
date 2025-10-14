const BASE_URL = "http://127.0.0.1:8000/api";
export async function applyForJob(jobId, formData) {
    const storedUser = sessionStorage.getItem("authUser");
    if (!storedUser) {
        throw new Error("User not authenticated. Please log in first.");
    }

    const parsedUser = JSON.parse(storedUser);
    const token = parsedUser?.token;
    if (!token) {
        throw new Error("User not authenticated. Please log in first.");
    }

    const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    let data;
    try {
        data = await res.json();
    } catch (err) {
        throw new Error("Invalid response from server");
    }

    if (!res.ok) {
        console.error("Server error:", data);
        throw new Error(data.message || "Failed to apply for this job");
    }

    return data;
}

// get allpied jobs by id
export async function getAppliedJobsByUser() {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;
    if (!token) throw new Error("User not authenticated.");

    const res = await fetch(`${BASE_URL}/my-applications`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch applications");
    }

    return res.json();
}

// Delete the applied jobs

export async function deleteAppliedJob(id) {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    const res = await fetch(`http://127.0.0.1:8000/api/applications/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to delete job");
    }

    return res.json();
}
