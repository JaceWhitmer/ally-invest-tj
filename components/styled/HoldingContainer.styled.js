import styled from "styled-components";
import { ccyFormatter } from "../../util";

const MainContainer = styled.div`
  /* width: 150px; */
  height: 150px;
  background-color: ${({ dollarChange, theme }) =>
    dollarChange < 0 ? theme.colors.red : theme.colors.green};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Ticker = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.light};
`;

const DollarChange = styled.h1`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.light};
`;

const PercentageChange = styled.h1`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.light};
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const HoldingContainer = (props) => {
  const {
    children,
    transactions,
    tickerSymbols,
    ticker,
    accounts,
    account,
    dollarChange,
    id,
    router,
  } = props;

  return (
    <MainContainer
      id={id}
      onClick={(e) => {
        const { id } = e.target;

        router.push(`${account}/ticker/${id}`);
      }}
      dollarChange={dollarChange}
      router={router}
    >
      <Ticker>{ticker}</Ticker>
      <FlexRow>
        <DollarChange>{ccyFormatter.format(dollarChange)}</DollarChange>
        <PercentageChange></PercentageChange>
      </FlexRow>
    </MainContainer>
  );
};
