import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './home/App.tsx';
import WebGISScreen from './webgis/WebGISScreen.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Navbar from './shared/components/Navbar/index.tsx';
import FloatingNavbar from './shared/components/FloatingNavbar/index.tsx';

import { QueryClient, QueryClientProvider } from 'react-query';
import AdminScreen from './admin/AdminScreen.tsx';
import LoginScreen from './admin/Screens/LoginScreen.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <FloatingNavbar />
        <App />
      </>
    ),
  },
  {
    path: '/webgis',
    element: (
      <div className="h-screen overflow-hidden">
        <Navbar className="border-b-2" />
        <WebGISScreen />
      </div>
    ),
  },
  {
    path: '/admin',
    element: (
      <div className="h-screen overflow-hidden">
        {/* <Navbar className="border-b-2" /> */}
        <AdminScreen />
      </div>
    ),
  },
  {
    path: '/login',
    element: (
      <div className="h-screen overflow-hidden">
        {/* <Navbar className="border-b-2" /> */}
        <LoginScreen />
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
