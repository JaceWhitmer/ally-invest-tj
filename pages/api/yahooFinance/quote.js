const yahooFinance = require("yahoo-finance");

export default async function handler(req, res) {
  try {
    const { ticker } = req.body;
    const response = await yahooFinance.quote(ticker, [
      "recommendationTrend",
      "summaryDetail",
      "earnings",
      "calendarEvents",
      "price",
      "defaultKeyStatistics",
      "summaryProfile",
      "financialData",
    ]);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: "/api/yahooFinance/quote" });
  }
}
