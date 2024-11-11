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
import LoginScreen from './auth/LoginScreen.tsx';
import ProtectedRoute from './auth/utils/ProtectedRoute.tsx';

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
      <ProtectedRoute>
        <div className="h-screen overflow-hidden">
          <AdminScreen />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <div className="h-screen overflow-hidden">
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
