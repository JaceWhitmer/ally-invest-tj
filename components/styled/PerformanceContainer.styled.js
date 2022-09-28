import styled from "styled-components";
import { ccyFormatter } from "../../util";

const MainContainer = styled.div`
  background-color: aquamarine;
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: flex-start; */
`;

const Ticker = styled.h1`
  font-size: 24px;
`;

const getTransaction = (arr, ticker, securityType) => {
  const regex = /UA?A/g;

  const result = arr.filter(
    ({
      symbol,
      transaction: {
        security: { sectyp },
      },
    }) =>
      sectyp === securityType &&
      symbol.match(!ticker.match(regex) ? ticker : regex)
  );
  //   if (ticker.match(/UA?A/g)) {
  //     console.log(result);
  //   }
  return result;
};

const getCostBasis = (arr) => {
  const result = arr.filter(({ amount }) => amount[0] === "-");
  result = result.map(({ amount }) => parseFloat(amount));
  const reduce = result.reduce((a, b) => a + b, 0);

  return reduce;
};

const getProceeds = (arr) => {
  const result = arr.filter(({ amount }) => amount[0] !== "-");
  result = result.map(({ amount }) => parseFloat(amount));
  const reduce = result.reduce((a, b) => a + b, 0);

  return reduce;
};

const getMarketValue = (accounts, account, ticker) => {
  const arr = accounts.filter((obj) => obj.account === account);
  const holdings = [];
  try {
    arr.map(({ accountholdings: { holding } }) => {
      if (holding && holding.length !== 0) {
        for (const obj of holding) {
          if (obj.instrument.sym === ticker.toUpperCase()) {
            holdings.push(parseFloat(obj.marketvalue));
          }
        }
      }
    });
    return holdings[0];
  } catch (error) {
    return 0;
  }
  //   return holdings;
};

export const PerformanceContainer = (props) => {
  const { children, transactions, tickerSymbols, ticker, accounts, account } =
    props;
  const options = getTransaction(transactions, ticker, "OPT");
  const stock = getTransaction(transactions, ticker, "CS");
  const optionCostBasis = getCostBasis(options);
  const stockCostBasis = getCostBasis(stock);
  const optionProceeds = getProceeds(options);
  const stockProceeds = getProceeds(stock);
  const marketValue = getMarketValue(accounts, account, ticker);
  const optionDollarRtrn = optionCostBasis + optionProceeds;
  const stockDollarRtrn = stockCostBasis + stockProceeds + (marketValue || 0);

  const optionPctRtrn =
    optionCostBasis !== 0
      ? ((optionDollarRtrn / Math.abs(optionCostBasis)) * 100).toFixed(2) + "%"
      : 0 + "%";
  const stockPctRtrn = stockCostBasis
    ? ((stockDollarRtrn / Math.abs(stockCostBasis)) * 100).toFixed(2) + "%"
    : 0 + "%";

  //   if (ticker === "IWM") {
  //     console.log(options);
  //     console.log(stock);
  //     console.log(accounts);
  //     console.log(marketValue);
  //   }

  return (
    <MainContainer>
      <Ticker>{ticker}</Ticker>
      <div>
        <h3>{`Options: ${ccyFormatter.format(
          optionDollarRtrn || 0
        )} ${optionPctRtrn}`}</h3>
      </div>
      <div>
        <h3>{`Stock: ${ccyFormatter.format(
          stockDollarRtrn || 0
        )} ${stockPctRtrn}`}</h3>
      </div>
      <div>{/* <h3>{`Total: ${}`}</h3> */}</div>
      <hr />
    </MainContainer>
  );
};
