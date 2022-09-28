const fs = require("fs");

const transactions = fs.readFileSync(
  `historicalTransactions.txt`,
  "utf-8",
  function (err) {
    if (err) {
      console.log("Error bro");
    }
  }
);

export default async function handler(req, res) {
  try {
    const data = JSON.parse(transactions);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: "No Data Found" });
  }
}
