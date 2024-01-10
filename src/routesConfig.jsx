import {
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import Home from './pages/Home/Home';
import './index.css'
import Header from './components/Header/Header';
import ErrorPage from './pages/Error/ErrorPage';
import Shop from './pages/Shop/Shop';
import Cart from './pages/Cart/Cart';
import MiniCart from './pages/MiniCart/MiniCart';
import ProductInfo from './pages/ProductInfo/ProductInfo';
import ScrollToTop from "./ScrollToTop";
import { loader as HomeLoader } from './pages/Home/Home';
import { loader as ProductInfoLoader } from './pages/ProductInfo/ProductInfo';
import { MiniCartProvider } from './pages/MiniCart/MiniCartContext';
import { loader as ShopLoader } from "./pages/Shop/ShopLoader";

const routesConfig = [
  {
    path: "/",
    element: (
      <MiniCartProvider>
        <Header />
        <MiniCart />
        <Outlet />
        <ScrollRestoration
          getKey={(location, matches) => {
            // default behavior
            return location.key;
          }}
        />
      </MiniCartProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Home />,
            loader: HomeLoader,
          },
          {
            path: 'shop',
            element: <Shop />,
            loader: ShopLoader,
            },
            {
              path: 'cart',
              element: <Cart />
            },
            {
              path: 'products/:productType/:productId',
              element:  (
                <>
                  <ScrollToTop />
                  <ProductInfo />,
                </>
              ),
              
              loader: ProductInfoLoader,
            },
  
        ],  
      },
    ],
  },
];

export default routesConfig;