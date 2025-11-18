import { useMutation } from "@tanstack/react-query";
import { sendNotification } from "../../../services/apiNotifications";
export default function TestNotificationButton() {
    const { mutate, isPending } = useMutation({
        mutationFn: sendNotification,
        onSuccess: () => {
            alert("Notification sent successfully!");
        },
        onError: (err) => {
            alert(err.message);
        },
    });

    function handleSend() {
        mutate({
            user_id: 16, // 👈 هر کاربر که می‌خواهی تست کنی
            title: "New Job Posted",
            message: "A new job has been posted by an employer.",
        });
    }

    return (
        <button
            onClick={handleSend}
            disabled={isPending}
            style={{
                padding: "10px 20px",
                background: "#4f46e5",
                color: "#fff",
                borderRadius: "8px",
            }}
        >
            {isPending ? "Sending..." : "Send Test Notification"}
        </button>
    );
}
