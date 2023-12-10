import TemperaturesModel from "../models/temperaturesModel.js";
import DeviceModel from "../models/devices.js";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export const addTemp = async (topic, message) => {
  try {
    console.log("addTemp", topic, message.toString());
    const insertTemp = new TemperaturesModel({
      topic,
      value: parseFloat(message),
    });
    const result = await insertTemp.save();
    // console.log("result:", result);
  } catch (error) {
    console.error("Error in addTemp:", error);
  }
};

export const getTempByUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    if (!userId) {
      res.status(401).send("user id is required");
    } else {
      // get device topic by userId
      const devicesTopic = await DeviceModel.findOne({ userId }).select(
        "topic"
      );

      const tempData = await TemperaturesModel.findOne({ device: `${userId}` });
      if (!tempData) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      } else {
        return res.status(200).json({
          success: true,
          data: [tempData],
        });
      }
    }
  } catch (err) {
    console.error(`Error in getting temperature by user ${err}`);
    res.status(500).send();
  }
};

export const getTempByDeviceId = async (req, res) => {
  try {
    const deviceId = req.query.deviceId;
    const recordDate = req.query.date;
    if (!deviceId) {
      res.status(401).send("device id is required");
    } else {
      const device = await DeviceModel.findOne({ _id: deviceId }).select(
        "topic"
      );
      const specificLocalDate = new Date(recordDate);
      const utcDate = utcToZonedTime(specificLocalDate, "Asia/Manila");
      // Convert local date to UTC
      const specificUTCDate = new Date(
        utcDate.getTime() - utcDate.getTimezoneOffset()
      );
      console.log(
        "utcDate",
        new Date(utcDate),
        specificLocalDate,
        new Date(new Date(specificUTCDate).getTime() + 24 * 60 * 60 * 1000)
      );
      // find record by date filter by date
      const tempRecord = await TemperaturesModel.find({
        device: device._id.toString(),
        createdAt: {
          $gte: new Date(specificUTCDate),
          $lte: new Date(
            new Date(specificUTCDate).getTime() + 24 * 60 * 60 * 1000
          ),
        },
      })
        .sort({ createdAt: -1 })
        .limit(1);

      const tempData = await TemperaturesModel.find({
        topic: device.topic,
        createdAt: {
          $gte: new Date(specificUTCDate),
          $lte: new Date(
            new Date(specificUTCDate).getTime() + 24 * 60 * 60 * 1000
          ),
        },
      }).select("value createdAt");
      if (!tempData) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      } else {
        return res.status(200).json(tempData);
      }
    }
  } catch (err) {
    console.log(`Error in getting temperature by device ${err}`);
    res.status(500).send();
  }
};
