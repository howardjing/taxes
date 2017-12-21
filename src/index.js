// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-vis/dist/style.css';
import { buildBrackets } from './compute-taxes';
import type { Bracket } from './compute-taxes';
import App from './app';
import './global.css';

const el = document.querySelector('#app');

if (el) {
  ReactDOM.render(
    <App />,
    el,
  );
}

