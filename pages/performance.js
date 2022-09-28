import { PerformanceContainer } from "../components/styled/PerformanceContainer.styled";

const tickerSkip = ["UAA"];

const Performance = (props) => {
  const { accounts, historicalTransactions } = props;
  const accountArr = accounts.map(({ account }) => account);

  return (
    <div>
      {accountArr.map((acct) => {
        let transactions = historicalTransactions[acct];
        let tickerSymbols = transactions
          ? transactions.map(({ activity, symbol }) =>
              activity === "Trade" ? symbol.toUpperCase() : ""
            )
          : [];
        tickerSymbols = [...new Set(tickerSymbols)].filter((sym) => sym !== "");
        console.log(tickerSymbols);
        return (
          <div key={acct}>
            <h1>{acct}</h1>
            {tickerSymbols.map((ticker) => {
              if (!ticker.includes(tickerSkip)) {
                return (
                  <PerformanceContainer
                    key={ticker}
                    ticker={ticker}
                    accounts={accounts}
                    account={acct}
                    transactions={transactions}
                    tickerSymbols={tickerSymbols}
                  />
                );
              }
            })}
            <hr />
          </div>
        );
      })}
    </div>
  );
};
export default Performance;
