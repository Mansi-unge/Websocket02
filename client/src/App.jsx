import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.31.68:5000");

function App() {
  const [sensorData, setSensorData] = useState(null);

  // Fetch latest data when the component mounts
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetch("http://192.168.31.68:5000/api/sensors");
        const data = await response.json();
        if (data.length > 0) {
          setSensorData(data[0]); // Set the latest data
        }
      } catch (error) {
        console.error("Error fetching latest sensor data:", error);
      }
    };

    fetchLatestData(); // Initial fetch

    socket.on("updateSensorData", (data) => {
      console.log("Received Data from WebSocket:", data);
      setSensorData(data); // Update state when new data arrives
    });

    return () => {
      socket.off("updateSensorData");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Real-Time Sensor Data</h1>
      {sensorData ? (
        <div className="grid grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
          <div className="text-gray-700"><strong>RTC Time:</strong> {new Date(sensorData.RTC_Time).toLocaleString()}</div>
          <div className="text-gray-700"><strong>Latitude:</strong> {sensorData.Latitude}</div>
          <div className="text-gray-700"><strong>Longitude:</strong> {sensorData.Longitude}</div>
          <div className="text-gray-700"><strong>Altitude:</strong> {sensorData.Altitude} m</div>
          <div className="text-gray-700"><strong>Roll:</strong> {sensorData.roll}°</div>
          <div className="text-gray-700"><strong>Pitch:</strong> {sensorData.pitch}°</div>
          <div className="text-gray-700"><strong>Yaw:</strong> {sensorData.yaw}°</div>
          <div className="text-gray-700"><strong>Temperature:</strong> {sensorData.bmpTemp} °C</div>
          <div className="text-gray-700"><strong>Pressure:</strong> {sensorData.pressure} hPa</div>
          <div className="text-gray-700"><strong>Accel X:</strong> {sensorData.accelX}</div>
          <div className="text-gray-700"><strong>Accel Y:</strong> {sensorData.accelY}</div>
          <div className="text-gray-700"><strong>Accel Z:</strong> {sensorData.accelZ}</div>
        </div>
      ) : (
        <p className="text-gray-600">Loading latest sensor data...</p>
      )}
    </div>
  );
}

export default App;
