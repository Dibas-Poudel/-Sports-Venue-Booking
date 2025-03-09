import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import {store} from './store/store.js';

import Layout from './components/Layout';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Games from './pages/Games';
import Indoor from './pages/Indoor';
import Outdoor from './pages/Outdoor';
import PlayStation from './pages/PlayStation';
import ProtectedRoute from './components/Protected.jsx';
import BookingPage from './pages/Booking.jsx';
import Dashboard from './pages/UserDashboard/Dashboard.jsx';





const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children:[
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: 'games/indoor',
        element: <ProtectedRoute>
          <Indoor />
        </ProtectedRoute>
      },
      {
        path: 'games/outdoor',
        element:<ProtectedRoute>
           <Outdoor />
        </ProtectedRoute>
      },
      {
        path: 'games/playstation',
        element: <ProtectedRoute>
          <PlayStation />
        </ProtectedRoute>
      },
      {
        path: '/games',
        element: <ProtectedRoute >
          <Games>
            
          </Games>
        </ProtectedRoute>
      },
     {
      path:"/book/:game",
      element:<ProtectedRoute>
       <BookingPage />
      </ProtectedRoute>
   },
   {
    path:"/dashboard",
    element:<ProtectedRoute>
     <Dashboard />
    </ProtectedRoute>
 },
  ]
}]);

createRoot(document.getElementById('root')).render(

    <StrictMode>
     <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
  
);
