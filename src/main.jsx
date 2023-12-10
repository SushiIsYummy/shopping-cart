import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import './index.css'
import Header from './components/Header/Header';
import ErrorPage from './pages/ErrorPage';
import Shop from './pages/Shop';
import Cart from './pages/Cart';

const router = createBrowserRouter([
  {
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: 'shop',
            element: <Shop />
          },
          {
            path: 'cart',
            element: <Cart />
          },
        ]
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
