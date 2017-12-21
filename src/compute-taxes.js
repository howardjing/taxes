// @flow

type Currency = number;
type Decimal = number;

const percentOf = (total: Currency, rate: Decimal): Currency => total * rate;

class Bracket {
  min: Currency;
  max: Currency;
  rate: Decimal;

  // derived attributes
  length: Currency;
  taxed: Currency;

  constructor(min: Currency, max: Currency, rate: Decimal) {
    this.min = min;
    this.max = max;
    this.rate = rate;

    // below are derived attributes
    this.length = max - min;
    this.taxed = percentOf(this.length, this.rate);
  }
}

const sum = (xs: number[]): number => xs.reduce((accum, x) => accum + x, 0);

const zip = <T, U>(xs: T[], ys: U[]): [T, U][] =>
  xs.map((x, i) =>
    [x, ys[i]]
  );

const buildBrackets = (rawBrackets: [Currency, Decimal][]): Bracket[] => {
  const firstBracket = [0, 0];
  const previousBrackets = [firstBracket, ...rawBrackets.slice(0, rawBrackets.length - 1)];
  return zip(rawBrackets, previousBrackets).map(([bracket, prevBracket]) => {
    const [max, rate] = bracket;
    const [min, _] = prevBracket;
    return new Bracket(min, max, rate);
  });
}

const sumBrackets = (brackets: Bracket[]): Currency => sum(brackets.map(bracket => bracket.taxed));

/**
 * assumes brackets is sorted in ascending order by cap
 */
const federalIncomeTax = (brackets: Bracket[], income: Currency): Currency => {
  return sumBrackets(federalIncomeTaxBrackets(brackets, income));
};

const federalIncomeTaxBrackets = (brackets: Bracket[], income: number): Bracket[] => {
  const relevant = relevantBrackets(brackets, income);

  // no relevant brackets means no taxes whooooo
  if (relevant.length === 0) { return []; }

  // if there's only one bracket, just calculate tax rate directly
  if (relevant.length === 1) { return [new Bracket(relevant[0].min, income, relevant[0].rate)]; }

  // when > 2 brackets, things matter
  const tail = relevant.pop();
  const min = relevant[relevant.length - 1].max;
  return relevant.concat([new Bracket(min, income, tail.rate)]);
}

/**
 * all brackets that are strictly less than the given income
 */
const relevantBrackets = (brackets: Bracket[], income: Currency): Bracket[] => {
  const index = brackets.findIndex(bracket => bracket.max > income)
  return brackets.slice(0, index + 1);
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
