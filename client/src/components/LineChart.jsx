import { useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js/auto";
import 'chartjs-adapter-date-fns'
import { Bar, Line } from "react-chartjs-2";

function LineChart({ chartData, options }) {
  return <Line data={chartData} options={options} />;
}

export default LineChart;
