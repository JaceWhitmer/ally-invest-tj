require("dotenv").config();
// const { capitalizeFirstLetter } = require("../../components/util");

const alpha = require("alphavantage")({ key: process.env.ALPHA_VANTAGE_KEY });
console.log(alpha);
const dateFormatting = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  // hour: "numeric",
  // minute: "2-digit",
  timeZone: "America/New_York",
};

export default async function handler(req, res) {
  const { ticker, interval } = req.body;
  console.log("backend", interval);
  const response = await alpha["data"][`${interval}_adjusted`](ticker);

  const timeSeries = Object.entries(response)[1][1];

  const formatTimeSeriesData = (ts) => {
    let result = [];
    Object.entries(ts).map((arr) => {
      const date = new Date(arr[0]).toLocaleString("en-US", dateFormatting);
      let ohlc = Object.values(arr[1]).slice(0, 4);
      ohlc = ohlc.map((price) => parseFloat(price));
      result.push({ x: date, y: ohlc });
    });
    result = result.reverse();
    return result;
  };

  const series = formatTimeSeriesData(timeSeries);
  console.log(series);

  res.status(200).json({ series });
}
