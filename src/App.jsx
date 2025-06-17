import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./assets/css/global.css";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import PaginaLogin from "./paginas/PaginaLogin";
import PaginaRegistro from "./paginas/PaginaRegistro";
import PaginaHome from "./paginas/PaginaHome";
import PaginaDetalleProducto from "./paginas/PaginaDetalleProducto";
import PaginaCarrito from "./paginas/PaginaCarrito";
import PaginaCheckout from "./paginas/PaginaCheckout";
import PaginaEditarPerfil from "./paginas/PaginaEditarPerfil";
import AdminLayout from "./admin/AdminLayout";
import PanelAdmin from "./admin/paginas/PanelAdmin";
import AdminCrearProducto from "./admin/paginas/AdminCrearProducto";
import AdminEditarProducto from "./admin/paginas/AdminEditarProducto";
import AdminListadoPedidos from "./admin/paginas/AdminListadoPedidos";
import AdminListadoProductosComponent from "./admin/paginas/AdminListadoProductos"; 
import AdminGestionUsuarios from "./admin/paginas/AdminGestionUsuarios";
import RutaProtegidaAdmin from './rutas/RutaProtegidaAdmin';

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/registro" element={<PaginaRegistro />} />
            <Route path="/productos" element={<PaginaHome />} />
            <Route path="/producto/:id" element={<PaginaDetalleProducto />} />
            <Route path="/carrito" element={<PaginaCarrito />} />
            <Route path="/checkout" element={<PaginaCheckout />} />
            <Route path="/editar-perfil" element={<PaginaEditarPerfil />} />
            <Route path="/admin" element={<RutaProtegidaAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<PanelAdmin />} />
                <Route path="productos" element={<AdminListadoProductosComponent />} />
                <Route path="crear-producto" element={<AdminCrearProducto />} />
                <Route path="editar-producto/:id" element={<AdminEditarProducto />} />
                <Route path="pedidos" element={<AdminListadoPedidos />} />
                <Route path="usuarios" element={<AdminGestionUsuarios />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;