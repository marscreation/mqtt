import { useEffect, useRef, useState } from "react";
import "./App.css";
import { format } from "date-fns";
import { TemperatureData } from "./Data.js";
import LineChart from "./components/LineChart.jsx";
import { getDeviceRecord, getDevices } from "./api/DeviceRequest.js";
import DeviceListTable from "./components/DeviceListTable.jsx";
import RegisterDevice from "./components/RegisterDevice.jsx";

function App() {
  const [temp, setTemp] = useState([]);
  const [deviceData, setDeviceData] = useState({});
  const [lineOptions, setLineOptions] = useState({});
  const [recordDate, setRecordDate] = useState();
  const [device, setDevice] = useState([]);
  const [filterDate, setFilterDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const dateFilter = useRef();
  const deviceoption = useRef();
  const [deviceList, setDeviceList] = useState([]);
  const getTemp = async (id, date) => {
    let data = await getDeviceRecord(id, date);
    setTemp(data);
  };

  const submitFilter = async (e) => {
    e.preventDefault();
    if (!deviceoption.current.value || !dateFilter.current.value) return;
    //get temp based on selected device and filter date
    setRecordDate(new Date(dateFilter.current.value));
    getTemp(deviceoption.current.value, dateFilter.current.value);
  };

  const getDeviceList = async () => {
    const list = await getDevices();
    setDeviceList(list);
  };

  useEffect(() => {
    getDeviceList();
  }, []);

  useEffect(() => {
    let options = {
      maintainAspectRatio: false,
      scales: {
        // y: {
        //   beginAtZero: true,
        // },
        x: {
          // min: new Date(recordDate.setHours(0, 0, 0)),
          // max: new Date(recordDate.setHours(23, 59, 59)),
          type: "time",
          time: {
            unit: "minute",
            displayFormats: {
              minute: "HH:mm",
            },
          },
          ticks: {
            maxRotation: 0,
            autoSkipPadding: 30,
            source: "auto",
            autoSkip: true,
          },
        },
      },
    };
    let data = {
      labels: temp?.map((data) => data.createdAt),
      datasets: [
        {
          label: "Temperature",
          data: temp?.map((data) => data.value),
          backgroundColor: "#f87979",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    if (data?.labels?.length > 0) {
      setDeviceData(data);
      setLineOptions(options);
    } else {
      const curDate = new Date();
      data.datasets = [];
      options.scales.x.min = new Date(curDate.setHours(0, 0, 0));
      options.scales.x.max = new Date(curDate.setHours(23, 59, 59));
      setDeviceData(data);
      setLineOptions(options);
    }
  }, [temp]);

  return (
    <div className="tempeature-chart">
      <div>
        <form onSubmit={submitFilter}>
          <select
            ref={deviceoption}
            // defaultValue={device}
            onChange={(e) => setDevice(e.target.value)}
          >
            {deviceList.length > 0 &&
              deviceList?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.device}
                </option>
              ))}
          </select>
          <input
            type="date"
            id="recordDate"
            ref={dateFilter}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button type="submit" style={{ cursor: "pointer" }}>
            Filter
          </button>
        </form>
      </div>

      <div style={{ height: 640 }}>
        {deviceData?.labels?.length > 0 && (
          <LineChart chartData={deviceData} options={lineOptions} />
        )}
      </div>
      <div style={{display: "flex", justifyContent:"center", gap: 50, marginTop: 50}}>
      <DeviceListTable deviceList={deviceList} updateDevices={getDeviceList} />
      <RegisterDevice updateDevices={getDeviceList} />

      </div>
    </div>
  );
}

export default App;
