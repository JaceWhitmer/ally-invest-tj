const { allyInvestClient } = require("../auth/ally");

export default async function handler(req, res) {
  const { account } = req.body;
  //   console.log(account);
  const { response } = await allyInvestClient.holdingsForAccount(account);
  //   console.log(response);
  res.status(200).json(response.accountholdings);
}
