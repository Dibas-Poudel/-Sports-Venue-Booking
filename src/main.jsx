import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

import Layout from './components/Layout';

// Lazy load the pages
const Home = React.lazy(() => import('./pages/Home'));
const Register = React.lazy(() => import('./pages/Register'));
const Login = React.lazy(() => import('./pages/Login'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Games = React.lazy(() => import('./pages/Games'));
const Indoor = React.lazy(() => import('./pages/Indoor'));
const Outdoor = React.lazy(() => import('./pages/Outdoor'));
const PlayStation = React.lazy(() => import('./pages/PlayStation'));
const BookingPage = React.lazy(() => import('./pages/Booking.jsx'));
const Dashboard = React.lazy(() => import('./pages/UserDashboard/Dashboard.jsx'));
const AdminPannel = React.lazy(() => import('./pages/Admin Pannel/AdminPannel.jsx'));

// Import protected routes
import ProtectedRoute from './components/Protected.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense>
      },
      {
        path: '/contact',
        element: <Suspense fallback={<div>Loading...</div>}><Contact /></Suspense>
      },
      {
        path: '/register',
        element: <Suspense fallback={<div>Loading...</div>}><Register /></Suspense>
      },
      {
        path: '/login',
        element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense>
      },
      {
        path: 'games/indoor',
        element: <Suspense fallback={<div>Loading...</div>}><Indoor /></Suspense>
      },
      {
        path: 'games/outdoor',
        element: <Suspense fallback={<div>Loading...</div>}><Outdoor /></Suspense>
      },
      {
        path: 'games/playstation',
        element: <Suspense fallback={<div>Loading...</div>}><PlayStation /></Suspense>
      },
      {
        path: '/games',
        element: <Suspense fallback={<div>Loading...</div>}><Games /></Suspense>
      },
      {
        path: '/book/:game',
        element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><BookingPage /></Suspense></ProtectedRoute>
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense></ProtectedRoute>
      },
      {
        path: '/admin',
        element: <ProtectedAdminRoute><Suspense fallback={<div>Loading...</div>}><AdminPannel /></Suspense></ProtectedAdminRoute>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  </StrictMode>
);
