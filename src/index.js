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
  taxes: number;

  constructor(cap, length, percent) {
    this.cap = cap;
    this.length = length;
    this.percent = percent;
    this.taxes = percentOf(length, percent);
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
  [Infinity, 0.396],
]);

/**
 * assumes brackets is sorted in ascending order by cap
 */
const marginalTaxAmount = (allBrackets: Bracket[], income: number): number => {
  return sum(marginalTaxAmounts(allBrackets, income).map(bracket => bracket.taxes));
};

const marginalTaxAmounts = (allBrackets: Bracket[], income: number): Bracket[] => {
  const brackets = relevantBrackets(allBrackets, income);

  // no relevant brackets means no taxes whooooo
  if (brackets.length === 0) { return []; }

  // if there's only one bracket, just calculate tax rate directly
  if (brackets.length === 1) { return [new Bracket(income, income, brackets[0].percent)]; }

  // when > 2 brackets, things matter
  const tail = brackets.pop();
  const lastFullBracket = brackets[brackets.length - 1].cap;
  const margin = income - lastFullBracket;
  return brackets.concat([new Bracket(income, margin, tail.percent)]);
}

const relevantBrackets = (allBrackets: Bracket[], income: number): Bracket[] => {
  const index = allBrackets.findIndex(bracket => bracket.cap > income)
  return allBrackets.slice(0, index + 1);
}

const sum = (xs: number[]): number => xs.reduce((accum, x) => accum + x, 0);

// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
const dollars = (n: number): string => `$${n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`
// =============

const income = 100000;
const brackets = marginalTaxAmounts(BRACKETS_2017, income);
const max = income;

const body = document.querySelector('body');
if (!body) { throw new Error('huh oh' )}

const header = document.createElement('h1');
header.innerHTML = `Income: ${dollars(income)}`;

const container = document.createElement('div');

const taxed = marginalTaxAmount(BRACKETS_2017, income);
const rate = taxed / income;
const taxes = document.createElement('div');
taxes.innerHTML = `Taxes: ${dollars(taxed)} | Tax rate: ${(rate * 100).toFixed(3)}%`;


body.appendChild(header);
body.appendChild(container);
body.appendChild(taxes);

const wrapper = select(container)
  .selectAll('bracket')
  .data(brackets)
  .enter()
    .append('div')
      .style('width', (bracket) => `${(bracket.length / max) * 90}%`)
      .style('height', '60px')
      .style('display', 'inline-block')
      .style('background-color', 'green')
      .style('margin', '0 10px 0 0')

wrapper
    .append('span')
    .style('float', 'right')
    .text( (bracket) => dollars(bracket.length))

wrapper
    .append('span')
    .style('height', '100%')
    .style('background-color', 'purple')
    .style('width', (bracket) => `${bracket.percent * 100}%`)
    .style('float', 'left')
    .text( (bracket) => dollars(bracket.taxes))

console.log(relevantBrackets(BRACKETS_2017, income));
console.log(marginalTaxAmounts(BRACKETS_2017, income));
console.log(zip(relevantBrackets(BRACKETS_2017, income), marginalTaxAmounts(BRACKETS_2017, income)))
console.log(marginalTaxAmount(BRACKETS_2017, income));
