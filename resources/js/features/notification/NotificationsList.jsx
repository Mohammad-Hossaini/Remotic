import { useQuery } from "@tanstack/react-query";
import { getMyNotifications } from "../../services/apiNotifications";
// import { getMyNotifications } from "../api/apiNotifications";

export default function NotificationsList() {
    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: getMyNotifications,
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Notifications</h2>

            {data.length === 0 && <p>No notifications.</p>}

            {data.map((n) => (
                <div
                    key={n.id}
                    style={{
                        padding: "10px",
                        background: n.is_read ? "#eee" : "#dbeafe",
                        marginBottom: "10px",
                        borderRadius: "6px",
                    }}
                >
                    <h3>{n.title}</h3>
                    <p>{n.message}</p>
                </div>
            ))}
        </div>
    );
}
