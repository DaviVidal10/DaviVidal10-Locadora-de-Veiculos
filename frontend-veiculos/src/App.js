import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VeiculosPage from "./pages/VeiculosPage";
import UsuariosPage from "./pages/UsuariosPage";
import VenderVeiculoPage from "./pages/VenderVeiculoPage";
import ComprasUsuarioPage from "./pages/ComprasUsuarioPage"; // importe a página correta

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VeiculosPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/vender/:id" element={<VenderVeiculoPage />} />
        <Route path="/compras/:id" element={<ComprasUsuarioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
