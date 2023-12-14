import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home/Home';
import './index.css'
import Header from './components/Header/Header';
import ErrorPage from './pages/ErrorPage';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductInfo from './pages/ProductInfo/ProductInfo';
import { loader as HomeLoader } from './pages/Home/Home';
import { loader as ProductInfoLoader } from './pages/ProductInfo/ProductInfo';

const router = createBrowserRouter([
  {
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: HomeLoader,
      },
      {
        path: 'shop',
        element: <Shop />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'products/:productType/:productId',
        element: <ProductInfo />,
        loader: ProductInfoLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
