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

type FilingOption = 'single' | 'joint' | 'head' | 'separate';

const brackets2017: { [FilingOption]: Bracket[] } = {
  single: buildBrackets([
    [9325, 0.1],
    [37950, 0.15],
    [91900, 0.25],
    [191650, 0.28],
    [416700, 0.33],
    [418400, 0.35],
    [Infinity, 0.396],
  ]),
  joint: buildBrackets([
    [18650, 0.1],
    [75900, 0.15],
    [153100, 0.25],
    [233350, 0.28],
    [416700, 0.33],
    [470700, 0.35],
    [Infinity, 0.396],
  ]),
  separate: buildBrackets([
    [9325, 0.1],
    [37950, 0.15],
    [76550, 0.25],
    [116675, 0.28],
    [208350, 0.33],
    [235350, 0.35],
    [Infinity, 0.396],
  ]),
  head: buildBrackets([
    [13350, 0.1],
    [50800, 0.15],
    [131200, 0.25],
    [212500, 0.28],
    [416700, 0.33],
    [444500, 0.35],
    [Infinity, 0.396],
  ]),
};

// TODO: salarys should by dynamic I guess -- right now
// if user enters an income more than 1 million, it won't be
// represented in the graph
const salarys = [];
const MAX = 1000000;
for (let i=1000; i <= 1000000; i += 1000) {
  salarys.push(i);
}

const filingOptions = Object.keys(brackets2017);

const taxIntervals = {};
filingOptions.forEach(option => {
  taxIntervals[option] = federalIncomeTaxBrackets(brackets2017[option], MAX).map(bracket => [
    { x: bracket.min, y: bracket.rate },
    { x: bracket.max, y: bracket.rate },
  ]);
});

const computedTaxRates = {};
filingOptions.forEach(option => {
  computedTaxRates[option] = salarys.map(sampleIncome => {
    const taxes = federalIncomeTax(brackets2017[option], sampleIncome);
    const rate = taxes / sampleIncome;
    return { x: sampleIncome, y: rate };
  });
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
  filingOption: FilingOption,
};


class App extends React.Component<Props, State> {
  state = {
    income: 100000,
    filingOption: 'single',
  };

  handleIncomeChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const income = parseInt(value, 10);
    if (isNaN(income)) { return; }

    this.setState(() => ({
      income,
    }));
  };

  handleFilingOptionChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState(() => ({
      // TODO: figure out proper way to say value is a FilingOption
      filingOption: (value: any),
    }));
  }

  render() {
    const { income, filingOption } = this.state;
    const taxes = federalIncomeTax(brackets2017[filingOption], income);
    const rate = taxes / income;
    return (
      <Container>
        <div>
          <div>
            gross income:
            <input
              type="number"
              value={income}
              onChange={this.handleIncomeChange}
            />
          </div>
          <div>
            filing option:
            {filingOptions.map(option => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  checked={option === filingOption}
                  onChange={this.handleFilingOptionChange}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        <TaxBrackets brackets={brackets2017[filingOption]} income={income} />
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
            <LineSeries data={computedTaxRates[filingOption]} />
            {taxIntervals[filingOption].map((data, i) =>
              <LineSeries key={i} data={data} strokeStyle="dashed" />
            )}
          </FlexibleXYPlot>
        </GraphContainer>
      </Container>
    )
  }
}

export default App;
