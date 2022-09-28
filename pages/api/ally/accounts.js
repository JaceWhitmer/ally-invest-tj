const { allyInvestClient } = require("../auth/ally");

export default async function handler(req, res) {
  const { response } = await allyInvestClient.accounts();
  const {
    accounts: { accountsummary },
  } = response;

  const sortedAccounts = accountsummary.sort((a, b) =>
    parseFloat(a.accountbalance.accountvalue) >
    parseFloat(b.accountbalance.accountvalue)
      ? 1
      : -1
  );
  res.status(200).json(sortedAccounts);
}
