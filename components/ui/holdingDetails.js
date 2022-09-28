import { useEffect, useState } from "react";
import axios from "axios";
import { ccyFormatter, intToString } from "../../util";
import styled from "styled-components";

const DetilContainer = styled.section`
  /* max-width: 900px; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1em;
  padding: 1em;
  /* padding: 5rem; */
`;

const DetailDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const makeDollar = (string) => {
  return ccyFormatter.format(string);
};

const HoldingDetails = (props) => {
  const { currentAccount, ticker, trades, handleOpen } = props;
  const [holding, setHolding] = useState({});
  const [quote, setQuote] = useState({});

  useEffect(() => {
    const obj = currentAccount;
    if (obj.account) {
      const {
        accountholdings: { holding },
      } = currentAccount;
      const result = holding.filter(
        ({ instrument }) => instrument.sym === ticker
      );
      setHolding(result[0]);
    }
  }, [ticker]);

  const getQuote = async () => {
    try {
      const { data } = await axios.post("/api/yahooFinance/quote", { ticker });
      setQuote(data);
    } catch (error) {
      console.log("Error getting yahoo finance quote");
    }
  };

  useEffect(() => {
    getQuote();
  }, [ticker]);

  //   console.log(trades);

  return (
    <DetilContainer>
      <div style={{ maxWidth: "200px" }}>
        <h4>Performance</h4>
        <hr />
        {!holding.marketvalue ? null : (
          <>
            <DetailDiv>
              <p>{`Market Value:`}</p>
              <p>{makeDollar(holding.marketvalue)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Cost Basis:`}</p>
              <p>{makeDollar(holding.costbasis)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Gain/(Loss) $:`}</p>
              <p>{makeDollar(holding.gainloss)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Gain/(Loss) % :`}</p>
              <p>
                {(
                  (parseFloat(holding.gainloss) /
                    parseFloat(holding.costbasis)) *
                  100
                ).toFixed(2) + "%"}
              </p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Average Price:`}</p>
              <p>{makeDollar(holding.purchaseprice)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Daily Change`}</p>
              <p>{makeDollar(holding.marketvaluechange)}</p>
            </DetailDiv>
          </>
        )}
      </div>

      <div>
        <h4>Fundamentals</h4>
        <hr />
        {!quote.summaryDetail ? null : (
          <>
            <DetailDiv>
              <p>{`Market Cap:`}</p>
              <p>{intToString(quote.summaryDetail.marketCap)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Trailing PE:`}</p>
              <p>{parseFloat(quote.summaryDetail.trailingPE).toFixed(2)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Forward PE:`}</p>
              <p>{parseFloat(quote.summaryDetail.forwardPE).toFixed(2)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Gross Margins:`}</p>
              <p>{parseFloat(quote.financialData.grossMargins).toFixed(2)}</p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Operating Margins:`}</p>
              <p>
                {parseFloat(quote.financialData.operatingMargins).toFixed(2)}
              </p>
            </DetailDiv>
            <DetailDiv>
              <p>{`Revenue Growth:`}</p>
              <p>{parseFloat(quote.financialData.revenueGrowth).toFixed(2)}</p>
            </DetailDiv>
          </>
        )}
      </div>
      <div style={{ width: "400px" }}>
        <h4>Trades</h4>
        <hr />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
            {trades.length === 0
              ? null
              : trades.map((trade, id) => {
                  return (
                    <tr
                      onClick={handleOpen}
                      style={{ cursor: "pointer" }}
                      key={id}
                      id={id}
                    >
                      <td>{trade.amount[0] === "-" ? "Buy" : "Sell"}</td>
                      <td>{trade.date.split("T")[0]}</td>
                      <td>{trade.transaction.quantity}</td>
                      <td>{trade.transaction.price}</td>
                      <td>{ccyFormatter.format(trade.amount)}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </DetilContainer>
  );
};
export default HoldingDetails;
