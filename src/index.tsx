import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { LicenseManager } from 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { store } from './state/store';
import AppRouter from './AppRouter';
import reportWebVitals from './reportWebVitals';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.scss';
import { AG_GRID_LICENCE_KEY } from './app/config';

LicenseManager.setLicenseKey(AG_GRID_LICENCE_KEY);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
