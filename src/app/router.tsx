import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Home from "../features/home/pages/home";
import Products from "../features/products/pages/ProductList";
// import ProductDetails from "../features/products/pages/ProductDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      //   { path: "products/:id", element: <ProductDetails /> },
    ],
  },
]);
