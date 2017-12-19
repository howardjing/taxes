// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { buildBrackets } from './compute-taxes';
import type { Bracket } from './compute-taxes';
import App from './app';

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

const el = document.querySelector('#app');

if (el) {
  ReactDOM.render(
    <App brackets={BRACKETS_2017} income={income} />,
    el,
  );
}

