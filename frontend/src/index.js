import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import ChatHistory from './ChatHistory';
import FallbackPage from './fallback';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Router>
  <Routes>
  <Route path="/" element={<App />} />
  <Route path="/chat/:id/:msg_id" element={<ChatHistory />} />
  {/* Add fallback page only html */}
  <Route path="*" element={<FallbackPage/>} />
  </Routes>
  </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
