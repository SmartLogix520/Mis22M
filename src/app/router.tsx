import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Home from "../features/home/pages/home";
import ProductList from "../features/products/pages/ProductList";
import ProductDetails from "../features/products/pages/ProductDetails";
import About from "../features/about/pages/About";
import Contact from "../features/contact/pages/Contact";

// Nouvelles pages publiques
import StoresPage from "../features/stores/pages/StoresPage";

// Panel Admin
import AdminLayout from "../features/admin/layout/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminStores from "../features/admin/pages/AdminStores";
import AdminProducts from "../features/admin/pages/AdminProducts";
import AdminCategories from "../features/admin/pages/AdminCategories";
import AdminRanges from "../features/admin/pages/AdminRanges";
import AdminFavorites from "../features/admin/pages/AdminFavorites";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/category/:slug", element: <ProductList /> },
      { path: "/produits", element: <ProductList /> },
      { path: "/best-sellers", element: <ProductList /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "points-de-vente", element: <StoresPage /> },
    ],
  },

  // ── Panel Admin (layout dédié, sans Navbar/Footer public) ────
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard",  element: <AdminDashboard /> },
      { path: "stores",     element: <AdminStores /> },
      { path: "products",   element: <AdminProducts /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "ranges",     element: <AdminRanges /> },
      { path: "favorites",  element: <AdminFavorites /> },
    ],
  },
]);
