import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './home/App.tsx';
import WebGIS from './webgis/App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Navbar from './common/Navbar/index.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <App />
      </>
    ),
  },
  {
    path: '/webgis',
    element: (
      <>
        <Navbar />
        <WebGIS />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);