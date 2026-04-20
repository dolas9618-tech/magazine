import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Стиль файлын импорттау (жолын тексер: егер App.js-пен көрші болса ./assets/... деп басталады)
import './assets/style/style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);