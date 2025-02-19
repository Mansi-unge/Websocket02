// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");
// const connectDB = require("./config/db.js");
// const sensorRoutes = require("./routes/sensorRoutes");
// const SensorData = require("./models/SensorData");

// connectDB();
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());
// app.use("/api/sensors", sensorRoutes);

// io.on("connection", (socket) => {
//     console.log("A user connected");
//     socket.on("sensorData", (data) => {
//         io.emit("updateSensorData", data);
//     });
//     socket.on("disconnect", () => console.log("User disconnected"));
// });

// // Generate dummy data every 1 minute
// setInterval(async () => {
//     const dummyData = {
//         temperature: (Math.random() * 10 + 20).toFixed(2),
//         pressure: (Math.random() * 10 + 1000).toFixed(2),
//         altitude: (Math.random() * 100 + 500).toFixed(2),
//         roll: (Math.random() * 10 - 5).toFixed(2),
//         yaw: (Math.random() * 10 - 5).toFixed(2),
//         pitch: (Math.random() * 10 - 5).toFixed(2),
//     };
//     console.log("Generated Data:", dummyData);  // Log the generated data
//     const newData = new SensorData(dummyData);
//     await newData.save();
//     io.emit("updateSensorData", dummyData);
// }, 60000);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, "192.168.31.68", () => console.log(`Server running on 192.168.31.68:${PORT}`));


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
server.listen(PORT, "192.168.31.68", () => console.log(`Server running on 192.168.31.68:${PORT}`));

export { io }; // Export WebSocket instance
