import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Home from "../features/home/pages/home";
import ProductList from "../features/products/pages/ProductList";
import ProductDetails from "../features/products/pages/ProductDetails";
import About from "../features/about/pages/About";
import Contact from "../features/contact/pages/Contact";

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
      {
        path: "/about", // 🔥
        element: <About />,
      },
      {
        path: "/contact", // 🔥
        element: <Contact />,
      },
    ],
  },
]);
