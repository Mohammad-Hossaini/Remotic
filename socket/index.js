import { Server } from "socket.io";
const io = new Server(5000, {
    cors: {
        origin: "http://127.0.0.1:8000",
    },
});

// ======================
// 🔒 Middleware Authentication
// ======================
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Authentication failed");

        const data = await res.json();
        socket.user = data; // اطلاعات کاربر
        socket.token = token; // توکن در سوکت ذخیره می‌شود
        next();
    } catch (err) {
        next(new Error("Authentication failed"));
    }
});

// ======================
// 👥 مدیریت کاربران آنلاین
// ======================
let onlineUsers = [];

const addNewUser = (token, socketId) => {
    if (!onlineUsers.some((u) => u.token === token)) {
        onlineUsers.push({ token, socketId });
        console.log("➕ User added:", token);
    }
};

const removeUser = (socketId) => {
    const removed = onlineUsers.find((u) => u.socketId === socketId);
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socketId);
    if (removed) console.log("❌ User removed:", removed.token);
};

const getUser = (token) => onlineUsers.find((u) => u.token === token);

// ======================
// ⚡ Socket Events
// ======================
io.on("connection", (socket) => {
    addNewUser(socket.token, socket.id);
    console.log("✅ User connected:", socket.user?.name, socket.token);

    socket.on("logout", () => {
        removeUser(socket.id);
        console.log("❌ User logged out:", socket.user?.name);
        socket.disconnect();
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log("❌ User disconnected:", socket.user?.name);
    });
});
