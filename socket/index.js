import { Server } from "socket.io";

const io = new Server(5000, {
    cors: { origin: "http://127.0.0.1:8000" },
});

// آرایه برای نگهداری کاربران آنلاین
let onlineUsers = [];

// اضافه کردن کاربر جدید
const addNewUser = (socket) => {
    if (!onlineUsers.some((u) => u.socketId === socket.id)) {
        onlineUsers.push({
            socketId: socket.id,
            token: socket.token,
            name: socket.user.name,
            role: socket.role,
        });
        console.log(`➕ User added: ${socket.user.name} (${socket.role})`);
    }
};

// حذف کاربر هنگام قطع اتصال
const removeUser = (socketId) => {
    const removed = onlineUsers.find((u) => u.socketId === socketId);
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
    if (removed)
        console.log(`❌ User removed: ${removed.name} (${removed.role})`);
};

// Middleware Authentication
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Authentication failed");

        const data = await res.json();

        socket.user = data;
        socket.token = token;
        socket.role = data.role;

        console.log(
            `✅ Authenticated user: ${socket.user.name} (${socket.role})`
        );
        next();
    } catch (err) {
        console.error(err.message);
        next(new Error("Authentication failed"));
    }
});

io.on("connection", (socket) => {
    addNewUser(socket);

    // Event: تست
    socket.on("testButtonClicked", (msg) => {
        console.log(`🟢 Test button clicked by ${socket.user.name}:`, msg);
        socket.emit("testResponse", `Received your message: "${msg}"`);
    });

    // Event: اعلان وظیفه جدید
    socket.on("postedJob", (jobInfo) => {
        console.log(
            `🟢 ${socket.user.name} posted a new job: "${jobInfo.jobTitle}" from ${jobInfo.companyName} with this comapny logo ${jobInfo.companyLogo} by ${jobInfo.employerName}`
        );

        // ارسال به کارفرما خود برای تأیید
        socket.emit(
            "getResponse",
            `✅ Job "${jobInfo.jobTitle}" received successfully!`
        );

        // ارسال فقط به کارجویان آنلاین
        for (let [id, s] of io.of("/").sockets) {
            if (s.role === "job_seeker") {
                s.emit("newJobPosted", jobInfo);
            }
        }
    });

    // Event: Logout
    socket.on("logout", () => {
        removeUser(socket.id);
        console.log(`❌ User logged out: ${socket.user.name}`);
        socket.disconnect();
    });

    // قطع اتصال
    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log(`❌ User disconnected: ${socket.user.name}`);
    });
});
