import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routesConfig from '../routesConfig';
import Header from '../components/Header/Header';

export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui),
  };
};

// export const renderWithRouter = (route = '/') => {
//   window.history.pushState({}, 'Test page', route);
//   return {
//     user: userEvent.setup(),
//     ...render(<RouterProvider router={createBrowserRouter(routesConfig)} />),
//   };
// };
