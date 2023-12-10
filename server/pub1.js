const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

function connectToBroker() {
  client.on("connect", () => {
    console.log("Successfully connected...");
  });
}

function publishMessage(topic, message) {
  console.log(`Sending: ${topic}\nMessage: ${message}\n`);
  client.publish(topic, message);
}

function run() {
  setInterval(function () {
    let random = (Math.random() * 48).toFixed(2).padStart(5, "0");
    if (random > 30) {
      publishMessage("tempdaw1", random);
    }
  }, 3000);
}

connectToBroker();
run();