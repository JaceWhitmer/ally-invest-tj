import "../styles/globals.css";
import { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import axios from "axios";

const theme = {
  colors: {
    green: "#008f00",
    red: "#FF0000",
    light: "#F8F8F8",
  },
};

function MyApp({ Component, pageProps }) {
  //   const time = useTime();
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const { data } = await axios.get("/api/ally/accounts");
      setAccounts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const [historicalTransactions, setHistoricalTransactions] = useState(false);

  const fetchHistoricalTransactions = async () => {
    if (accounts.length !== 0) {
      try {
        const accountArr = accounts.map(({ account }) => account);
        const { data } = await axios.post("/api/ally/history", {
          accountArr: accountArr,
        });
        console.log(data);
        setHistoricalTransactions(data);
      } catch (error) {
        console.log("_app.js Historical Transactions Error");
      }
    }
  };

  useEffect(() => {
    fetchHistoricalTransactions();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Component
        // time={time}
        accounts={accounts}
        historicalTransactions={historicalTransactions}
        {...pageProps}
      />
    </ThemeProvider>
  );
}

// function useTime() {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const intervalId = window.setInterval(() => {
//       setTime(new Date());
//     }, 5000);

//     return () => {
//       window.clearInterval(intervalId);
//     };
//   }, []);

//   return time;
// }

export default MyApp;
