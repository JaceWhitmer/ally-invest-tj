const { allyInvestClient } = require("../auth/ally");
// const fs = require("fs");
// const validTransactionTypes = [
//   "dividend",
//   "bookkeeping",
//   "trade",
//   "interest",
//   "reinvestment",
//   "assigned",
//   "expired",
// ];

export default async function handler(req, res) {
  const { account, ticker } = req.body;

  console.log("Fetching Historical Transactions Server Side");
  //   if (accountArr && accountArr.length !== 0) {
  // let historicalTransactions = {};
  // for (const account of accountArr) {
  const {
    response: {
      transactions: { transaction },
    },
  } = await allyInvestClient.historyForAccount(account, "all", "all");

  transaction.reverse();

  const filteredTransactions = transaction.filter(
    ({ symbol }) => symbol.toUpperCase() === ticker.toUpperCase()
  );

  //   historicalTransactions[account] = transaction;
  // }
  // const stringData = JSON.stringify(historicalTransactions);
  // fs.writeFileSync("historicalTransactions.txt", stringData, function (err) {
  //   if (err) {
  //     console.log("Error saving historcalTransactioins");
  //   }
  // });
  res.status(200).json(filteredTransactions);
  //   } else {
  //     res.status(404).json({ error: "No Transactions Found" });
  //   }
}
