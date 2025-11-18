const BASE_URL = "http://127.0.0.1:8000/api";
export async function sendNotification({ user_id, title, message }) {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    if (!token) throw new Error("User not authenticated. Please log in first");

    const res = await fetch(`${BASE_URL}/notifications`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, title, message }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send notification");

    return data;
}

export async function getNotifications() {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    const res = await fetch(`${BASE_URL}/notifications`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch notifications");

    return res.json();
}

export async function markNotificationAsRead(notificationId) {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    const res = await fetch(
        `${BASE_URL}/notifications/${notificationId}/read`,
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok)
        throw new Error(data.message || "Failed to mark notification as read");

    return data;
}

export async function deleteNotification(notificationId) {
    const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
    const token = storedUser?.token;

    const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok)
        throw new Error(data.message || "Failed to delete notification");

    return data;
}
