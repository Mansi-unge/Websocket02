import mqtt from "mqtt";
import { SensorData } from "../models/SensorData.js";

export const setupMQTT = (io) => {
  const mqttClient = mqtt.connect("mqtt://broker.hivemq.com"); // Change to your broker

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT Broker");
    mqttClient.subscribe("drone/sensors"); // Subscribe to drone sensor data
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      console.log(`Received MQTT message on ${topic}:`, message.toString());
      const data = JSON.parse(message.toString());

      const newData = new SensorData(data);
      await newData.save();

      io.emit("updateSensorData", newData); // Send data to frontend via WebSockets
    } catch (error) {
      console.error("Error processing MQTT message:", error);
    }
  });

  mqttClient.on("error", (error) => {
    console.error("MQTT Error:", error);
  });
};
