import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AccountContainer } from "../components/styled/AccountContainer.styled";
import { ccyFormatter } from "../util";
import { AccountHeader } from "../components/styled/AccountHeader.styled";
import { AccountValue } from "../components/styled/AccountValue.styled";

export default function Home(props) {
  const { accounts } = props;
  console.log(props);
  const router = useRouter();

  const accountClick = (e) => {
    const { id } = e.target.parentNode;
    if (id !== "__next") {
      router.push(`account/${id}`);
      //   console.log(id);
    } else {
      console.log("__next is parent");
    }
  };

  return (
    <>
      {accounts.map(({ account, accountbalance }) => {
        return (
          <AccountContainer id={account} key={account} onClick={accountClick}>
            <AccountHeader>{`${account}`}</AccountHeader>

            <AccountValue>{`${ccyFormatter.format(
              accountbalance.accountvalue
            )}`}</AccountValue>
            <hr />
          </AccountContainer>
        );
      })}
      <div>
        <button onClick={(e) => router.push("performance")}>Performance</button>
      </div>
    </>
  );
}
