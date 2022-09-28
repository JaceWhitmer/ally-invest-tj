import { useEffect, useState } from "react";
import axios from "axios";
import { ccyFormatter } from "../../../util";
import { useRouter } from "next/router";
import { HoldingContainer } from "../../../components/styled/HoldingContainer.styled";
import { HoldingsSection } from "../../../components/styled/HoldingsSection.styled";

const Account = (props) => {
  const { accounts, historicalTransactions } = props;

  const router = useRouter();
  const { account } = router.query;

  const gainLoss = () => {
    if (holding) {
      const arr = holding.map(({ gainloss }) => parseFloat(gainloss));
      const result = arr.reduce((a, b) => a + b, 0);
      return ccyFormatter.format(result);
    } else {
      return 0;
    }
  };

  const costBasis = () => {
    if (holding) {
      const arr = holding.map(({ costbasis }) => parseFloat(costbasis));
      const result = arr.reduce((a, b) => a + b, 0);
      return ccyFormatter.format(result);
    } else {
      return 0;
    }
  };

  const currentAccount = () => {
    const result = accounts.filter(({ account: acct }) => acct === account)[0];
    if (result) {
      return (
        <div>
          <div>
            <h1>{account}</h1>
          </div>
          <HoldingsSection>
            {result.accountholdings.holding.map((position) => {
              console.log(position);
              return (
                <HoldingContainer
                  id={position.instrument.sym}
                  key={position.instrument.sym}
                  ticker={position.instrument.sym}
                  dollarChange={position.marketvaluechange}
                  router={router}
                  account={account}
                />
              );
            })}
          </HoldingsSection>
        </div>
      );
    }
  };

  return currentAccount();
};
export default Account;
