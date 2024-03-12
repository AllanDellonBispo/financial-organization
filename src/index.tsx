import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './login';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider} from '@chakra-ui/react';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import App from './pages/home';
import Home from './pages/home';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ChakraProvider>
    <React.StrictMode>
      <BrowserRouter basename='/'>
        {/* <App /> */}
        {/* <Login/> */}
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/home' element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
