import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ccyFormatter } from "../../../../../util";
import PriceChart from "../../../../../components/ui/priceChart";
import HoldingDetails from "../../../../../components/ui/holdingDetails";
import EntryModal from "../../../../../components/ui/entryModal";
import dayjs from "dayjs";

const dateFormatting = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  // hour: "numeric",
  // minute: "2-digit",
  timeZone: "America/New_York",
};

//
const Ticker = ({ accounts }) => {
  const router = useRouter();
  const [ticker, setTicker] = useState(router.query.ticker);
  const [account, setAccount] = useState(router.query.account);
  const [currentAccount, setCurrentAccount] = useState(
    accounts.filter((acct) => acct.account === account)[0]
  );
  const [transactions, setTransactions] = useState([]);
  const [cs, setCs] = useState([]);
  const [options, setOptions] = useState([]);
  const [points, setPoints] = useState([]);

  const [open, setOpen] = useState(false);
  const [entryTrade, setEntryTrade] = useState(false);
  const handleOpen = (e) => {
    setOpen(true);
    setEntryTrade(cs[e.target.parentElement.id]);
  };
  const handleClose = () => setOpen(false);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.post("/api/ally/history", {
        account,
        ticker,
      });
      //   console.log(data);
      setTransactions(data);
    } catch (error) {
      console.log("ticker index Historical Transactions Error");
    }
    // }
  };

  const createPoints = () => {
    if (cs && cs.length !== 0) {
      let points = cs.map(
        ({ date, transaction, amount }) =>
          [
            {
              x: dayjs(new Date(date)).format("MMM DD HH:mm"),
              y: parseFloat(transaction.price),
              marker: {
                size: 1,
                // shape: "square",
              },
              label: {
                text: amount[0] === "-" ? "B" : "S",

                style: {
                  background: amount[0] === "-" ? "green" : "red",
                  color: "#fff",
                },
              },
            },
          ][0]
      );
      setPoints(points);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [ticker]);

  useEffect(() => {
    if (transactions.length !== 0) {
      const data = transactions.filter(
        ({
          activity,
          transaction: {
            security: { sectyp },
          },
        }) => activity === "Trade" && sectyp === "CS"
      );
      setCs(data);
    }
  }, [transactions]);

  useEffect(() => {
    createPoints();
  }, [cs]);

  //   console.log(entryTrade);

  return (
    <div>
      <PriceChart ticker={ticker} points={points} />
      <div>
        <input id="ticker-search"></input>
        <button
          onClick={(e) => {
            const ticker = document
              .getElementById("ticker-search")
              .value.toUpperCase();

            router.replace(`${ticker}`);
            setTicker(ticker);
          }}
        >
          Search
        </button>
      </div>
      <EntryModal open={open} handleClose={handleClose} trade={entryTrade} />
      <HoldingDetails
        currentAccount={currentAccount}
        ticker={ticker}
        trades={cs}
        handleOpen={handleOpen}
      />
    </div>
  );
};
export default Ticker;

// const totalReturn = (trades, marketValue) => {
//   if (trades) {
//     const mktValue = marketValue || 0;
//     // console.log(mktValue);
//     let buy = trades.filter(({ amount }) => amount[0] === "-");
//     buy = buy.map(({ amount }) => parseFloat(amount));
//     let sell = trades.filter(({ amount }) => amount[0] !== "-");
//     sell = sell.map(({ amount }) => parseFloat(amount));
//     const proceeds = sell.reduce((a, b) => a + b, 0) || 0;
//     const costBasis = buy.reduce((a, b) => a + b, 0);
//     const gl = costBasis + mktValue + proceeds;
//     const totalReturn = ((gl / Math.abs(costBasis)) * 100).toFixed(2) + "%";

//     return {
//       proceeds,
//       mktValue,
//       costBasis,
//       totalReturn,
//       gl,
//     };
//   } else {
//     return 0;
//   }
// };

// const getMarketValue = (accounts, account, ticker) => {
//   const arr = accounts.filter((a) => a.account === account);
//   const holdings = [];
//   arr.map(({ accountholdings: { holding } }) => {
//     for (const obj of holding) {
//       if (obj.instrument.sym === ticker.toUpperCase()) {
//         holdings.push(parseFloat(obj.marketvalue));
//       }
//     }
//   });
//   return holdings[0];
// };
