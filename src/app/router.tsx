import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Home from "../features/home/pages/home";
import ProductList from "../features/products/pages/ProductList";
import ProductDetails from "../features/products/pages/ProductDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "/category/:slug",
        element: <ProductList />,
      },

      { path: "/product/:id", element: <ProductDetails /> },
    ],
  },
]);
