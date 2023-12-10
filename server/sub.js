import mqtt from "mqtt";
import { addTemp } from "./controllers/TemperatureController.js";
import { addDevice } from "./controllers/DeviceController.js";
import mongoose from "mongoose";

const client = mqtt.connect("mqtt://broker.hivemq.com");
let activeTopics = []; //topic,count
mongoose
  .connect("mongodb://localhost:27017/mqtt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error(err));

// single topic
// client.on("connect", function () {
//   client.subscribe("pasa_daw");
//   console.log("Client has subscribed succesfully");
//   client.on("message", function (topic, message) {
//     console.log(message.toString());
//   });
// });

function mqttNode() {
  const topics = [];
}

function connectoToBroker() {
  const topics = [];
  client.on("connect", function () {
    console.log("Connect successfully");
  });

  client.on("error", (err) => {
    console.log(`${err}`);
    client.end();
  });

  client.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  client.on("message", async (topic, message) => {
    console.log("received", topic, message.toString());
    activeTopics.every((element, index) => {
      if (element.topic === topic) {
        activeTopics[index].counter++;
        activeTopics[index].sum += parseFloat(message.toString());
        if (activeTopics[index].counter > 59) {
          const average = activeTopics[index].sum / activeTopics[index].counter;
          activeTopics[index].counter = 0;
          activeTopics[index].sum = 0;
          console.log("average", average.toFixed(3), topic);
          addTemp(topic, average.toFixed(3));
        }
        return false;
      }
      return true;
    });
  });
  // console.log(
  //   `Received message: ${topic.toString()}\nTopic: ${message.toString()}\n`
  // );
}

function addData(connect, topic) {
  let temp = {};
  connect.on("message", async (topic, message, packet) => {
    console.log(topic, message.toString(), packet);
    // if (temp.length >= 59) {
    //   temp.push({ topic: topic, data: message });

    //   const average = temp.reduce((prev, curr) => {
    //     return parseFloat(curr.data.toString()) + parseFloat(prev);
    //   }, 0);

    //   addTemp(topic, (average / temp.length).toFixed(3));
    //   temp = [];
    // } else {
    //   temp.push({ topic: topic, data: message });
    //   console.log("addTem", temp.length, topic, message.toString());
    // }
  });
  // console.log(`Subscribed to ${topic}`);
}

export const subscribeTo = (subsTopic) => {
  client.subscribe(subsTopic, { qos: 1 }, () => {
    console.log("Subscribing to " + subsTopic + " ...");
    activeTopics.push({ topic: subsTopic, counter: 0, sum: 0 });
  });
};

connectoToBroker();
// subscribeTo("temperature2");

// addTemp("temperature2", 20);
