// @flow
import { select } from 'd3';

const percentOf = (total: number, percent: number) => total * percent;

class Bracket {
  // sum of length of previous brackets including this bracket
  cap: number;
  // how long this bracket is
  length: number;
  // tax rate within this bracket
  percent: number;
  // max amount of taxes for this bracket
  maxAmount: number;

  constructor(cap, length, percent) {
    this.cap = cap;
    this.length = length;
    this.percent = percent;
    this.maxAmount = percentOf(length, percent);
  }
}

const zip = <T, U>(xs: T[], ys: U[]): [T, U][] =>
  xs.map((x, i) =>
    [x, ys[i]]
  );


const buildBrackets = (rawBrackets: [number, number][]): Bracket[] => {
  const firstBracket = [0, 0];
  const previousBrackets = [firstBracket, ...rawBrackets.slice(0, rawBrackets.length - 1)];
  return zip(rawBrackets, previousBrackets).map(([bracket, prevBracket]) => {
    const [cap, percent] = bracket;
    const [prevCap, _] = prevBracket;
    const length = cap - prevCap;
    return new Bracket(cap, length, percent);
  });
}

const BRACKETS_2017: Bracket[] = buildBrackets([
  [9325, 0.1],
  [37950, 0.15],
  [91900, 0.25],
  [191650, 0.28],
  [416700, 0.33],
  [418400, 0.35],
  // [Infinity, 0.396],
]);

/**
 * assumes brackets is sorted in ascending order by cap
 */
const marginalTaxAmount = (allBrackets: Bracket[], income: number): number => {
  return sum(marginalTaxAmounts(allBrackets, income));
};

const marginalTaxAmounts = (allBrackets: Bracket[], income: number): number[] => {
  const brackets = relevantBrackets(allBrackets, income);

  // no relevant brackets means no taxes whooooo
  if (brackets.length === 0) { return []; }

  // if there's only one bracket, just calculate tax rate directly
  if (brackets.length === 1) { return [percentOf(income, brackets[0].percent)]; }

  // when > 2 brackets, things matter
  const tail = brackets.pop();
  const lastFullBracket = brackets[brackets.length - 1].cap;
  const margin = income - lastFullBracket;
  return brackets.map(bracket => bracket.maxAmount).concat([percentOf(margin, tail.percent)]);
}

const relevantBrackets = (allBrackets: Bracket[], income: number): Bracket[] => {
  const index = allBrackets.findIndex(bracket => bracket.cap > income);
  return allBrackets.slice(0, index + 1);
}

const sum = (xs: number[]): number => xs.reduce((accum, x) => accum + x, 0);

// =============

const brackets = relevantBrackets(BRACKETS_2017, 10000);
const max = brackets[brackets.length - 1].cap;

select("body")
  .selectAll('bracket')
  .data(brackets)
  .enter().append('div')
    .style('width', bracket => `${bracket.length * 100 / max}%`)
    .style('display', 'inline-block')
    .text(d => d.length);

console.log(marginalTaxAmounts(BRACKETS_2017, 100000));
console.log(marginalTaxAmount(BRACKETS_2017, 100000));
