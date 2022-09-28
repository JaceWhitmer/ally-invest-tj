const { allyInvestClient } = require("../auth/ally");

export default async function handler(req, res) {
  const { response } = await allyInvestClient.marketClock();
  console.log(response);
  res.status(200).json(response);
}
