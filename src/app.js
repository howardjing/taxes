// @flow
import React from 'react';
import { buildBrackets, federalIncomeTax } from './compute-taxes';
import type { Bracket } from './compute-taxes';
import TaxBrackets from './tax-brackets';
import dollars from './format-dollars';

const BRACKETS_2017: Bracket[] = buildBrackets([
  [9325, 0.1],
  [37950, 0.15],
  [91900, 0.25],
  [191650, 0.28],
  [416700, 0.33],
  [418400, 0.35],
  [Infinity, 0.396],
]);

const income = 100000;
const intervals = [];
for (let i=1000; i <= 500000; i += 1000) {
  intervals.push(i);
}

const App = () => (
  <div>
    <TaxBrackets brackets={BRACKETS_2017} income={income} />
    <ul>
      {intervals.map(income => {
        const taxes = federalIncomeTax(BRACKETS_2017, income);
        const rate = taxes / income;
        const formattedRate = (rate * 100).toFixed(2)
        return (
          <li key={income}>
            taxes: {dollars(income)} | rate: {formattedRate}%
          </li>
        );
      })}
    </ul>
  </div>
)

export default App;
