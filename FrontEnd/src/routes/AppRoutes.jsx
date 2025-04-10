import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "../context/AuthContext.jsx";
import Header from "../components/Header.jsx";
import FincaPage from "../pages/Fincas.jsx";
import ProductoPage from "../pages/Productos.jsx";
import TiposCafePage from '../pages/TiposCafe.jsx'
import LotesPage from '../pages/Lotes.jsx'
import CompradoresPage from "../pages/Compradores.jsx";
import InventarioPage from "../pages/Inventario.jsx";
import VentasPage from "../pages/Ventas.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/Fincas" element={<FincaPage />} />
          <Route path="/Productos" element={<ProductoPage />} />
          <Route path="/Tipos_de_cafe" element={<TiposCafePage />} />
          <Route path="/Lotes" element={<LotesPage />} />
          <Route path="/Compradores" element={<CompradoresPage />} />
          <Route path="/Inventario" element={<InventarioPage />} />
          <Route path="/Ventas" element={<VentasPage />} />


          <Route path="/" element={<Navigate to="/Fincas" />} />
          <Route path="*" element={<Navigate to="/Fincas" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
