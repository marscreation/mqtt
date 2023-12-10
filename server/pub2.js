const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");
const { getCurrentDateTime, generateUniqueId } = require("./helper.js");

client.on("connect", function () {
  setInterval(function () {
    let random = (Math.random() * 50).toFixed(2).padStart(5, '0');
    if (random < 40) {
      let data = {
        id: generateUniqueId(),
        deviceId: "39238fjgur582",
        record_date: getCurrentDateTime(),
        temp: random,
        power: "-1",
      };
      console.log(Object.values(data).join(""));
      client.publish("pasa_daw2", Object.values(data).join(""));
    }
  }, 5000);
});
