import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// todo: socket 언제 닫을지?
const socket = io(process.env.REACT_APP_SERVER_URL as string, {
  path: '/socket.io/socket.io.js',
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App socket={socket} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
