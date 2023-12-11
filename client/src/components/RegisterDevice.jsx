import { useRef, useState } from "react";
import { addDevice } from "../api/DeviceRequest";

export default function RegisterDevice({ updateDevices }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [formAction, setFormAction] = useState("add");
  const deviceName = useRef();
  const deviceTopic = useRef();

  const btnCancel = () => {
    setModalVisible(false);
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    // setModalVisible(false);
    const dname = deviceName.current.value;
    const dtopic = deviceTopic.current.value;
    const result = await addDevice({ deviceName: dname, deviceTopic: dtopic });
    if (result.success) {
      alert("Device added");
      updateDevices();
    } else {
      alert("Device not added");
    }
  };

  return (
    <div className={!modalVisible ? "hidden" : ""}>
      <h3>Register Device</h3>
      <form onSubmit={(e) => formSubmit(e)}>
        <label>Device Name:</label>
        <input type="text" name="deviceName" ref={deviceName} />
        <br />
        <label>MQTT Topic:</label>
        <input type="text" name="deviceSerialNumber" ref={deviceTopic} />
        <br />
        <button style={{ cursor: "pointer" }} type="submit">
          Save
        </button>
        {/* <button type="button" onClick={btnCancel}>
          Cancel
        </button> */}
      </form>
    </div>
  );
}
