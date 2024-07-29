import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer /> {/* Add ToastContainer to render toasts */}
  </React.StrictMode>,
  document.getElementById('root')
);
