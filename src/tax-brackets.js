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

const Brace = styled.div`
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  margin: 10px 0;
  height: 10px;
  width: 100%;
  border: 1px solid black;
  border-top: 0;
`;

const Tick = styled.div`
  height: 10px;
  background: repeating-linear-gradient(-45deg,
    transparent,
    transparent 3px,
    #555 3px,
    #555 6px
  );
  border-right: 1px solid black;
`;

const BracketInfo = styled.div`
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
            <Brace>
              <Tick style={{ width: percent(taxedWidth) }} />
            </Brace>
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
