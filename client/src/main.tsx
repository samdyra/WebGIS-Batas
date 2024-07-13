import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './home/App.tsx';
import WebGIS from './webgis/App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Navbar from './shared/components/Navbar/index.tsx';
import { useQueryClient, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

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
      <div className="h-screen overflow-hidden">
        <Navbar className="border-b-2" />
        <WebGIS />
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
