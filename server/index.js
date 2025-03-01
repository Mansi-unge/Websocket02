
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import { SensorData } from "./models/SensorData.js"; // Import model correctly

connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Important for handling JSON payloads

// API routes
app.use("/api/sensors", sensorRoutes);

// WebSocket handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sensorData", async (data) => {
        console.log("Received sensor data:", data);

        try {
            const newData = new SensorData(data);
            await newData.save();
            console.log("Emitting updateSensorData event:", newData);
            io.emit("updateSensorData", newData);
        } catch (error) {
            console.error("Error saving data:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));


export { io }; // Export WebSocket instance
