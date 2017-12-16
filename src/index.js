// @flow

const body = document.querySelector('body');
const div = document.createElement('div');
div.innerHTML = "Hello";

if (body) {
  body.appendChild(div);
}

const brackets = [
  { cap: 9325, amount: 0.1 },
  { cap: 37950, amount: 0.15 },
  { cap: 91900, amount: 0.25 },
  { cap: 191650, amount: 0.28 },
  { cap: 416700, amount: 0.33 },
  { cap: 418400, amount: 0.35 },
  { cap: Infinity, amount: 0.396 },
];
