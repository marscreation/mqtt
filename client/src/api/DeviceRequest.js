const API_URL = import.meta.env.VITE_REACT_API_URL;

export const getDeviceRecord = async (id, date) => {
  try {
    const response = await fetch(
      `${API_URL}/device?deviceId=${id}&date=${date}`
    );
    if (response.ok) {
      const result = response.json();
      // console.log(result);
      return result;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getDevices = async () => {
  try {
    const response = await fetch(`${API_URL}/devices`);
    if (response.ok) {
      const result = response.json();
      // console.log("devices", result);
      return result;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const addDevice = async ({ deviceName, deviceTopic }) => {
  try {
    const data = { device: deviceName, topic: deviceTopic };
    console.log("add", data);
    const response = await fetch(`${API_URL}/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = response.json();
      // console.log(result);
      return {success: true};
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const deleteDevices = async (id) => {
  try {
    const body = {};
    const response = await fetch(`${API_URL}/devices/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const result = response.json();
      return result;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
