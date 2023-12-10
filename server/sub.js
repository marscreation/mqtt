import mqtt from "mqtt";
import { addTemp } from "./controllers/TemperatureController.js";
import { addDevice } from "./controllers/DeviceController.js";
import mongoose from "mongoose";

const client = mqtt.connect("mqtt://broker.hivemq.com");
const CONNECTION = process.env.MONGODB_CONNECTION;
let activeTopics = []; //topic,count

mongoose
  .connect(CONNECTION, {
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
    // console.log("received", topic, message.toString());
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

export const subscribeTo = (subsTopic) => {
  client.subscribe(subsTopic, { qos: 1 }, () => {
    console.log("Subscribing to " + subsTopic + " ...");
    activeTopics.push({ topic: subsTopic, counter: 0, sum: 0 });
  });
};

export const unsubcribeTo = (subsTopic) => {
  client.unsubscribe(subsTopic)
};

connectoToBroker();
// subscribeTo("temperature2");

// addTemp("temperature2", 20);
