import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import AdminRoute from "../components/auth/AdminRoute";

import Home from "../pages/Home";
import Products from "../pages/Products";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Reservations from "../pages/Reservations";
import Login from "../pages/Login";
import DashboardOverview from "../pages/Dashboard";
import DashboardProductos from "../pages/Dashboard/Productos";
import DashboardReservas from "../pages/Dashboard/Reservas";
import DashboardPedidos from "../pages/Dashboard/Pedidos";
import DashboardUsuarios from "../pages/Dashboard/Usuarios";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/reservas" element={<Reservations />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="productos" element={<DashboardProductos />} />
        <Route path="reservas" element={<DashboardReservas />} />
        <Route path="pedidos" element={<DashboardPedidos />} />
        <Route path="usuarios" element={<DashboardUsuarios />} />
      </Route>
    </Routes>
  );
}
