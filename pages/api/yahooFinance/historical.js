const yahooFinance = require("yahoo-finance");

const dateFormatting = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  // hour: "numeric",
  // minute: "2-digit",
  timeZone: "America/New_York",
};

export default async function handler(req, res) {
  try {
    const { ticker } = req.body;
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth();
    const yyyy = today.getFullYear();

    const response = await yahooFinance.historical(
      {
        symbol: ticker,
        from: `${yyyy - 5}-${mm}-${dd}`,
        to: today,
        period: "d",
      },
      function (err, quotes) {
        console.log(err);
      }
    );
    let chartData = response.map(
      ({ date, open, high, low, close, adjClose, volume }) => [
        {
          x: new Date(date),
          y: [open, high, low, close],
        },
        {
          x: new Date(date),
          y: volume,
        },
        // {
        //   x: date,
        //   y: close,
        // },
      ]
    );
    chartData = chartData.reverse();

    res.status(200).json(chartData);
  } catch (error) {
    res.status(404).json({
      error: "No Historical Yahoo Data Found /api/yahooFinance/historical",
    });
  }
}
