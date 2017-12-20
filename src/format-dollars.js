// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
const dollars = (n: number): string => `$${n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;

export default dollars;
