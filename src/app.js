// @flow
import React from 'react';
import styled from 'styled-components';
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  FlexibleXYPlot,
} from 'react-vis';
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
for (let i=1000; i <= 1000000; i += 1000) {
  intervals.push(i);
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const GraphContainer = styled.div`
  height: 50%;
`;

const App = () => (
  <Container>
    <TaxBrackets brackets={BRACKETS_2017} income={income} />
    <GraphContainer>
      <FlexibleXYPlot yDomain={[0, 1]}>
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="gross income" />
        <YAxis title="tax rate" />
        <LineSeries
          data={intervals.map(income => {
            const taxes = federalIncomeTax(BRACKETS_2017, income);
            const rate = taxes / income;
            return { x: income, y: rate };
          })}
        />
      </FlexibleXYPlot>
    </GraphContainer>
  </Container>
)

export default App;
