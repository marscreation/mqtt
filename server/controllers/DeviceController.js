import DeviceModel from "../models/devices.js";
import { subscribeTo, unsubcribeTo } from "../sub.js";

export const addDevice = async (req, res) => {
  const body = { ...req.body, userId: "656734b3c2edde97bbb323b9" };
  console.log("body", req.body);
  const newDevice = new DeviceModel(body);
  const { topic } = body;
  try {
    const device = await newDevice.save();
    res.status(200).json({ data: device });
    subscribeTo(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDevices = async (req, res) => {
  let devices = await DeviceModel.find({ active: 1 }).select(
    "_id device topic"
  );
  if (!devices) {
    return res.status(404).send("No Devices Found");
  } else {
    devices = devices.map((device) => {
      return {
        id: device._id,
        device: device.device,
        topic: device.topic,
      };
    });
    res.status(200).json(devices);
  }
};

export const runDevice = async (req, res) => {
  let devices = await DeviceModel.findOne({
    _id: req.params.deviceId,
    active: 1,
  }).select("_id device topic");
  if (!devices) {
    return res.status(404).send("No Devices Found");
  } else {
    console.log(`Running: ${devices.topic}`);
    subscribeTo(devices.topic);
    res.status(200).json(devices);
  }
};

export const initDevices = async (req, res) => {
  let devices = await DeviceModel.find({ active: 1 }).select(
    "_id device topic"
  );
  if (!devices) {
    return res.status(404).send("No Devices Found");
  } else {
    for (const device of devices) {
      if (device?.topic && device?.topic !== "") {
        console.log(`Running: ${device.topic}`);
        subscribeTo(device.topic);
      }
    }
    res.status(200).json({ message: "Running..." });
  }
};

export const getUserDevices = async (req, res) => {
  let devices = await DeviceModel.find({ userId: req.params.userId }).select(
    "_id device topic"
  );
  if (!devices) {
    return res.status(404).send("No Devices Found");
  } else {
    devices = devices.map((device) => {
      return {
        id: device._id,
        device: device.device,
        topic: device.topic,
      };
    });
    res.status(200).json(devices);
  }
};

export const deleteDevice = async (req, res) => {
  // const newDevice = new DeviceModel(req.body);
  const { deviceId } = req.params;
  try {
    const device = await DeviceModel.findByIdAndUpdate(deviceId, { active: 0 });
    if (device?.topic && device.topic !== "") unsubcribeTo(topic);
    res.status(200).json({ success: true, message: "Successfully removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const initAllDevice = async () => {
  let devices = await DeviceModel.find({ active: 1 }).select(
    "_id device topic"
  );
  if (!devices) {
    return res.status(404).send("No Devices Found");
  } else {
    let topics = [];
    for (const device of devices) {
      if (device?.topic && device?.topic !== "") {
        if (!topics.includes(device.topic)) {
          console.log(`Running: ${device.topic}`);
          subscribeTo(device.topic);
        } else {
          console.log("doubled", device.topic)
        }
        topics.push(device.topic);
      }
    }
    console.log({ message: "Running..." });
  }
};
