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
const SingleSportDetail= React.lazy(() => import('./pages/SingleSportDetail.jsx'));

// Import protected routes
import ProtectedRoute from './components/Protected.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import Spinner from './components/Spinner.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Suspense fallback={<Spinner/>}><Home /></Suspense>
      },
      {
        path: '/contact',
        element: <Suspense fallback={<Spinner/>}><Contact /></Suspense>
      },
      {
        path: '/register',
        element: <Suspense fallback={<Spinner/>}><Register /></Suspense>
      },
      {
        path: '/login',
        element: <Suspense fallback={<Spinner/>}><Login /></Suspense>
      },
      {
        path: 'games/indoor',
        element: <Suspense fallback={<Spinner/>}><Indoor /></Suspense>
      },
      {
        path: 'games/outdoor',
        element: <Suspense fallback={<Spinner/>}><Outdoor /></Suspense>
      },
      {
        path: 'games/playstation',
        element: <Suspense fallback={<Spinner/>}><PlayStation /></Suspense>
      },
      {
        path: '/games',
        element: <Suspense fallback={<Spinner/>}><Games /></Suspense>
      },
      {
        path: '/book/:game',
        element: <ProtectedRoute><Suspense fallback={<Spinner/>}><BookingPage /></Suspense></ProtectedRoute>
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Suspense fallback={<Spinner/>}><Dashboard /></Suspense></ProtectedRoute>
      },
      {
        path: '/admin',
        element: <ProtectedAdminRoute><Suspense fallback={<Spinner/>}><AdminPannel /></Suspense></ProtectedAdminRoute>
      },
      {
         path:"/sports/:id",
          element:<Suspense fallback={<Spinner/>}><SingleSportDetail /></Suspense>

      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={2000} />
    </Provider>
  </StrictMode>
);
