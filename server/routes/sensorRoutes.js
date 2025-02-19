import express from "express";
import { receiveSensorData, getLatestSensorData } from "../controllers/SensorController.js";

const router = express.Router();

router.post("/", receiveSensorData);
router.get("/", getLatestSensorData);

export default router;
