const { allyInvestClient } = require("../auth/ally");

export default async function handler(req, res) {
  const { ticker } = req.body;
  try {
    const { response } = await allyInvestClient.getMarketQuotesForSymbols({
      symbols: ticker,
    });
    //   console.log(response);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(404)
      .json({ error: "Error getting market quote api/ally/quote" });
  }
}
