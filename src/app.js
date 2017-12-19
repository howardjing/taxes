// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { buildBrackets, federalIncomeTaxBrackets, sumBrackets } from './compute-taxes';
import type { Bracket } from './compute-taxes';

// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
const dollars = (n: number): string => `$${n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;

type Props = {
  brackets: Bracket[],
  income: number,
};

const BracketWrapper = styled.div`
  display: inline-block;
  background-color: green;
  margin: 0 10px 0 0;
  height: 60px;
`;

const Taxed = styled.div`
  height: 100%;
  background-color: purple;
  float: left;
`;

const App = ({ brackets, income }: Props) => {
  const taxBrackets = federalIncomeTaxBrackets(brackets, income);
  const taxes = sumBrackets(taxBrackets);
  const rate = taxes / income;
  return (
    <div>
      <h1>Income: {dollars(income)} | Taxed: {dollars(taxes)} | Rate: {(rate * 100).toFixed(2)}%</h1>
      <div>
        {taxBrackets.map(bracket => {
          const bracketWidth = bracket.length / income * 90;
          const taxedWidth = bracket.percent * 100;
          return (
            <BracketWrapper key={bracket.cap} style={{ width: `${bracketWidth}%` }}>
              <Taxed style={{ width: `${taxedWidth}%` }}>{dollars(bracket.taxes)}</Taxed>
            </BracketWrapper>
          )
        })}
      </div>
    </div>
  )
};

export default App;
