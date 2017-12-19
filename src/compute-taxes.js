// @flow

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

  constructor(cap: number, length: number, percent: number) {
    this.cap = cap;
    this.length = length;
    this.percent = percent;
    this.taxes = percentOf(length, percent);
  }
}

const sum = (xs: number[]): number => xs.reduce((accum, x) => accum + x, 0);

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

const sumBrackets = (brackets: Bracket[]): number => sum(brackets.map(bracket => bracket.taxes));

/**
 * assumes brackets is sorted in ascending order by cap
 */
const federalIncomeTax = (allBrackets: Bracket[], income: number): number => {
  return sumBrackets(federalIncomeTaxBrackets(allBrackets, income));
};

const federalIncomeTaxBrackets = (allBrackets: Bracket[], income: number): Bracket[] => {
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

export {
  buildBrackets,
  federalIncomeTax,
  federalIncomeTaxBrackets,
  sumBrackets,
};

export type {
  Bracket,
};
