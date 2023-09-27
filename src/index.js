import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.js';

ReactDOM.render(
  <BrowserRouter basename="epitools">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
