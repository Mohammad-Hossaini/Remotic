const API_BASE = "http://127.0.0.1:8000/api";

// get from favorite
export async function getMyFavorites(token) {
    const res = await fetch(`${API_BASE}/my-favorites`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch favorites");
    return await res.json();
}

// add to  favorite
export async function addFavoriteJob(jobId, token) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/favorite`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to add favorite");
    return jobId;
}

// delete from favorite
export async function removeFavoriteJob(jobId, token) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/favorite`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to remove favorite");
    return jobId;
}
