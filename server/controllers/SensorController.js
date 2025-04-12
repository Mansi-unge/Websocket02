import { SensorData } from "../models/SensorData.js";
import { io } from "../index.js";

const receiveSensorData = async (req, res) => {
  try {
    const incomingData = req.body;

    if (!incomingData || Object.keys(incomingData).length === 0) {
      return res.status(400).json({ message: "Sensor data is missing" });
    }

    const newData = new SensorData({ data: incomingData });
    await newData.save();

    io.emit("updateSensorData", incomingData); // Emit raw data
    res.status(201).json({ message: "Sensor data saved", data: newData });
  } catch (error) {
    console.error("Error receiving sensor data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getLatestSensorData = async (req, res) => {
    try {
      const latestData = await SensorData.find().sort({ createdAt: -1 }).limit(10);
      // Return only the inner `data` part
      res.json(latestData.map(entry => entry.data));
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


// // /* Backend - controllers/sensorController.js */
// // const SensorData = require("../models/SensorData");
// // exports.storeSensorData = async (req, res) => {
// //     try {
// //         const newData = new SensorData(req.body);
// //         await newData.save();
// //         res.status(201).json({ message: "Data stored successfully" });
// //     } catch (error) {
// //         res.status(500).json({ error: "Server Error" });
// //     }
// // };


// import { SensorData } from "../models/SensorData.js";
// import { io } from "../index.js";


// const receiveSensorData = async (req, res) => {
//     try {
//         console.log("Received Sensor Data:", req.body);

//         if (!req.body) {
//             return res.status(400).json({ message: "Request body is missing" });
//         }

//         const {
//             accelX, accelY, accelZ,
//             roll, pitch, yaw,
//             bmpTemp, pressure,
//             RTC_Time, Latitude, Longitude, Altitude
//         } = req.body;

//         const newData = new SensorData({
//             accelX, accelY, accelZ,
//             roll, pitch, yaw,
//             bmpTemp, pressure,
//             RTC_Time, Latitude, Longitude, Altitude
//         });

//         await newData.save();
//         io.emit("updateSensorData", newData);

//         res.status(201).json({ message: "Sensor data received and saved", data: newData });
//     } catch (error) {
//         console.error("Error receiving sensor data:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


// // Fetch the latest sensor data
// const getLatestSensorData = async (req, res) => {
//     try {
//         const latestData = await SensorData.find().sort({ createdAt: -1 }).limit(10);
//         res.json(latestData);
//     } catch (error) {
//         console.error("Error fetching sensor data:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export { receiveSensorData, getLatestSensorData };
