import { useEffect, useState } from "react";
import { deleteDevices, getDevices } from "../api/DeviceRequest";

import React from "react";

export default function DeviceListTable({ deviceList, updateDevices }) {
  // const [deviceList, setDeviceList] = useState([]);

  const btnDelete = async (id) => {
    const response = confirm("Are you sure you want to remove this device?");
    if (response) {
      const result = await deleteDevices(id);
      updateDevices();
    }
  };

  // useEffect(() => {
  //   async function getData() {
  //     const getDeviceList = await getDevices();
  //     setDeviceList(getDeviceList);
  //   }
  //   getData();
  // }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deviceList.length > 0 &&
            deviceList.map((item) => (
              <tr key={item.id}>
                <td>{item.device}</td>
                <td>
                  <button onClick={(e) => btnDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
