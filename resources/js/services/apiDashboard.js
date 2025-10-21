// services/apiDashboard.js
const BASE_URL = "http://127.0.0.1:8000/api";

export const getDashboardStats = async (token) => {
    if (!token) throw new Error("No token provided");

    const res = await fetch(`${BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch dashboard data");
    }

    return res.json();
};

export const getEmployerDashboardStats = async (token) => {
    if (!token) throw new Error("No token provided");

    const res = await fetch(`${BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch dashboard data");
    }

    return res.json();
};
