// @flow
import * as React from 'react';
import styled from 'styled-components';
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  FlexibleXYPlot,
  MarkSeries,
} from 'react-vis';
import { buildBrackets, federalIncomeTax, federalIncomeTaxBrackets } from './compute-taxes';
import type { Bracket, Currency } from './compute-taxes';
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

// TODO: salarys should by dynamic I guess -- right now
// if user enters an income more than 1 million, it won't be
// represented in the graph
const salarys = [];
const MAX = 1000000;
for (let i=1000; i <= 1000000; i += 1000) {
  salarys.push(i);
}

const taxIntervals = federalIncomeTaxBrackets(BRACKETS_2017, MAX).map(bracket => [
  { x: bracket.min, y: bracket.rate },
  { x: bracket.max, y: bracket.rate },
]);

const computedTaxRates = salarys.map(sampleIncome => {
  const taxes = federalIncomeTax(BRACKETS_2017, sampleIncome);
  const rate = taxes / sampleIncome;
  return { x: sampleIncome, y: rate };
});

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const GraphContainer = styled.div`
  height: 50%;
`;

type Props = {};

type State = {
  income: Currency,
};

class App extends React.Component<Props, State> {
  state = {
    income: 100000,
  };

  handleIncomeChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const income = parseInt(value, 10);
    if (isNaN(income)) { return; }

    this.setState(() => ({
      income,
    }));
  };

  render() {
    const { income } = this.state;
    const taxes = federalIncomeTax(BRACKETS_2017, income);
    const rate = taxes / income;
    return (
      <Container>
        <div>
          gross income:
          <input
            type="number"
            value={income}
            onChange={this.handleIncomeChange}
          />
        </div>
        <TaxBrackets brackets={BRACKETS_2017} income={income} />
        <GraphContainer>
          <FlexibleXYPlot
            xDomain={[0, MAX]}
            yDomain={[0, 1]}
          >
            <HorizontalGridLines />
            <VerticalGridLines />
            <XAxis title="gross income" />
            <YAxis title="tax rate" />
            <MarkSeries data={[{ x: income, y: rate }]}/>
            <LineSeries data={computedTaxRates} />
            {taxIntervals.map((data, i) =>
              <LineSeries key={i} data={data} strokeStyle="dashed" />
            )}
          </FlexibleXYPlot>
        </GraphContainer>
      </Container>
    )
  }
}

export default App;
