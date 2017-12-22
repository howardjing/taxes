// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { federalIncomeTaxBrackets } from './compute-taxes';
import type { Bracket } from './compute-taxes';
import dollars from './format-dollars';

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

const TaxBrackets = ({ brackets, income }: Props) => {
  const taxBrackets = federalIncomeTaxBrackets(brackets, income);
  return (
    <div>
      <div>
        {taxBrackets.map(bracket => {
          const bracketWidth = bracket.length / income * 90;
          const taxedWidth = bracket.rate * 100;
          return (
            <BracketWrapper key={bracket.max} style={{ width: `${bracketWidth}%` }}>
              <Taxed style={{ width: `${taxedWidth}%` }}>{dollars(bracket.taxed)}</Taxed>
            </BracketWrapper>
          )
        })}
      </div>
    </div>
  )
};

export default TaxBrackets;
