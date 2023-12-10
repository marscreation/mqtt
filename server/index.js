import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { loginUser, registerUser } from "./controllers/AuthController.js";
import { getTempByDeviceId, getTempByUser } from "./controllers/TemperatureController.js";
import { addDevice, deleteDevice, getDevices, getUserDevices, runDevice } from "./controllers/DeviceController.js";

dotenv.config();
const PORT = process.env.PORT || 8080;
const CONNECTION = process.env.MONGODB_CONNECTION;
const app = express();
app.use(express.json());

app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/mqtt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error(err));

app.listen(8080, () => {
  console.log("listening on port 8080");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/user/login", loginUser);
app.post("/user/register", registerUser);
app.post("/devices", addDevice);
app.get("/devices", getDevices);
app.get("/devices/user/:userId", getUserDevices);
app.get("/device", getTempByDeviceId);
app.get("/device/run/:deviceId", runDevice);
app.delete("/devices/:deviceId", deleteDevice);
