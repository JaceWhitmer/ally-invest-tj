import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import axios from "axios";
import * as dayjs from "dayjs";

const PriceChart = (props) => {
  const { ticker, points } = props;
  console.log(props);
  const [ohlc, setOhlc] = useState(false);
  const [volume, setVolume] = useState(false);
  const getHistoricalChartData = async () => {
    try {
      const { data } = await axios.post("/api/yahooFinance/historical", {
        ticker,
      });
      const ohlc = await data.map((arr) => arr[0]);
      setOhlc(ohlc);
      let volume = await data.map((arr) => arr[1]);
      setVolume(volume);
    } catch (error) {
      console.log("Error getHistoricalChartData()");
    }
  };
  useEffect(() => {
    getHistoricalChartData();
  }, [ticker]);

  const data = {
    series: [
      {
        name: "candlestick",
        data: ohlc,
      },
    ],
    options: {
      annotations: {
        position: "front",
        points: points,
      },
      chart: {
        type: "candlestick",
        height: 250,
        id: "candles",
        toolbar: {
          //   autoSelected: "pan",
        },
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
        type: "category",
        labels: {
          show: false,
          formatter: function (val) {
            let day = new Date(val).getDay();
            if (!day === 0 || day !== 6) {
              return dayjs(val).format("MMM DD HH:mm");
            }
          },
        },
      },
      yaxis: {
        decimalsInFloat: 2,
        opposite: true,
        type: "decimal",
      },
    },
    seriesBar: [
      {
        name: "volume",
        data: volume,
      },
    ],
    optionsBar: {
      chart: {
        height: 160,
        type: "bar",
        brush: {
          enabled: true,
          target: "candles",
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          columnWidth: "80%",
          colors: {
            ranges: [
              {
                from: -1000,
                to: 0,
                color: "#F15B46",
              },
              {
                from: 1,
                to: 10000,
                color: "#FEB019",
              },
            ],
          },
        },
      },
      stroke: {
        width: 0,
      },
      tooltip: {
        x: {
          show: true,
        },
      },
      xaxis: {
        type: "category",
        labels: {
          show: false,
          formatter: function (val) {
            let day = new Date(val).getDay();
            if (!day === 0 || day !== 6) {
              return dayjs(val).format("MMM DD HH:mm");
            }
          },
        },
      },
      yaxis: {
        decimalsInFloat: 2,
        opposite: true,
        type: "decimal",

        labels: {
          show: true,
        },
      },
    },
  };

  console.log(data);

  return (
    <div>
      {ticker}
      {!ohlc && !volume ? null : (
        <>
          <Chart
            options={data.options}
            series={data.series}
            type="candlestick"
            width={"100%"}
            height={400}
          />

          <Chart
            options={data.optionsBar}
            series={data.seriesBar}
            type="bar"
            width={"100%"}
            height={150}
          />
        </>
      )}
    </div>
  );
};
export default PriceChart;
