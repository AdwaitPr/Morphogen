import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';

if (import.meta.env.DEV) {
  import('@axe-core/react')
    .then((axe) => {
      axe.default(React, ReactDOM, 1000);
    })
    .catch(() => {});
}

const createRootFn =
  ReactDOMClient.createRoot ||
  (ReactDOMClient as unknown as { default: { createRoot: typeof ReactDOMClient.createRoot } }).default
    ?.createRoot;

const container = document.getElementById('root')!;
const root = createRootFn(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
