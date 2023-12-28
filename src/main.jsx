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
import Shop from './pages/Shop/Shop';
import Cart from './pages/Cart/Cart';
import MiniCart from './pages/MiniCart/MiniCart';
import ProductInfo from './pages/ProductInfo/ProductInfo';
import { loader as HomeLoader } from './pages/Home/Home';
import { loader as ProductInfoLoader } from './pages/ProductInfo/ProductInfo';
// import { loader as ShopLoader } from './pages/Shop/Shop';
import { MiniCartProvider } from './pages/MiniCart/MiniCartContext';
const router = createBrowserRouter([
  {
    element: (
      <MiniCartProvider>
        <div>
          <Header />
          <MiniCart />
        </div>
      </MiniCartProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: HomeLoader,
      },
      {
        path: 'shop',
        element: <Shop />,
        // loader: ShopLoader,
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
