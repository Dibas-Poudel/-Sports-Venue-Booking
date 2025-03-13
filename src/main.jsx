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
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import AdminPannel from './pages/Admin Pannel/AdminPannel.jsx';





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
        element: <>
          <Indoor />
        </>
      },
      {
        path: 'games/outdoor',
        element:<>
           <Outdoor />
        </>
      },
      {
        path: 'games/playstation',
        element: <>
          <PlayStation />
        </>
      },
      {
        path: '/games',
        element: < >
          <Games>
            
          </Games>
        </>
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
 {
  path:"/admin",
  element:<ProtectedAdminRoute>
    <AdminPannel/>
  </ProtectedAdminRoute>
 }
  ]
}]);

createRoot(document.getElementById('root')).render(

    <StrictMode>
     <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
  
);
