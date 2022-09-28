import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import axios from "axios";
import * as dayjs from "dayjs";
import { sma } from "technicalindicators";
import { ConstructionOutlined } from "@mui/icons-material";

const PriceChart = (props) => {
  //   const ma = sma({
  //     period: 5,
  //     values: [1, 2, 3, 4, 5, 6, 7, 8, 90],
  //     reversedInput: true,
  //   });

  const { ticker, points } = props;
  console.log("points", points);
  const [ohlcOptions, setOhlcOptions] = useState({
    annotations: {
      points: points,
    },
    chart: {
      type: "candlestick",
      height: 250,
      id: "candlestick",
      zoom: {
        enabled: true,
      },
    },
    tooltip: {
      x: {
        show: true,
      },
    },
    xaxis: {
      type: "datetime",
      tickPlacement: "on",
      labels: {
        show: true,
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          //   hour: "HH:mm",
        },
      },
    },
    yaxis: {
      decimalsInFloat: 0,
      opposite: true,
      type: "decimal",
    },
    legend: {
      show: false,
    },
  });
  //   const [volumeOptions, setVolumeOptions] = useState({
  //     chart: {
  //       height: 160,
  //       type: "bar",
  //       brush: {
  //         enabled: true,
  //         target: "candlestick",
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     plotOptions: {
  //       bar: {
  //         columnWidth: "80%",
  //         colors: {
  //           ranges: [
  //             {
  //               from: -1000,
  //               to: 0,
  //               color: "#F15B46",
  //             },
  //             {
  //               from: 1,
  //               to: 10000,
  //               color: "#FEB019",
  //             },
  //           ],
  //         },
  //       },
  //     },
  //     stroke: {
  //       width: 0,
  //     },
  //     tooltip: {
  //       x: {
  //         show: true,
  //       },
  //     },
  //     xaxis: {
  //       type: "category",
  //       labels: {
  //         show: false,
  //         formatter: function (val) {
  //           let day = new Date(val).getDay();
  //           if (!day === 0 || day !== 6) {
  //             return dayjs(val).format("MMM DD HH:mm");
  //           }
  //         },
  //       },
  //     },
  //     yaxis: {
  //       decimalsInFloat: 2,
  //       opposite: true,
  //       type: "decimal",

  //       labels: {
  //         show: true,
  //       },
  //     },
  //   });

  const [ohlcSeries, setOhlcSeries] = useState([
    {
      data: [],
    },
  ]);
  //   const [volumeSeries, setVolumeSeries] = useState([
  //     {
  //       data: [],
  //     },
  //   ]);
  const [period, setPeriod] = useState(50);

  const getHistoricalChartData = async () => {
    try {
      const { data } = await axios.post("/api/yahooFinance/historical", {
        ticker,
      });

      const ohlc = await data.map((arr) => arr[0]);
      const dates = await ohlc.map(({ x, y }) => x);
      const close = await ohlc.map(({ x, y }) => y[3]);

      const ma = sma({
        period: period,
        values: close,
        reversedInput: true,
      });

      const sliceStart = dates.length - ma.length;

      const maDates = dates.slice(sliceStart, dates.length);
      console.log("maDates", maDates);
      console.log(ma);
      const result = ma.reduce((result, field, index) => {
        let obj = {};
        let date = maDates[index];
        date = date.toString();
        // obj[date] = field;
        result.push({ x: date, y: field });
        return result;
      }, []);

      //   let x = result.map({});
      console.log("result", result);

      setOhlcSeries([
        {
          name: "candlestick",
          type: "candlestick",
          data: [...ohlc],
        },
        {
          name: "sma",
          type: "line",
          data: result,
        },
      ]);
      //   const volume = await data.map((arr) => arr[1]);
      //   setVolumeSeries([
      //     {
      //       name: "volume",
      //       type: "bar",
      //       data: [...volume],
      //     },
      //   ]);
    } catch (error) {
      console.log("Error getHistoricalChartData()");
      console.log(error);
    }
  };

  //   console.log(ohlcSeries);

  useEffect(() => {
    getHistoricalChartData();
  }, [ticker]);

  return (
    <div>
      {ticker}
      <Chart
        options={ohlcOptions}
        series={ohlcSeries}
        type="candlestick"
        width={"100%"}
        height={250}
      />
      {/* <Chart
        options={volumeOptions}
        series={volumeSeries}
        type="bar"
        width={"100%"}
        height={160}
      /> */}
    </div>
  );
};
export default PriceChart;

// Working combo candlestick chart variables
// var series = [
//   {
//     name: "line",
//     type: "line",
//     data: [
//       {
//         x: new Date(1538778600000),
//         y: 6604,
//       },
//       {
//         x: new Date(1538782200000),
//         y: 6602,
//       },
//       {
//         x: new Date(1538814600000),
//         y: 6607,
//       },
//       {
//         x: new Date(1538884800000),
//         y: 6620,
//       },
//     ],
//   },
//   {
//     name: "candle",
//     type: "candlestick",
//     data: [
//       {
//         x: new Date(1538778600000),
//         y: [6629.81, 6650.5, 6623.04, 6633.33],
//       },
//       {
//         x: new Date(1538780400000),
//         y: [6632.01, 6643.59, 6620, 6630.11],
//       },
//       {
//         x: new Date(1538782200000),
//         y: [6630.71, 6648.95, 6623.34, 6635.65],
//       },
//       {
//         x: new Date(1538784000000),
//         y: [6635.65, 6651, 6629.67, 6638.24],
//       },
//       {
//         x: new Date(1538785800000),
//         y: [6638.24, 6640, 6620, 6624.47],
//       },
//       {
//         x: new Date(1538787600000),
//         y: [6624.53, 6636.03, 6621.68, 6624.31],
//       },
//       {
//         x: new Date(1538789400000),
//         y: [6624.61, 6632.2, 6617, 6626.02],
//       },
//       {
//         x: new Date(1538791200000),
//         y: [6627, 6627.62, 6584.22, 6603.02],
//       },
//       {
//         x: new Date(1538793000000),
//         y: [6605, 6608.03, 6598.95, 6604.01],
//       },
//     ],
//   },
// ];

// const options = {
//   chart: {
//     height: 350,
//     type: "line",
//   },
//   title: {
//     text: "CandleStick Chart",
//     align: "left",
//   },
//   stroke: {
//     width: [3, 1],
//   },

//   xaxis: {
//     type: "datetime",
//   },
// };
