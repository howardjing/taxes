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

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const BracketComponent = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  position: relative;
  background-color: green;
  height: 60px;
`;

const Taxed = styled.div`
  height: 100%;
  background-color: purple;
`;

const TaxedLabel = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
`;

const BracketInfo = styled.div`
  &::before {
    content: ' ';
    display: block;
    margin-top: 10px;
    height: 10px;
    width: 100%;
    border: 1px solid black;
    border-top: 0;
  }
`;

const percent = (n: string | number) => `${n}%`;

const TaxBrackets = ({ brackets, income }: Props) => {
  const taxBrackets = federalIncomeTaxBrackets(brackets, income);
  return (
    <Wrapper>
      {taxBrackets.map(bracket => {
        const bracketWidth = bracket.length / income * 90;
        const taxedWidth = bracket.rate * 100;
        return (
          <div key={bracket.max} style={{ width: percent(bracketWidth) }}>
            <BracketComponent>
              <TaxedLabel>{dollars(bracket.length)}</TaxedLabel>
              <Taxed style={{ width: percent(taxedWidth) }} />
            </BracketComponent>
            <BracketInfo>
               <div>{dollars(bracket.length)} × {percent((bracket.rate * 100).toFixed(2))}</div>
               <div>{dollars(bracket.taxed)}</div>
            </BracketInfo>
          </div>
        )
      })}
    </Wrapper>
  )
};

export default TaxBrackets;
